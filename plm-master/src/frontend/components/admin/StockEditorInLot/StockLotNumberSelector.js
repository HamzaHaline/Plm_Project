import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
import Tooltip from 'material-ui/Tooltip';
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';
import { FormControl, FormGroup, FormHelperText } from 'material-ui/Form';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import LotNumberArray from './StockLotNumberArray';
import { ToastContainer, toast } from 'react-toastify';

class LotNumberSelector extends Component {

  constructor(props) {
    super(props)
    this.state = {
      // totalAssigned: (this.props.numUnit)?(this.props.numUnit):0, //total number assigned
      lotNumberArray:[],
      currentLotNumber:'',
      currentQuantity:'',
      nativeUnit:(this.props.nativeUnit)?(this.props.nativeUnit):'',
      initialArray:(this.props.initialArray)?(this.props.initialArray):[],
    };
    // this.addLotNumberItem = this.addLotNumberItem.bind(this);
    // this.deleteLotNumberItem = this.deleteLotNumberItem.bind(this);
    // this.updateLotNumber = this.updateLotNumber.bind(this);
    this.updateQuantity = this.updateQuantity.bind(this);
    // this.updateCurrentLotNumber = this.updateCurrentLotNumber.bind(this);
    // this.updateCurrentQuantity = this.updateCurrentQuantity.bind(this);
    // this.loadLotNumbersArray = this.loadLotNumbersArray.bind(this);
    // this.checkLotNumberUnique = this.checkLotNumberUnique.bind(this);
    // this.checkLotNumberAlphanumeric = this.checkLotNumberAlphanumeric.bind(this);

  }


  componentWillMount(){
    this.loadLotNumbersArray();
  //  this.resetArray();
  console.log("total assigned");
  console.log(this.props.totalAssigned);
  }

  loadLotNumbersArray(){
    console.log("Lot number selector will mount");
    console.log(this.props.initialArray);
    // modify numUnit tag to package tag
    var array =[];
    // for(int i =0; i < this.props.initialArray.length;i++){
    //   var lotNumberObject = new Object();
    //   lotNumberObject.numUnit =
    // }
    this.setState({lotNumberArray:this.props.initialArray},function cb(){
      console.log("lot numbers initialized");
    })
  }

  componentDidUpdate(){
    console.log(this.state.currentQuantity);
    console.log(this.props.quantity);

    var num;
    if(!this.state.currentQuantity){
      num = 0;
    }else{
      num=this.state.currentQuantity;
    }
    if(parseInt(this.props.quantity)<num){
      this.setState({currentQuantity:''});
    }
  }

  updateQuantity(event, index) {
    console.log("update Quantity in textbox");
    console.log(event.target.value);
    var quantity = event.target.value;
    if(index>=0){
      const re = /^\d*\.?\d*$/;
      if(!re.test(quantity)){
        toast.error("Quantity must be a positive integer.", {
          position: toast.POSITION.TOP_RIGHT
        });
      }else{
        this.state.lotNumberArray[index].numUnit = quantity;
        this.setState({lotNumberArray: this.state.lotNumberArray});
        this.props.updateArray(this.state.lotNumberArray);
      }
    }
    console.log(this.props.totalAssigned);
    console.log(this.props.quantity);
  }


  checkLotNumberAlphanumeric(lotNumber){
    const re = /^[a-z0-9]+$/i;
      return (re.test(lotNumber));
  }


  render() {
    return (
      <div>
       {(this.props.totalAssigned>this.props.quantity) ?
          <Typography color="error">Delete Extra Packages: {((this.props.totalAssigned)-(this.props.quantity))}</Typography> :

         ((Number(this.props.quantity)-Number(this.props.totalAssigned)-Number(this.state.currentQuantity))!=0) ?
            <Typography color="error">{"Quantity (" + this.state.nativeUnit + ") left to assign: " +
                                (this.props.quantity-this.props.totalAssigned-this.state.currentQuantity).toString()}</Typography> :
            (this.props.quantity==''||this.props.totalAssigned=='') ? <div></div> :
            <p><font color="green">All stock quantity has been assigned!</font></p>
          }
      {(this.state.lotNumberArray.length>0) &&  <p>{"Quantity (" + this.state.nativeUnit + ") Assigned per lot number"}</p> }
        <LotNumberArray
                nativeUnit={this.state.nativeUnit}
                lotNumberArray={this.state.lotNumberArray}
                // deleteLotNumberItem={this.deleteLotNumberItem}
                updateQuantity={this.updateQuantity}
                updateLotNumber={this.updateLotNumber}/>
      </div>
    );
  }
}

export default LotNumberSelector
