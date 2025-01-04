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
import { ToastContainer, toast } from 'react-toastify';

class LotNumberButton extends Component {

  constructor(props) {
    super(props)
    this.state = {
      lotNumberArray: (this.props.initialArray)?this.props.initialArray:[],
      totalAssigned: (this.props.totalAssigned)?this.props.totalAssigned: 0,
      open: false,
      currentQuantity: this.props.quantity,
      initialArray: (this.props.initialArray)?this.props.initialArray:[],
      allowLotEditing: this.props.allowLotEditing,
      rowData: this.props.rowData,
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
    const re =/^[1-9][0-9]*$/;
    if (event.target.value == '' || re.test(event.target.value)) {
        this.setState({
        currentQuantity: event.target.value,
      });
    this.saveToProps(event.target.value);
    }else{
      toast.error("No. of packages must be a number.", {
        position: toast.POSITION.TOP_RIGHT
      });
    }
  }

  handleCancel(e){
    e.preventDefault();
    this.setState({open:false});
    console.log(this.state.initialArray);
    console.log("hit Cancel");
    this.setState({lotNumberArray:[]});
    this.setState({totalAssigned:0});
    const pendingOrderKey = 'goToPendingOrders';
    sessionStorage.setItem(pendingOrderKey,true)
    //window.location.reload();
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
    console.log("save to props");
    
    var rowData = this.state.rowData;
    console.log("rowData");
    console.log(rowData);
    // var object = new Object();
    rowData.ingredientLots = this.state.lotNumberArray;
    rowData.packageNum = quantity;
    
    this.props.handlePropsChange(rowData);
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

      { this.state.allowLotEditing !== true &&
      <div>
        <TextField
          label="Quantity"
          value={this.state.currentQuantity}
          onChange={this.handleQuantityChange}
          style={{width:90}}
        />
      </div> 
      }

      { this.state.allowLotEditing &&
          <div>
            <Button color="secondary" style={{marginLeft: 0}} raised onClick={(e)=>this.handleClickOpen(e)}>Mark Arrived</Button>
            <Dialog open={this.state.open} onClose={()=>{console.log("clicked");}} >
              <DialogTitle>Assign Lot Number</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  i.e. If you want to assign lot number A123 to 4 packages, enter 4 for number of packages and A123 for lot number.
                </DialogContentText>
                <LotNumberSelector initialArray={this.state.lotNumberArray} quantity={this.state.currentQuantity} updateArray={this.updateArray} totalAssigned={this.state.totalAssigned} fromDetails={false}/>
              </DialogContent>
              <DialogActions>
                <Button onClick={(e)=>this.handleCancel(e)} color="primary">Cancel</Button>
                <Button disabled={!this.checkForEmpty() || (this.state.currentQuantity!=this.state.totalAssigned)} onClick={(e)=>this.handleSave(e)} color="secondary">Save</Button>
              </DialogActions>
            </Dialog>
          </div>
        }

        </div>
    );
  }
}

export default LotNumberButton
