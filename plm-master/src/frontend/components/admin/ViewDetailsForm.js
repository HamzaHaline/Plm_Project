import React from 'react';
import PropTypes from 'prop-types';
//import Select from 'react-select';
// import PageBase from '../home/PageBase/PageBase';
import RaisedButton from 'material-ui/Button';
import {Link} from 'react-router-dom';
import Styles from  'react-select/dist/react-select.css';
import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField';
import Input, { InputLabel } from 'material-ui/Input';
import { FormControl, FormGroup, FormHelperText } from 'material-ui/Form';
import { MenuItem } from 'material-ui/Menu';
import Select from 'material-ui/Select';
import Chip from 'material-ui/Chip';
import * as ingredientInterface from '../../interface/ingredientInterface';
import SelectVendors from './SelectVendors';
import LotNumberSelector from './StockEditorInLot/StockLotNumberSelector.js';
import SnackBarDisplay from '../snackBar/snackBarDisplay.js';
import { Redirect } from 'react-router';
import testData from './testIngredients.js';
import PubSub from 'pubsub-js';
import { ToastContainer, toast } from 'react-toastify';

/* Replace with the data from the back end */
const ingredient_options = [
    { value: 'salt', label: 'Salt' },
    { value: 'butter', label: 'Butter' },
    { value: 'cabbage', label: 'Cabbage' }
]

/* Replace with the data from the back end -- filtered based on ingredients */
const vendor_options = [
    { value: 'vendor1', label: 'vendor1' },
    { value: 'vendor2', label: 'vendor2' },
    { value: 'vendor3', label: 'vendor3' }
 ]

const styles = {
    buttons: {
      marginTop: 30,
      float: 'center'
    },
    saveButton: {
      marginLeft: 0,
    },
    packageName:{
      marginLeft: 10,
      float: 'center',
      width: 100,
    },
    quantity:{
      width: 100,
    },
    formControl: {
      width: 400
    }
  };

var sessionId = "";
var userId="";
var isAdmin = "";
var lotIdMap = new Object();

class AddIngredientForm extends React.Component{

  constructor(props) {
    super(props);
    var dummyObject = new Object();
    const details = (props.location.state.details)?(props.location.state.details):dummyObject;
    console.log(details);
    const isCreateNew = props.location.state.isCreateNew;
    const isIntermediate = props.location.state.isIntermediate;
    this.state = {
  		vendors: [],
      vendorString: "",
      vendorsArray: (details.vendorsArray)?(details.vendorsArray):[],
  		value:undefined,
      ingredientId: (details.ingredientId)?(details.ingredientId):(props.location.state.ingredientId),
      name:(details.name)?(details.name):'',
      packageName:(details.packageName)?(details.packageName):'',
      temperatureZone:(details.temperatureZone)?(details.temperatureZone):'',
      multi : 'false',
      nativeUnit: (details.nativeUnit)?(details.nativeUnit):'',
      numUnitPerPackage: (details.numUnitPerPackage)?(details.numUnitPerPackage):'',
      isDisabled: (isCreateNew) ? false: true,
      numUnit: (details.numUnit)? (Math.round(details.numUnit*100)/100):0,
      space: (details.space)?(details.space):0,
      moneySpent: (details.moneySpent)?(Math.round(details.moneySpent*100)/100) : 0,
      moneyProd: (details.moneyProd) ? (Math.round(details.moneyProd*100)/100): 0,
      price: 0,
      isCreateNew: (isCreateNew),
      isIntermediate:(isIntermediate),
      lotNumberArray:[],
      totalAssigned:0,
      lotNumberString:'',
      snackBarMessage:'',
      snackBarOpen:false,
      initialNumUnit:(details.numUnit)? (Math.round(details.numUnit*100)/100):0,
      initialName: (details.name)?(details.name):'',
      initialLotNumberArray: [],
      initialLotNumberString: '',
      initialTotalAssigned: 0,
    }
    this.handleOnChange = this.handleOnChange.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.updateVendors = this.updateVendors.bind(this);
    this.computeVendorString = this.computeVendorString.bind(this);
    this.isValid = this.isValid.bind(this);
    this.handleQuantityChange = this.handleQuantityChange.bind(this);
    this.loadIngredient = this.loadIngredient.bind(this);
    this.handleNumUnitChange = this.handleNumUnitChange.bind(this);
    this.handlePackageChange = this.handlePackageChange.bind(this);
    this.computeLotNumberString = this.computeLotNumberString.bind(this);
    this.loadLotNumbers = this.loadLotNumbers.bind(this);
    this.updateArray= this.updateArray.bind(this);
    this.handleSnackBarClose = this.handleSnackBarClose.bind(this);
    this.checkQuantityMatchLotArray = this.checkQuantityMatchLotArray.bind(this);
  }

