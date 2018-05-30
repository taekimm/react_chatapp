import React, { Component } from "react";
import Messages from "./Messages";
import io from "socket.io-client";

class Chat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      socketID: "",
      message: "",
      messages: []
    };

    // rebinding this in this.sendMessage
    this.sendMessage = this.sendMessage.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handleMessageChange = this.handleMessageChange.bind(this);

    this.socket = io("localhost:5000");

    this.socket.on("SOCKET_ID", data => {
      addSocketID(data);
    });

    this.socket.on("RECEIVE_MESSAGE", data => {
      addMessage(data);
    });

    const addSocketID = data => {
      this.setState({ socketID: data });
    };

    const addMessage = data => {
      this.setState({ messages: [...this.state.messages, data] });
    };
  }
  sendMessage(ev) {
    ev.preventDefault();
    this.socket.emit("SEND_MESSAGE", {
      author: this.state.username,
      message: this.state.message
    });
    this.setState({ message: "" });
  }

  handleUsernameChange(event) {
    this.setState({ username: event.target.value });
  }

  handleMessageChange(event) {
    this.setState({ message: event.target.value });
  }

  render() {
    return (
      <div>
        <fieldset>
          <legend>Chat</legend>
          <div>
            <Messages messages={this.state.messages} />
          </div>
        </fieldset>
        <fieldset>
          <div>
            <form>
              <input
                type="text"
                placeholder="Username"
                value={this.state.username}
                onChange={this.handleUsernameChange}
              />
              <br />
              <input
                type="text"
                placeholder="Message"
                value={this.state.message}
                onChange={this.handleMessageChange}
              />
              <br />
              <button onClick={this.sendMessage}>Submit</button>
            </form>
          </div>
        </fieldset>
      </div>
    );
  }
}

export default Chat;
