import React, { Component } from "react";

class Chat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      message: ""
    };

    // rebinding this
    this.handleMessageChange = this.handleMessageChange.bind(this)
    this.sendMessage = this.sendMessage.bind(this)
  }

  handleMessageChange(event) {
    this.setState({ message: event.target.value})
  }

  sendMessage(ev) {
    ev.preventDefault()
    this.props.sendMessage(this.state.message)
    this.setState({ message: ""})
  }

  render() {
    let disableChat = this.props.isInChat ? false : true
    return (
      <div>
        <br />
        <form onSubmit={this.sendMessage}>
          {this.props.username}:
          <input
            type="text"
            placeholder="Type your message here!"
            value={this.state.message}
            onChange={this.handleMessageChange}
            disabled={disableChat}
          />
        </form>
      </div>
    );
  }
}

export default Chat;
