import React, { Component } from "react";

class RoomSelect extends Component {
  constructor(props) {
    super(props);
  }

  // method for conditional loading
  renderRooms(receivedRooms) {
    if (receivedRooms) {
      return <div>Loading...</div>;
    } else {
      return (
        <div>
          {this.props.allRooms.map(room => {
            return (
              <button onClick={this.props.setActiveRoom} value={room.name}>
                {room.name}
              </button>
            );
          })}
        </div>
      );
    }
  }

  checkRooms() {
    if (this.props.allRooms > 0) {
      return true;
    } else {
      return false;
    }
  }

  render() {
    const allChatRoomsLoaded = this.checkRooms();

    return (
      <div>
        <fieldset>
          <legend>All Available Rooms</legend>
          {this.renderRooms(allChatRoomsLoaded)}
        </fieldset>
      </div>
    );
  }
}

export default RoomSelect;
