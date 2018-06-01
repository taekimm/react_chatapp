import React, { Component } from "react";

class Messages extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <fieldset>
          <legend>{this.props.roomName}</legend>
        {this.props.messages.map(message => {
          return (
            <div>
              {message}
            </div>
          );
        })}
        </fieldset>
      </div>
    );
  }
}

export default Messages;