  handleSnackBarClose(){
    this.setState({snackBarOpen:false});
    this.setState({snackBarMessage: ''});
  }

  handleOnChange (option) {
    console.log("CHANGE ");
  		const {multi} = this.state;
  		if (multi) {
  			this.setState({vendors: option});
  		} else {
  			this.setState({value:option});
  		};
  	};

  handleChange = name => event => {
      this.setState({
        [name]: event.target.value,
      });
  };

  updateVendors(updatedArray){
    this.setState({'vendorsArray': updatedArray});
    this.computeVendorString();
  }

  computeVendorString(){
    var vendors_string = "";
    console.log("qqqqq");
    console.log(this.state.vendorsArray);
    for(var i =0; i < this.state.vendorsArray.length; i++){
          var vendorObject = this.state.vendorsArray[i];
          //var vendorName = this.state.idToNameMap.get(vendorObject.codeUnique);
          var vendorName = vendorObject.vendorName;
          var namePrice = vendorName + " / $" + vendorObject.price;
          vendors_string += namePrice;
          if(i!= (this.state.vendorsArray.length -1)){
            vendors_string+='\n';
          }
        }
    this.setState({vendorString: vendors_string });
  }

  computeLotNumberString(){
    var string = "";
    var array = this.state.lotNumberArray;
    var sum =0;
    console.log("lot number string");
    console.log(this.state);
    for(var i =0; i < array.length; i++){
          var lotObject = array[i];
          //var vendorName = this.state.idToNameMap.get(vendorObject.codeUnique);
          console.log("lotObject");
          console.log(lotObject);
          string +=  "[" + lotObject.date.replace('T', ' ').replace('Z', '') +"]     " + lotObject.lotNumber+ ": " + lotObject.numUnit ;
          sum+=Number(lotObject.numUnit);
          if(i!= (array.length -1)){
            string+='\n';
          }
        }
    console.log(string);
    this.setState({lotNumberString: string });
    this.setState({totalAssigned: sum });
  }


  componentWillMount(){
    var temp = this;
    isAdmin = JSON.parse(sessionStorage.getItem('user')).isAdmin;
    sessionId = JSON.parse(sessionStorage.getItem('user'))._id;
    userId = JSON.parse(sessionStorage.getItem('user'))._id;
    console.log("logs");
    if(this.props.location.state.fromLogs){
      temp.loadIngredient();
      temp.loadLotNumbers(function(){
        temp.computeLotNumberString();
        temp.setState({initialTotalAssigned: temp.state.totalAssigned});
        temp.setState({initialLotNumberString: temp.state.lotNumberString});
      });
    }
    console.log("props");
    console.log(this.props);
    this.computeVendorString();
    if((!this.props.location.state.fromLogs)&&(!this.state.isCreateNew)&&(this.props.location.state.details.numUnit)){
      console.log("inStock");
      temp.loadLotNumbers(function(){
        temp.computeLotNumberString();
        temp.setState({initialTotalAssigned: temp.state.totalAssigned});
        temp.setState({initialLotNumberString: temp.state.lotNumberString});
      });
    }
  }

  async loadLotNumbers(callback){
    console.log("loadLotNumbers");
    // console.log(this.state);
    console.log(this.state.ingredientId);
    var lotArray = await ingredientInterface.getAllLotNumbersAsync(this.state.ingredientId,sessionId);
     // var lotArray =  testData.tablePage.lots_test[0].ingredientLots;
     console.log("load ingredient lots");
     console.log(lotArray);

    // create map
    lotArray = lotArray.data;
    var array = [];
    for(var i =0; i < lotArray.length;i++){
      var obj = new Object();
      obj.numUnit = lotArray[i].numUnit;
      obj.lotNumber = lotArray[i].lotNumber;
      obj.date = lotArray[i].date;
      array.push(obj);
      lotIdMap[lotArray[i].lotNumber]= lotArray[i]._id;
    }
     this.setState({lotNumberArray:array});
     var deepCopy = JSON.parse(JSON.stringify(array));
     this.setState({initialLotNumberArray: deepCopy});
     callback();

  }

