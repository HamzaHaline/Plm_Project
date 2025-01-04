import React, {Component} from 'react';
import LotNumberSelector from './LotNumberSelector.js';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import Paper from 'material-ui/Paper';
import { TableCell } from 'material-ui/Table';
import { FormControl, FormHelperText, FormGroup } from 'material-ui/Form';
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';


class ViewLotButton extends Component {

  constructor(props) {
    super(props)
    this.state = {
      lotNumberArray: (this.props.initialArray)?this.props.initialArray:[],
      totalAssigned: (this.props.totalAssigned)?this.props.totalAssigned: 0,
      open: false,
      currentQuantity: this.props.quantity,
      initialArray: (this.props.initialArray)?this.props.initialArray:[],
    };
    this.updateArray = this.updateArray.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleQuantityChange = this.handleQuantityChange.bind(this);
    this.checkForEmpty = this.checkForEmpty.bind(this);
    console.log("constructor was called");
    console.log(this.props.initialArray); 
  }


  componentDidMount(){
    console.log("lotnumberbutton mounted");
    console.log(this.props.initialArray);
  }

  componentDidUpdate(){
    console.log("lotnumberbutton updated");
    console.log(this.state.lotNumberArray);
  }

  updateArray(inputArray){
    var sum = 0;
    for(var i=0; i<inputArray.length;i++){
      if(inputArray[i].package==''){
        sum+=0;
      }else{
        sum+=parseInt(inputArray[i].package);
      }
      console.log(inputArray[i].package);
    }
    if(!sum){
      sum=0;
    }
    console.log("current sum " + sum);
    this.setState({lotNumberArray:inputArray});
    this.setState({totalAssigned:sum});
    // this.props.handlePropsChange(inputArray);
    //console.log(this.props.initialArray);
  }

  handleQuantityChange(event){
    event.preventDefault();
    console.log("change quantity");
    console.log(event.target.value);
      this.setState({
        currentQuantity: event.target.value,
      });
    this.saveToProps(event.target.value);
  }

  handleCancel(e){
    e.preventDefault();
    this.setState({open:false});
    console.log(this.state.initialArray);
    console.log("hit Cancel");
    this.setState({lotNumberArray:this.props.initialArray});
    this.setState({totalAssigned:this.props.totalAssigned});
    window.location.reload();
    //current workaround...
    //e.stopPropagation();
  }

  handleSave(e){
    console.log("save lots");
    e.preventDefault();
    //send it to backend? or not yet
    this.saveToProps(this.state.currentQuantity);
    this.setState({open:false});
  }

  saveToProps(quantity){
    var object = new Object();
    object.ingredientLots = this.state.lotNumberArray;
    object.packageNum = quantity;
    console.log("save to props");
    console.log(object);
  }

  handleClickOpen(e){
    e.preventDefault();
    this.setState({
      open: true,
    });
    // e.stopPropagation();
  }

  checkForEmpty(){
    for(var i=0; i<this.state.lotNumberArray.length;i++){
      console.log("checking for empty");
      console.log(this.state.lotNumberArray[i].package);
      if(this.state.lotNumberArray[i].package=='' || this.state.lotNumberArray[i].package==0){
        return false;
      }
    }
    return true;
  }

  render() {
    return (
      <div>
        <Button style={{marginTop: 10}} raised onClick={(e)=>this.handleClickOpen(e)}>View Lot Numbers</Button>
        <Dialog open={this.state.open} onClose={()=>{console.log("closed");}} >
            <DialogTitle>Lot Numbers</DialogTitle>
            <DialogContent>
              {this.state.lotNumberArray && this.state.lotNumberArray.map((item,index)=>(
        <div key={index}>
          <FormControl disabled style={{width:100}}>
          <InputLabel># of packages</InputLabel>
            <Input
              required={true}
              type="number"
              value={Math.round(item.package*100)/100}
            />
            <InputLabel></InputLabel>
         </FormControl>
         <FormControl disabled style={{marginLeft:10}}>
            <InputLabel>Lot Number</InputLabel>
          <Input
            required={true}
            value={item.lotNumber}
          />
          <InputLabel></InputLabel>
         </FormControl>
        </div>
      ))}
            </DialogContent>
            <DialogActions>
              {/*<Button onClick={(e)=>this.handleCancel(e)} color="primary">Cancel</Button>*/}
              <Button disabled={!this.checkForEmpty() || (this.state.currentQuantity!=this.state.totalAssigned)} onClick={(e)=>this.handleSave(e)} color="secondary">Close</Button>
            </DialogActions>
          </Dialog>
        </div>
    );
  }
}

export default ViewLotButton
