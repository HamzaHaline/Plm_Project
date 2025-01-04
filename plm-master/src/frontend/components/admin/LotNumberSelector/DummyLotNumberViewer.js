import React, {Component} from 'react';
import LotNumberSelector from './LotNumberSelector.js';
import TextField from 'material-ui/TextField';
class DummyLotNumberViewer extends Component {
  
  constructor(props) {
    super(props)
    this.state = {
      lotNumberArray: [],
      totalAssigned: 0,
      quantity: 50,
    };
    this.updateArray = this.updateArray.bind(this);
  }

  updateArray(inputArray){
    var sum = 0;
    for(var i=0; i<inputArray.length;i++){
      sum+=parseInt(inputArray[i].package);
      console.log(inputArray[i].package);
    }
    if(!sum){
      sum=0;
    }
    console.log("current sum " + sum);
    this.setState({lotNumberArray:inputArray});
    this.setState({totalAssigned:sum});
  }

  handleChange = name => event => {
      this.setState({
        [name]: event.target.value,
      });
  };

  render() {
    return (
      <div>
        <TextField
          label="Quantity"
          value={this.state.quantity}
          onChange={this.handleChange('quantity')}
        />
        <br/>
        <LotNumberSelector quantity={this.state.quantity} updateArray={this.updateArray} totalAssigned={this.state.totalAssigned}/>
      </div>
    );
  }
}

export default DummyLotNumberViewer