  updateArray(inputArray){
    console.log("update array");
    var sum = 0;
    for(var i=0; i<inputArray.length;i++){
      sum+=parseInt(inputArray[i].numUnit);
      console.log(inputArray[i].numUnit);
    }
    if(!sum){
      sum=0;
    }
    console.log("current sum " + sum);
    this.setState({lotNumberArray:inputArray},function cb(){
      this.computeLotNumberString();
    });
    this.setState({totalAssigned:sum});
  }


  async loadIngredient(){
    var details = [];
    // sessionId = '5a8b99a669b5a9637e9cc3bb';
    // userId = '5a8b99a669b5a9637e9cc3bb';
    console.log("ingredient id");
    console.log(this.props.location.state.ingredientId);

    details = await ingredientInterface.getIngredientAsync(this.props.location.state.ingredientId, sessionId);

    console.log("load one ingredient");
    console.log(details);
    var formatVendorsArray = new Array();
      for (var j=0; j<details.vendors.length; j++){
        //var vendorName = this.state.idToNameMap.get(rawData[i].vendors[j].codeUnique);
        var vendorName = details.vendors[j].vendorName;
        var price = details.vendors[j].price;
        var vendorObject = new Object();
        vendorObject.vendorName = vendorName;
        vendorObject.price = price;
        formatVendorsArray.push(vendorObject);
      }

    this.setState({
      vendorsArray: formatVendorsArray,
      ingredientId: this.props.location.state.ingredientId,
      name:details.name,
      packageName:details.packageName,
      temperatureZone:details.temperatureZone,
      nativeUnit: details.nativeUnit,
      numUnitPerPackage: details.numUnitPerPackage,
      moneySpent: details.moneySpent,
      moneyProd: details.moneyProd,
      numUnit: details.numUnit,
      space: details.space,
      isIntermediate: details.isIntermediate,
      initialNumUnit:details.numUnit,
      initialName: details.name,
    });

    this.computeVendorString();
    this.computeLotNumberString();
  }

  isValid(){
    const re = /^\d*\.?\d*$/;
    for(var i=0; i<this.state.vendorsArray.length; i++){
      if(this.state.vendorsArray[i].price==0 || this.state.vendorsArray[i].price==""){
        toast.error("Price for "+ this.state.vendorsArray[i].vendorName + " should be greater than 0", {
          position: toast.POSITION.TOP_RIGHT
        });
        return false;
      }
    }

    if (this.state.numUnitPerPackage <= 0 || this.state.numUnitPerPackage == '' || !re.test(this.state.numUnitPerPackage)) {
      toast.error("Quantity must be a positive number", {
          position: toast.POSITION.TOP_RIGHT
        });
      return false;
      // Add validation for lotNumberArray and quantity
    }
   else if (!this.checkQuantityMatchLotArray()){
      toast.error("Current stock quantity must equal to the sum of quantities in lots.", {
        position: toast.POSITION.TOP_RIGHT
      });
   }
    else if(this.state.temperatureZone==null || this.state.temperatureZone==''){
      toast.error("Please fill out temperature", {
        position: toast.POSITION.TOP_RIGHT
      });
      return false;
    }else if(this.state.packageName==null || this.state.packageName==''){
      toast.error("Please fill out package", {
        position: toast.POSITION.TOP_RIGHT
      });
      return false;
    }
    else if((!this.state.isIntermediate)&&
            (this.state.vendorsArray.length==0 || this.state.vendorsArray == null)){
      //alert("Please add a vendor.");
      toast.error("Vendors must be filled", {
        position: toast.POSITION.TOP_RIGHT
      });
      return false;
    }
    else if (!(/^[A-z]+$/).test(this.state.nativeUnit)){
      toast.error("Native unit must be a string", {
          position: toast.POSITION.TOP_RIGHT
      });
    }else
      return true;
  }

  checkQuantityMatchLotArray(){
    console.log("checkQuantityMatch");
    var sum =0;
    var array = this.state.lotNumberArray;
    console.log(this.state.lotNumberArray);

    for(var i = 0; i < array.length;i++){
      sum+=Number(array[i].numUnit);
    }
    console.log(this.state.numUnit);
    console.log(Number(this.state.numUnit));
    console.log(sum);
    console.log(Number(this.state.numUnit)==Number(sum));
    return (this.state.numUnit==sum);
  }

