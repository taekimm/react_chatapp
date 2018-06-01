import React, { Component } from "react";

class ZipcodeInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      zipcode: ""
    }

    // rebinding this
    this.handleZipcodeChange = this.handleZipcodeChange.bind(this) 
    this.setZipcode = this.setZipcode.bind(this) 
  }

  handleZipcodeChange(event) {
    this.setState({ zipcode: event.target.value })
  }

  setZipcode(ev) {
    ev.preventDefault()
    this.props.setZipcode(this.state.zipcode)
  }

  render() {
    return (
      <div>
        <form onSubmit={this.setZipcode}>
          <input
            type="number"
            placeholder="Zipcode"
            value={this.state.zipcode}
            onChange={this.handleZipcodeChange}
          />
        </form>
      </div>
    );
  }
}

export default ZipcodeInput;
