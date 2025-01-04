import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
//import Select from 'react-select';
import Grid from 'material-ui/Grid';
import IconButton from 'material-ui/IconButton';
import AddCircleIcon from 'material-ui-icons/AddCircle';
import VendorItem from './VendorItem';
import * as vendorActions from '../../interface/vendorInterface.js';
import * as testConfig from '../../../resources/testConfig.js';
import Tooltip from 'material-ui/Tooltip';
import Select from 'material-ui/Select';
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';
import { FormControl, FormGroup, FormHelperText } from 'material-ui/Form';
import { MenuItem } from 'material-ui/Menu';
import Button from 'material-ui/Button';
import { ToastContainer, toast } from 'react-toastify';

// TODO: get session Id from the user
//const sessionId = testConfig.sessionId;
const sessionId = '5a63be959144b37a6136491e';
const READ_FROM_DATABASE = testConfig.READ_FROM_DATABASE;


class SelectVendors extends Component {

  constructor(props) {
    super(props)
    this.state = {
      selectName: "",
      inputPrice: '',
      options: [],
      vendorsArray: this.props.initialArray,
      idToNameMap: {}, //id = key, name=value
    };
    this.updateId = this.updateId.bind(this);
    this.deleteVendor = this.deleteVendor.bind(this);
    this.addVendor = this.addVendor.bind(this);
    this.updatePrice = this.updatePrice.bind(this);
    this.loadVendorsArray = this.loadVendorsArray.bind(this);
    this.loadCodeNameArray = this.loadCodeNameArray.bind(this);
//    this.updateName = this.updateName.bind(this);
//    this.createMap = this.createMap.bind(this);
    this.resetArray = this.resetArray.bind(this);
  }

  componentWillMount(){
    this.loadCodeNameArray();
    this.loadVendorsArray();
  //  this.resetArray();
  }

  componentDidMount(){
  //  this.createMap();
    console.log("componentDidMount()");
    console.log(this.state.options);
  }

  componentDidUpdate(){
    console.log("did update");
    console.log(this.state.vendorsArray);
  }

  loadVendorsArray(){
    console.log("vendors array loaded");
    console.log(this.state.vendorsArray);
    this.setState({vendorsArray: this.props.initialArray});
  }

  async loadCodeNameArray(){
   // var startingIndex = 0;
    var rawData = [];
    rawData = await vendorActions.getAllVendorNamesCodesAsync(sessionId);
    console.log("loadCodeNameArray was called");
    console.log(rawData.data);
    var optionsArray = rawData.data.map(obj=>{
    var temp = new Object();
    temp.vendorName = obj.vendorName;
    temp.label = obj.vendorName;
    return temp;
    })
    var ans = optionsArray;
    for(var i=0; i<this.props.initialArray.length; i++){
      console.log("initialArray");
      console.log(this.props.initialArray);

      ans = ans.filter(option=>option.vendorName!=this.props.initialArray[i].vendorName);

    //  var index = optionsArray.map(item=>{item.vendorName; console.log(item.vendorName);}).indexOf(this.props.initialArray[i].vendorName);
      console.log(ans);
    //  optionsArray.splice(index, 1);
    }
    this.setState({options: ans});
  }

  resetArray(name, action){
    var ans = [];
     if(action=="delete"){
       var obj = new Object();
       obj.vendorName = name;
       obj.label = name;
       this.state.options.push(obj);
       console.log('qqqqqq');
       console.log(this.state.options);
       this.setState({options:this.state.options});
     } else{
       ans = this.state.options.filter(option=>option.vendorName!=name);
       this.setState({options:ans});
     }
  }

  // resetArray(){
  //   this.state.vendorsArray.forEach((vendor)=>{
  //     var index = this.state.options.map(item=>item.vendorName).indexOf(vendor.vendorName);
  //     this.state.options.splice(index, 1);
  //   });
  //
  //   this.setState({options:this.state.options});
  //   //
  //   // var index = this.state.options.map(item=>item.vendorName).indexOf(name);
  //   // this.state.options.splice(index, 1);
  //   // this.setState({options:this.state.options});
  // }

  // async createMap(){
  //   var list = this.state.options;
  //   var map = new Map();
  //   list.forEach(function(vendor){
  //     map.set(vendor.codeUnique, vendor.name);
  //   });
  //   this.setState({idToNameMap:map});
  // }