  async onFormSubmit(e) {
    e.preventDefault();
    var temp = this;
    sessionId = JSON.parse(sessionStorage.getItem('user'))._id;
    var isValid = temp.isValid();

    if( temp.state.isCreateNew && isValid){
      console.log(" Add ingredient ");
      var numUnit = Number(temp.state.numUnit);
      await ingredientInterface.addIngredient(temp.state.name, temp.state.packageName, temp.state.temperatureZone,
        temp.state.vendorsArray, temp.state.moneySpent, temp.state.moneyProd, temp.state.nativeUnit,
        temp.state.numUnitPerPackage, temp.state.numUnit, temp.state.space, false, sessionId, function(res){
                  if (res.status == 400) {
                      PubSub.publish('showAlert', res.data);
                      //alert(res.data);
                  } else if (res.status == 500) {
                      toast.error("Ingredient name already exists", {
                        position: toast.POSITION.TOP_RIGHT
                      });
                  } else{
                      // SnackBarPop("Row was successfully added!");
                      // temp.setState({snackBarMessage : "Ingredient Successfully added! "});
                      // temp.setState({snackBarOpen:true});
                      toast.success("Ingredient successfully added!", {
                        position: toast.POSITION.TOP_RIGHT
                      });
                     // PubSub.publish('showMessage', ' Ingredient Successfully added!' );
                      temp.setState({fireRedirect: true});
                      // alert(" Ingredient Successfully added! ");
                  }
              });
      //this.clearFields();
    }else if(isValid){
      if(temp.state.numUnit==''){
        temp.setState({numUnit:0});
      }

      console.log("saved edited");
      console.log(temp.state.numUnit);
      console.log(Number(temp.state.numUnit));
      var numUnit = Number(temp.state.numUnit);
      var oldName = temp.state.initialName;
      var oldQuantity = temp.state.initialNumUnit;
      var oldLotNumberString = temp.state.initialLotNumberString;
      var oldLotNumberArray = JSON.parse(JSON.stringify(temp.state.initialLotNumberArray));
      var oldTotalAssigned = temp.state.initialTotalAssigned;
      console.log(oldName);
      await ingredientInterface.updateIngredient(temp.state.ingredientId, temp.state.name, temp.state.packageName,
                temp.state.temperatureZone, temp.state.vendorsArray, temp.state.moneySpent, temp.state.moneyProd,
                temp.state.nativeUnit, temp.state.numUnitPerPackage, numUnit, temp.state.space, temp.state.isIntermediate, sessionId, function(res){
                  if (res.status == 400) {
                      //alert(res.data);
                      var computeSpace = Math.ceil(oldQuantity/temp.state.numUnitPerPackage) * temp.packageSpace(temp.state.packageName);
                      temp.setState({space: computeSpace});
                      temp.setState({numUnit: oldQuantity});
                      temp.setState({lotNumberArray: oldLotNumberArray});
                      temp.setState({lotNumberString: oldLotNumberString});
                      temp.setState({totalAssigned: oldTotalAssigned});
                      PubSub.publish('showAlert', res.data);

                  } else if (res.status == 500) {
                      temp.setState({name: oldName});
                      toast.error("Ingredient name already exists.", {
                        position: toast.POSITION.TOP_RIGHT
                      });
                     // PubSub.publish('showAlert', 'Ingredient name already exists');
                      //alert('Ingredient name already exists');
                  } else {
                    // Move edit lot here
                    if(temp.state.lotNumberArray.length > 0){
                      for(var i =0; i < temp.state.lotNumberArray.length;i++){
                        console.log('edit');
                        ingredientInterface.editLotAsync(lotIdMap[temp.state.lotNumberArray[i].lotNumber],
                                  temp.state.lotNumberArray[i].numUnit,sessionId );
                      } 
                    }
                    temp.setState({initialName: temp.state.name});
                    temp.setState({initialNumUnit: temp.state.numUnit});
                    temp.setState({initialLotNumberArray: temp.state.lotNumberArray});
                    temp.setState({initialLotNumberString: temp.state.lotNumberString});
                    temp.setState({initialTotalAssigned: temp.state.totalAssigned});
                    toast.success("Ingredient successfully edited!");
                  }
                  temp.setState({isDisabled:true});
        });
    }
  }

