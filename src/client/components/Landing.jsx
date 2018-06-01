import React, { Component } from "react";
import io from "socket.io-client";

import UsernameInput from "./UsernameInput";
import ZipcodeInput from "./ZipcodeInput";
import RoomSelect from "./RoomSelect";
import Chat from "./Chat";
import Messages from "./Messages";

class Landing extends Component {
  constructor(props) {
    super(props);

    this.state = {
      socketID: "",
      username: "",
      zipcode: "",
      location: "",
      activeRoom: "",
      allChatRooms: [],
      messages: [],

      // var for multi-step form
      step: 1
    };

    this.socket = io();

    // socket methods
    this.socket.on("SOCKET_ID", data => {
      this.setState({ socketID: data });
    });

    this.socket.on("SET_CITY", loc => {
      this.setState({ location: loc });
    });

    this.socket.on("ACTIVE_ROOMS", data => {
      this.setState({ allChatRooms: data });
    });

    this.socket.on("UPDATE_CHAT", (username, message) => {
      this.addMessage(username, message);
    });

    // rebinding this
    this.setUsername = this.setUsername.bind(this);
    this.setZipcode = this.setZipcode.bind(this);
    this.setActiveRoom = this.setActiveRoom.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.addMessage = this.addMessage.bind(this);
    this.changeStep = this.changeStep.bind(this);
    this.leaveChat = this.leaveChat.bind(this);
  }

  addMessage(username, message) {
    let formattedMessage = `${username}: ${message}`;
    this.setState({ messages: [...this.state.messages, formattedMessage] });
  }

  setUsername(name) {
    this.setState({ username: name });
    this.changeStep("next");
  }

  setZipcode(zipcode) {
    this.setState({ zipcode: zipcode });
    this.socket.emit("FIND_CITY", {
      socketID: this.state.socketID,
      zipcode: zipcode
    });
    this.changeStep("next");
  }

  setActiveRoom(event) {
    event.preventDefault();
    this.setState({ activeRoom: event.target.value });
    this.socket.emit("JOIN_ROOM", {
      userID: this.state.socketID,
      roomName: event.target.value,
      username: this.state.username
    });
    this.changeStep("next");
  }

  sendMessage(message) {
    this.socket.emit("MESSAGE_SENT", {
      roomName: this.state.activeRoom,
      username: this.state.username,
      message: message
    });
    this.addMessage(this.state.username, message);
  }

  leaveChat() {
    this.socket.emit("LEAVE_ROOM", {
      roomName: this.state.activeRoom,
      username: this.state.username
    });
    this.setState({ activeRoom: "", messages: [] });
    this.changeStep("prev");
  }

  changeStep(dir) {
    if (dir === "prev") {
      console.log("prev flagged");
      this.setState({ step: this.state.step - 1 });
    } else if (dir === "next") {
      this.setState({ step: this.state.step + 1 });
    }
  }

  multiPageReg(step) {
    switch (step) {
      case 1:
        return (
          <UsernameInput
            setUsername={this.setUsername}
            changeStep={this.changeStep}
          />
        );
      case 2:
        return (
          <ZipcodeInput
            setZipcode={this.setZipcode}
            changeStep={this.changeStep}
          />
        );
      case 3:
        return (
          <RoomSelect
            allRooms={this.state.allChatRooms}
            currLocation={this.state.location}
            setActiveRoom={this.setActiveRoom}
            changeStep={this.changeStep}
          />
        );
      case 4:
        return (
          <div>
            <Messages
              messages={this.state.messages}
              roomName={this.state.activeRoom}
              currLocation={this.state.location}
            />
            <Chat
              username={this.state.username}
              currLocation={this.state.location}
              sendMessage={this.sendMessage}
              leaveChat={this.leaveChat}
            />
          </div>
        );
    }
  }

  render() {
    return (
      <div>
        <fieldset>
          <legend>React ChatApp!</legend>
          {this.multiPageReg(this.state.step)}
        </fieldset>
      </div>
    );
  }
}

export default Landing;