  addVendor(){

    var newVendor = new Object();
    console.log("addVendor() was called");
    console.log(this.state.selectName);
    var tempId = this.state.selectName;
    var priceFloat = parseFloat(this.state.inputPrice);
    newVendor = {vendorName: tempId, price: priceFloat};
    console.log(newVendor);
    // var updateVendor = new Array(this.state.vendorsArray.slice(0));
    // updateVendor.push(newVendor);
    // console.log("I was called");
    // console.log( updateVendor);
    this.state.vendorsArray.push(newVendor);
    this.setState({vendorsArray:this.state.vendorsArray});
    this.resetArray(tempId, "add");
    this.setState({inputPrice : ''});
    this.setState({selectName: ""})
    console.log(this.state.vendorsArray);
    this.props.handleChange(this.state.vendorsArray);
  }

  deleteVendor(index, name){
    if (index !== -1) {
      console.log("delete");
      // var updateVendor = this.state.vendorsArray.slice();
      // updateVendor.splice(index, 1);
      // console.log("deletedArray");
      // console.log(updateVendor);
      // this.setState({vendorsArray: updateVendor});
      this.state.vendorsArray.splice(index, 1);
      this.setState({vendorsArray:this.state.vendorsArray});
      this.resetArray(name, "delete");
      this.props.handleChange(this.state.vendorsArray);
    }

  }

  updateId (vendor, index) {
    console.log("updateId is fired");
    if(index!=-1){
      // var updateVendor = this.state.vendorsArray.slice();
      // updateVendor[index].vendor = vendor.id;
      // this.setState({vendorsArray: updateVendor});
      this.state.vendorsArray[index].vendorName = vendor.vendorName;
      this.setState({vendorsArray: this.state.vendorsArray});
      this.props.handleChange(this.state.vendorsArray);
    }
  }

  updatePrice (newPrice, index){
    var price = newPrice.target.value;
    console.log("price");
    console.log(price);
    const re = /^\d*\.?\d*$/;
      if ( index>=0 && (price==''|| (price>0 && re.test(price)))) {
        this.state.vendorsArray[index].price = price;
        this.setState({vendorsArray: this.state.vendorsArray});
        console.log("this is the price [updated]");
        console.log(this.state.vendorsArray);
        this.props.handleChange(this.state.vendorsArray);
      }else{
        toast.error('Price must be a positive number.', {
          position: toast.POSITION.TOP_RIGHT
        });
      }
  }

  //   if(index>=0 && !isEmpty){
  //     // var updateVendor = this.state.vendorsArray.slice();
  //     // updateVendor[index].price = newPrice.target.value;
  //     // this.setState({vendorsArray: updateVendor});
      
  //   }
  // }

  // updatePriceHere(newPrice){
  //   this.setState({inputPrice: newPrice.target.value});
  // }

updatePriceHere(event){
  const re = /^\d*\.?\d*$/;
      if ( event.target.value == '' || (event.target.value>0 && re.test(event.target.value))) {
         this.setState({inputPrice: event.target.value})
      }else{
        //alert("Price must be a positive number.");
        toast.error('Price must be a positive number.', {
          position: toast.POSITION.TOP_RIGHT
        });
      }
  }
  // updateName(value){
  //   console.log("updateName");
  //   console.log(value);
  //   this.setState({selectName: value});
  // }

   handleChange = name => event => {
    console.log("handling changes:");
    console.log(event.target.value);
    this.setState({
      [name]: event.target.value,
    });
  };

  render() {
    return (
    	<div>
          <p>Vendors:</p>
          <FormControl style={{marginLeft: 20, width:150}}>
            <InputLabel htmlFor="vendorName">Vendor</InputLabel>
            <Select
             disabled={this.state.options.length==0}
             value={this.state.selectName}
             onChange={this.handleChange('selectName')}
             inputProps={{
              name: 'vendorName',
              id: 'vendorName',
             }}>
            {this.state.options.map((vendor, index)=>(<MenuItem key={index} value={vendor.vendorName}>{vendor.vendorName}</MenuItem>))}
            </Select>
            {/* {this.state.selectName && (this.state.inputPrice>0) && <FormHelperText>Press  to add vendor</FormHelperText>} */}
         </FormControl>
         <FormControl style={{marginLeft:10}}>
          <InputLabel htmlFor="amount">Price</InputLabel>
          <Input
            style={{width:50}}
            id="adornment-amount"
            onChange={(value)=>{this.updatePriceHere(value);}}
            value={this.state.inputPrice}
            startAdornment={<InputAdornment position="start">$</InputAdornment>}
          />
         </FormControl>
         {this.state.selectName && (this.state.inputPrice>0) && 
         <Button raised style={{marginLeft:10}} onClick={()=>{this.addVendor();}}>ADD VENDOR</Button>}
 <br/>

      
      {(this.state.vendorsArray.length>0) && <VendorItem idToNameMap = {this.state.idToNameMap} vendorsArray={this.state.vendorsArray} deleteVendor={this.deleteVendor} updateId={this.updateId} updatePrice={this.updatePrice} options={this.state.options} />}
      </div>
    );
  }
}

export default SelectVendors
