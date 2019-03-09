import React, { Component } from "react";
import axios from "axios";
import "./App.css";
import SubmitButton from "./Components/SubmitButton";
import OutletInformation from "./Components/OutletInformation";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: "",
      resultOutlet: "",
      isLoading: false
    };
  }

  setAddress = e => {
    this.setState({
      address: e.target.value
    });
  };

  setLoading = currentValue => {
    this.setState({
      isLoading: currentValue
    });
  };

  setOutLet() {}

  getOutLet = e => {
    e.preventDefault();
    const self = this;
    this.setLoading(true);

    axios
      .post("http://localhost:5000/outlet", {
        addressDetails: this.state.address
      })
      .then(function(response) {
        console.log(response);
        self.setState({
          resultOutlet: response.data.responseData
        });
      })
      .catch(function(error) {
        self.setState({
          resultOutlet: "No data"
        });
      })
      .finally(function() {
        self.setLoading(false);
      });
  };

  render() {
    return (
      <form className="container honest-food-app" onSubmit={this.getOutLet}>
        <h3 className="text-center">Honest Food App</h3>
        <div className="form-group">
          <label htmlFor="exampleInputAddress">Enter address</label>
          <input
            type="text"
            autoComplete="false"
            value={this.state.address}
            onChange={this.setAddress}
            className="form-control"
            id="exampleInputAddress"
            placeholder="Enter address"
          />
        </div>
        <SubmitButton isLoading={this.state.isLoading} />
        <OutletInformation
          isLoading={this.state.isLoading}
          resultOutlet={this.state.resultOutlet}
        />
      </form>
    );
  }
}

export default App;