    clearFields(){
    this.setState({
      vendors:[],
      vendorsArray: [],
      ingredientId: '',
      name:'',
      packageName:'',
      temperatureZone:'',
      nativeUnit: '',
      numUnitPerPackage: 0,
      vendorString: "",
      isCreateNew: true,
      lotNumberArray:[],
      totalAssigned:0,
      fireRedirect: false,
      initialNumUnit:0,
      })
    }

    handleNewOptionClick(option){
      console.log("New Option was clicked: " + option.value);
  }

  handleQuantityChange(event){
   const re = /^\d*\.?\d*$/;
      if ( event.target.value == '' || (event.target.value>0 && re.test(event.target.value))) {
         this.setState({numUnitPerPackage: event.target.value});
         console.log("hanle quantity change");
         console.log(event.target.value);
         var computeSpace = Math.ceil(this.state.numUnit/event.target.value) * this.packageSpace(this.state.packageName);
         this.setState({space: computeSpace});
      }else{
        //PubSub.publish('showMessage', 'Quantity must be a positive number' );
        toast.error("Quantity must be a positive number", {
          position: toast.POSITION.TOP_RIGHT
        });
      }
  }

  handleNumUnitChange(event){
    console.log("handleNumUnitChange");
    const re = /^\d*\.?\d*$/;
      if ( event.target.value == '' || (event.target.value>=0 && re.test(event.target.value))) {
         var computeSpace = Math.ceil(event.target.value/this.state.numUnitPerPackage) * this.packageSpace(this.state.packageName);
         this.setState({numUnit: event.target.value});
         this.setState({space: computeSpace});
      }else{
        toast.success("Quantity must be a number!", {
          position: toast.POSITION.TOP_RIGHT
        });
        // alert("Quantity must be a number");
      }
  }

  handlePackageChange(event){
    this.setState({packageName:event.target.value});
    var computeSpace = Math.ceil(this.state.numUnit/this.state.numUnitPerPackage) * this.packageSpace(event.target.value);
    console.log('computespace');
    console.log(computeSpace);
    this.setState({space: computeSpace});
  }

  packageSpace(input){
    if(input=='drum'){
      return 3;
    }
    else if(input=='supersack'){
      return 16;
    }else if(input=='sack'){
      return 0.5;
    }else if(input=='pail'){
      return 1;
    }else{
      return 0;
    }
  }

