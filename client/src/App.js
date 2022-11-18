import React, {Component} from "react";
import getWeb3 from "./getWeb3";

import "./App.css";

const CONTRACT_ADDRESS = "0x8b6594ef218DBa855e3069C71F35Ba27Ebf41056";
const CONTRACT_ABI = require("./contracts/SimpleStorage.json").abi;

class App extends Component {
  state = {storageValue: 0, web3: null, accounts: null, contract: null, toStoreValue: null};

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the network ID
      const networkId = await web3.eth.net.getId();

      // Create the Smart Contract instance
      const instance = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
      console.log(instance);

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({web3, accounts, networkId, contract: instance, toStoreValue: null});

      await this.getMethod();
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  //TODO: set method to interact with Storage Smart Contract
  setMethod = async () => {
    await this.state.contract.methods.set(+this.state.toStoreValue).send({from: this.state.accounts[0]});
    await this.getMethod();
    console.log(this.state.storageValue);
  };
  //TODO: get function to interact with Storage Smart Contract
  getMethod = async () => {
    const storageValue = await this.state.contract.methods.get().call();
    this.setState({storageValue});
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Good to Go!</h1>
        <p>Your Truffle Box is installed and ready.</p>
        <h2>Smart Contract Example</h2>
        <br/><br/>
        <div>The stored value is: {this.state.storageValue}</div>
        <br/><br/>
        <button onClick={this.getMethod}>Get value</button>
        &nbsp;
        <button onClick={this.setMethod}>Update value</button>
        <input placeholder="Insert a number" onChange={(e) => this.setState({toStoreValue: e.target.value})}/>
        <div>{this.state.accounts[0]}</div>
      </div>
    );
  }
}

export default App;
