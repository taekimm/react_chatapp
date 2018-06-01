import React, { Component } from "react";

class UsernameInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: ""
    }

    // rebinding this
    this.handleUsernameChange = this.handleUsernameChange.bind(this) 
    this.setUsername = this.setUsername.bind(this) 
  }

  handleUsernameChange(event) {
    this.setState({ username: event.target.value })
  }

  setUsername(ev) {
    ev.preventDefault()
    this.props.setUsername(this.state.username)
  }

  render() {
    return (
      <div>
        <form onSubmit={this.setUsername}>
          <input
            type="text"
            placeholder="Username"
            value={this.state.username}
            onChange={this.handleUsernameChange}
          />
        </form>
      </div>
    );
  }
}

export default UsernameInput;