  render (){
    const { name, packageName, temperatureZone, vendors, fireRedirect } = this.state;
    return (
      // <PageBase title = 'Add Ingredients' navigation = '/Application Form'>
      <div>
      <form onSubmit={this.onFormSubmit} style={styles.formControl}>
        {(this.state.isCreateNew) ? 
          <p><b><font size="6" color="3F51B5">New Ingredient</font></b></p> :
          <p><b><font size="6" color="3F51B5">Ingredient Details {(this.state.numUnit!=0)? <Chip label="In Stock"/> : ''} </font></b></p>
        }
        <p><font size="5">Basic Information</font></p>
        {/* {this.state.snackBarOpen && <SnackBarDisplay
              open = {this.state.snackBarOpen}
              message = {this.state.snackBarMessage}
              handleSnackBarClose = {this.handleSnackBarClose}
            /> } */}
          <FormGroup>
            <TextField
              disabled = {this.state.isDisabled}
              id="name"
              label="Ingredient Name"
              value={this.state.name}
              onChange={this.handleChange('name')}
              margin="normal"
              required
            />
            <FormControl>
              <InputLabel htmlFor="temperatureZone">Temperature</InputLabel>
              <Select
                value={this.state.temperatureZone}
                onChange={this.handleChange('temperatureZone')}
                inputProps={{
                  name: 'temperatureZone',
                  id: 'temperatureZone',
                }}
                disabled = {this.state.isDisabled}
                required
              >
                <MenuItem value={'freezer'}>Frozen</MenuItem>
                <MenuItem value={'warehouse'}>Room Temperature</MenuItem>
                <MenuItem value={'refrigerator'}>Refrigerated</MenuItem>
              </Select>
            </FormControl>
            </FormGroup>
            <TextField
              id="numUnitPerPackage"
              label="Quantity"
              value={this.state.numUnitPerPackage}
              onChange={(event)=>this.handleQuantityChange(event)}
              margin="normal"
              disabled = {this.state.isDisabled}
              style={styles.quantity}
              required
            />
            <TextField
              id="nativeUnit"
              label="Native Units"
              value={this.state.nativeUnit}
              onChange={this.handleChange('nativeUnit')}
              margin="normal"
              disabled = {this.state.isDisabled}
              style={styles.quantity}
              required
            />
             per
            <FormControl style={styles.packageName}>
              <InputLabel htmlFor="packageName">Package</InputLabel>
              <Select
                value={this.state.packageName}
                onChange={this.handlePackageChange}
                inputProps={{
                  name: 'Package',
                  id: 'packageName',
                }}
                disabled = {this.state.isDisabled}
                required

              >
                <MenuItem value={'sack'}>Sack</MenuItem>
                <MenuItem value={'pail'}>Pail</MenuItem>
                <MenuItem value={'drum'}>Drum</MenuItem>
                <MenuItem value={'supersack'}>Supersack</MenuItem>
                <MenuItem value={'truckload'}>Truckload</MenuItem>
                <MenuItem value={'railcar'}>Railcar</MenuItem>
              </Select>
            </FormControl>
            <FormGroup>
            {(!this.state.isIntermediate)&&(this.state.isDisabled) && <TextField
              id="selectVendors"
              label="Vendors"
              multiline
              value={this.state.vendorString}
              margin="normal"
              disabled = {this.state.isDisabled}
              required
              style={{lineHeight: 1.5}}
            />}
            {(!this.state.isIntermediate)&&(!this.state.isDisabled) && <SelectVendors initialArray={this.state.vendorsArray} handleChange={this.updateVendors}/>}
            </FormGroup>
            {!this.state.isCreateNew &&
              <div>
              <p><font size="5">Inventory Information</font></p>
              <FormGroup>
               <TextField
                  required
                  disabled = {(this.state.isDisabled) || (this.state.initialNumUnit==0)}
                  id="numUnit"
                  label={"Current Quantity " + "(" + this.state.nativeUnit +")"}
                  value={this.state.numUnit}
                  onChange={this.handleNumUnitChange}
                  margin="normal"
                />

                {(this.state.isDisabled) && (this.state.numUnit!=0)&& <TextField
                  id="lotNumbers"
                  label={"[Order Time] Lot Number: Quantity (" + this.state.nativeUnit + ")"}
                  multiline
                  value={this.state.lotNumberString}
                  margin="normal"
                  disabled = {this.state.isDisabled}
                  style={{lineHeight: 1.5}}
                />}

                {(!this.state.isDisabled && this.state.initialNumUnit!=0)&&
                  <LotNumberSelector
                    nativeUnit = {this.state.nativeUnit}
                    initialArray = {this.state.lotNumberArray}
                    quantity={this.state.numUnit}
                    updateArray={this.updateArray}
                    totalAssigned={this.state.totalAssigned}
                    fromDetails={true}
                    />}
                <TextField
                  disabled
                  id="space"
                  label="Space Occupied (sqft)"
                  value={this.state.space}
                  onChange={this.handleChange('space')}
                  margin="normal"
                />
              </FormGroup>
              </div>}
              {!this.state.isCreateNew &&
              <div>
              <p><font size="5">Financial Information</font></p>
              <FormGroup>
                <TextField
                  disabled
                  id="moneySpent"
                  label="Total Money Spent"
                  value={Math.round(this.state.moneySpent*100)/100}
                  margin="normal"
                />
                <TextField
                  disabled
                  id="moneyProd"
                  label="Money Spent in Production"
                  value={Math.round(this.state.moneyProd*100)/100}
                  margin="normal"
                />
              </FormGroup></div>}
              <div style={styles.buttons}>
                {(this.state.isDisabled && isAdmin) && <RaisedButton raised color = "secondary" onClick={()=>{this.setState({isDisabled:false});}} >EDIT</RaisedButton>}
                {(!this.state.isDisabled) && <RaisedButton raised
                          color="primary"
                          // className=classes.button
                          style={styles.saveButton}
                          type="Submit"
                          primary="true"> {(this.state.isCreateNew)? 'ADD' : 'SAVE'} </RaisedButton>}
                <RaisedButton color="default"
                  component={Link} to='/admin-ingredients'
                  style = {{marginLeft: 10}}
                  raised
                  > BACK </RaisedButton>
             </div>
           </form>
           {fireRedirect && (
             <Redirect to={'/admin-ingredients'}/>
           )}
        </div>
    )
	}
};


export default AddIngredientForm;
