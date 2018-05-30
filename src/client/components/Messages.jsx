import React, { Component } from "react";

class Messages extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        {this.props.messages.map(message => {
          return (
            <div>
              {message.author}: {message.message}
            </div>
          );
        })}
      </div>
    );
  }
}

export default Messages;
