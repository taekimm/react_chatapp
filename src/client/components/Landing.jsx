import React, { Component } from "react";
import io from "socket.io-client";

import RoomSelect from "./RoomSelect";
import UsernameInput from "./UsernameInput";
import Chat from "./Chat";
import Messages from "./Messages";

class Landing extends Component {
  constructor(props) {
    super(props);

    this.state = {
      socketID: "",
      username: "",
      zipcode: "",
      activeRoom: "",
      allChatRooms: [],
      messages: []
    };

    this.socket = io("localhost:5000");

    // socket methods
    this.socket.on("SOCKET_ID", data => {
      addSocketID(data);
    });

    this.socket.emit("FIND_CITY", this.state.zipcode)

    this.socket.on("ACTIVE_ROOMS", data => {
      updateAllChatRooms(data);
    });

    this.socket.on("UPDATE_CHAT", (username, message) => {
      this.addMessage(username, message);
    });

    // helper methods for Sockets
    const addSocketID = data => {
      this.setState({ socketID: data });
    };

    const updateAllChatRooms = data => {
      this.setState({ allChatRooms: data });
    };

    // rebinding this
    this.setUsername = this.setUsername.bind(this);
    this.setActiveRoom = this.setActiveRoom.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.addMessage = this.addMessage.bind(this);
  }

  addMessage(username, message) {
    let formattedMessage = `${username}: ${message}`;
    this.setState({ messages: [...this.state.messages, formattedMessage] });
  }

  setUsername(name) {
    this.setState({ username: name });
  }

  setActiveRoom(event) {
    event.preventDefault();
    this.setState({ activeRoom: event.target.value });
    this.socket.emit("JOIN_ROOM", {
      userID: this.state.socketID,
      roomName: event.target.value,
      username: this.state.username
    });
    // this.addMessage(username, message);
  }

  sendMessage(message) {
    this.socket.emit("MESSAGE_SENT", {
      roomName: this.state.activeRoom,
      username: this.state.username,
      message: message
    });
    this.addMessage(this.state.username, message);
  }

  // method for conditional loading RoomSelect or Messages
  renderChatArea(activeChatRoom) {
    if (activeChatRoom) {
      return <Messages messages={this.state.messages} roomName={this.state.activeRoom} />;
    } else {
      return (
        <RoomSelect
          allRooms={this.state.allChatRooms}
          setActiveRoom={this.setActiveRoom}
        />
      );
    }
  }

  // method for conditional loading Chat or UsernameInput
  renderInputArea(username) {
    if (username) {
      return (
        <Chat username={this.state.username} sendMessage={this.sendMessage} isInChat={this.state.activeRoom} />
      );
    } else {
      return <UsernameInput setUsername={this.setUsername} />;
    }
  }

  render() {
    let isInChat = this.state.activeRoom ? true : false;
    let hasUsername = this.state.username ? true : false;

    return (
      <div>
        <fieldset>
          <legend>React ChatApp!</legend>
          {this.renderChatArea(isInChat)}
          {this.renderInputArea(hasUsername)}
        </fieldset>
      </div>
    );
  }
}

export default Landing;
