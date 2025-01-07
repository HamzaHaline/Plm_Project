import React from 'react';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/Button';
import {Link} from 'react-router-dom';
import Styles from  'react-select/dist/react-select.css';
import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField';
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';
import { FormControl, FormGroup, FormHelperText } from 'material-ui/Form';
import { MenuItem } from 'material-ui/Menu';
import Select from 'material-ui/Select';
import Chip from 'material-ui/Chip';
import * as ingredientActions from '../../interface/ingredientInterface';
import * as formulaActions from '../../interface/formulaInterface';
import SelectIngredients from './SelectIngredients';
import SnackBarDisplay from '../snackBar/snackBarDisplay';
import { Redirect } from 'react-router';
import PubSub from 'pubsub-js';
import { ToastContainer, toast } from 'react-toastify';
import SelectProductionLines from './SelectProductionLines.js';

const styles = {
    buttons: {
      marginTop: 30,
      float: 'center'
    },
    saveButton: {
      marginLeft: 50,
    },
    packageName:{
      marginLeft: 10,
      float: 'center',
      width: 100,
    },
    unitsProvided:{
      width: 200,
      marginRight: 30
    },
    productType:{
      width: 200,
    },
    formControl: {
      width: 400
    },
    quantity: {
      width: 100
    },
  };

var sessionId = "";
var userId = "";
var isAdmin = "";
var isManager = "";

class FormulaDetails extends React.Component{
  constructor(props) {
    super(props);
    var dummyObject = new Object();
    const details = (props.location.state.details)?(props.location.state.details):dummyObject;
    console.log(details);
    const isCreateNew = props.location.state.isCreateNew;
    this.state = {
      productionLinesString:"",
      productionLinesArray: (details.productionLinesArray)?(details.productionLinesArray):[],
      ingredientsString:"",
      ingredientsArray: (details.ingredientsArray)?(details.ingredientsArray):[],
  		value:undefined,
      formulaId: (details.formulaId)?(details.formulaId):'',
      name:(details.name)?(details.name):'',
      description:(details.description)?(details.description):'',
      unitsProvided:(details.unitsProvided)?(details.unitsProvided):'',
      ingredients: (details.ingredients)?(details.ingredients):'',
      multi : 'false',
      isDisabled: (isCreateNew) ? false: true,
      isCreateNew: (isCreateNew),
      isValid: false,
      // fields for the intermediate products
      isIntermediate:(details.isIntermediate) ? (details.isIntermediate):false,
      packageName:(details.packageName)?(details.packageName):'',
      nativeUnit:(details.nativeUnit)?(details.nativeUnit):'',
      temperatureZone:(details.temperatureZone)?(details.temperatureZone):'',
      numUnitPerPackage: (details.numUnitPerPackage)?(details.numUnitPerPackage):0,
      snackBarOpen:false,
      snackBarMessage:'',
      fireRedirect: false,
      pageNotFound: false,
      canUpdatePL: false,
    }

    this.handleOnChange = this.handleOnChange.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.updateIngredients = this.updateIngredients.bind(this);
    this.updateProductionLines = this.updateProductionLines.bind(this);
    this.computeProductionLinesString = this.computeProductionLinesString.bind(this);
    this.computeIngredientsString = this.computeIngredientsString.bind(this);
    this.handleUnitsProvidedChange = this.handleUnitsProvidedChange.bind(this);
    this.handleNumUnitPerPackage = this.handleNumUnitPerPackage.bind(this);
    this.isValid = this.isValid.bind(this);
    this.loadFormula = this.loadFormula.bind(this);
  }

  componentDidMount(){
    isAdmin = JSON.parse(sessionStorage.getItem('user')).isAdmin;
    isManager = JSON.parse(sessionStorage.getItem('user')).isManager;
    if(this.props.location.state.fromLogs){
      this.loadFormula();
    }
      this.computeIngredientsString();
      this.computeProductionLinesString();
  }

  async loadFormula(){
    var details = [];
    sessionId = JSON.parse(sessionStorage.getItem('user'))._id;
    userId = JSON.parse(sessionStorage.getItem('user'))._id;
    // sessionId = '5a8b99a669b5a9637e9cc3bb';
    // userId = '5a8b99a669b5a9637e9cc3bb';
    details = await formulaActions.getFormulaAsync(this.props.location.state.formulaId, sessionId);

    var formatIngredientsArray = new Array();
    if(!details){
      this.setState({pageNotFound: true});
    }else{
      for (var j=0; j<details.ingredients.length; j++){
        //var vendorName = this.state.idToNameMap.get(rawData[i].vendors[j].codeUnique);
        var ingredientName = details.ingredients[j].ingredientName;
        var quantity = details.ingredients[j].quantity;
        var nativeUnit = details.ingredients[j].nativeUnit;
        var ingredientObject = new Object();
        ingredientObject.ingredientName = ingredientName;
        ingredientObject.quantity = quantity;
        ingredientObject.nativeUnit = nativeUnit;
        formatIngredientsArray.push(ingredientObject);
      }
    console.log("loadFormula is called");
    console.log(details.productionLinesArray);

    this.setState({
      ingredientsArray: formatIngredientsArray,
      ingredientId: this.props.location.state.ingredientId,
      name:details.name,
      description: details.description,
      unitsProvided: details.unitsProvided,
      ingredients: details.ingredients,
      packageName:details.packageName,
      temperatureZone:details.temperatureZone,
      nativeUnit: details.nativeUnit,
      isIntermediate: details.isIntermediate,
      numUnitPerPackage : (details.numUnitPerPackage)?(details.numUnitPerPackage):'',
      productionLinesArray: (details.productionLines)?(details.productionLines):[],
    });
      this.computeIngredientsString();
      this.computeProductionLinesString();
    }
  }

  handleOnChange (option) {
    console.log("CHANGE ");
  		const {multi} = this.state;
  		if (multi) {
  			this.setState({ingredients: option});
  		} else {
  			this.setState({value:option});
  		};
  };

  handleChange = name => event => {
      this.setState({
        [name]: event.target.value,
      });
  };

  updateIngredients(updatedArray){
    this.setState({'ingredientsArray': updatedArray});
    this.computeIngredientsString();
  }

  updateProductionLines(updatedArray){
    this.setState({productionLinesArray: updatedArray});
    this.computeProductionLinesString();
  }

  computeIngredientsString(){
    console.log(" Ingredients Array " + JSON.stringify(this.state.ingredientsArray));
    var ingredients_string = "";
    console.log(this.state.ingredientsArray);
    for(var i =0; i < this.state.ingredientsArray.length; i++){
          var ingredient = this.state.ingredientsArray[i];
          //var vendorName = this.state.idToNameMap.get(vendorObject.codeUnique);
          ingredients_string += ingredient.ingredientName + " / " + ingredient.quantity + " " + ingredient.nativeUnit;
          if(i!= (this.state.ingredientsArray.length - 1)){
            ingredients_string+='\n';
          }
        }
    this.setState({ingredientsString: ingredients_string });
  }

  computeProductionLinesString(){
    var string = "";
    if(this.state.productionLinesArray){
    for(var i =0; i < this.state.productionLinesArray.length; i++){
          var name = this.state.productionLinesArray[i];
          string += name;
          if(i!= (this.state.productionLinesArray.length - 1)){
            string+='\n';
          }
        }
    }
    console.log("Compute production lines string");
    console.log(string);
    this.setState({productionLinesString: string });
  }

  isValid(){
    console.log("is valid is called");
    var temp = this;
    const re =/^[1-9]\d*$/;
    if(!temp.state.name){
      toast.error(" Please enter the formula name. ");
      return false;
    }else if (!temp.state.description){
      toast.error(" Please enter the description. ");
      return false;
    }else if (!re.test(temp.state.unitsProvided)) {
      toast.error(" Units of product of formula must be a positive integer. ");
      return false;
    }else if (temp.state.ingredientsArray.length==0){
      toast.error(" Please add ingredients needed for the formula.");
      return false;
      // Add checks for intermediateProductFields
    }else if ((temp.state.isIntermediate)){
      if (!temp.state.temperatureZone){
        toast.error("Please select a temperature zone ");
        return false;
      }else if (!this.state.numUnitPerPackage){
        toast.error("Please enter the number of units per package!");
        return false;
      }else if((!(/^[A-z]+$/).test(temp.state.nativeUnit))) {
          toast.error("Native unit must be a string!");
          return false;
        }else if(!temp.state.packageName){
          toast.error("Please select a package ");
          return false;
        }
    // }else if (temp.state.ingredientsArray.length==0){
    //   alert(" Please add ingredients needed for the formula.");
    //   return false;
    }else if (temp.state.ingredientsArray.length){
      // loop through and make sure all ingredients have quantities updated
      for(var i =0; i < this.state.ingredientsArray.length;i++){
        if(!temp.state.ingredientsArray[i].quantity || temp.state.ingredientsArray[i].quantity==0){
          toast.error(" Please add a positive integer quantity for ingredient " + temp.state.ingredientsArray[i].ingredientName);
          //alert(" Please add a positive integer quantity for ingredient " + temp.state.ingredientsArray[i].ingredientName);
          return false;
        }
      }
      return true;
    }
      return true;
  }


  async onFormSubmit(e) {
    var temp = this;
    sessionId = JSON.parse(sessionStorage.getItem('user'))._id;
    e.preventDefault();
    console.log("submit formula ");
    var isValid = temp.isValid();
          console.log("Onformsubmit in formula details is entered");
      console.log(temp.state.productionLinesArray);
    if(isValid && temp.state.isCreateNew){

      console.log(" Array " + JSON.stringify(temp.state.ingredientsArray));
      //TODO: Check for adding order
      await formulaActions.addFormula(temp.state.name, temp.state.description,
            temp.state.unitsProvided, temp.state.ingredientsArray, temp.state.isIntermediate,
            temp.state.packageName,temp.state.temperatureZone,temp.state.nativeUnit,temp.state.numUnitPerPackage,
            temp.state.productionLinesArray, sessionId, function(res){
              //TODO: Please update the error accordingly
              if(res.status==400){
                PubSub.publish('showAlert', res.data );
                //alert(res.data);
              }else{
                // TODO: Snackbar
                // temp.setState({snackBarMessage : "Formula successfully added"});
                // temp.setState({snackBarOpen:true});
                temp.setState({fireRedirect: true});
                toast.success('Formula successfully added.');
                //PubSub.publish('showMessage', 'Formula successfully added.' );
                // alert(" Formula successfully added! ");
              }
            });
    }else if (!temp.state.isCreateNew && isValid){
      console.log("update formula ");
      console.log(temp.state);

      await formulaActions.updateFormula(temp.state.formulaId, temp.state.name,
        temp.state.description,temp.state.unitsProvided, temp.state.ingredientsArray,
        temp.state.isIntermediate,temp.state.packageName,temp.state.temperatureZone,
        temp.state.nativeUnit,temp.state.numUnitPerPackage, temp.state.productionLinesArray, sessionId, function(res){
          //TODO: Update error status
          if(res.status == 400){
            //alert(res.data);
            PubSub.publish('showAlert', res.data);
          }else{
            //TODO: SnackBar
            // temp.setState({snackBarMessage : "Formula successfully updated."});
            // temp.setState({snackBarOpen:true});
            temp.setState({fireRedirect: true});
            //PubSub.publish('showMessage', 'Formula successfully updated.' );
            toast.success('Formula successfully updated.');
            // alert(" Formula successfully updated. ");
          }
        });
    temp.setState({isDisabled:true});
    temp.setState({canUpdatePL: false});
    }
    // updating this
    // temp.setState({isCreateNew:false})
  }

    handleNewOptionClick(option){
      console.log("New Option was clicked: " + option.value);
  }

  handleUnitsProvidedChange(event){
     const re = /^[0-9\b]+$/;
     //const re = /^\d*\.?\d*$/;
      if ( event.target.value == '' || (event.target.value>=0 && re.test(event.target.value))) {
         this.setState({unitsProvided: event.target.value})
      }else{
        toast.error("The units of product must be a positive number. ");
        //alert("The units of product must be a positive integer. ");
      }
  }

  handleNumUnitPerPackage(event){
    //const re = /^[0-9\b]+$/;
    const re = /^\d*\.?\d*$/;
      if ( event.target.value == '' || (event.target.value>=0 && re.test(event.target.value))) {
         this.setState({numUnitPerPackage: event.target.value})
      }else{
        toast.error("The units of product must be a positive number. ");
        //alert("The units of product must be a positive number. ");
      }
  }


  render (){
    const { formulaId,name, description, unitsProvided, ingredients, isCreateNew,
      isDisabled,isIntermediate,packageName,nativeUnit,temperatureZone, fireRedirect, pageNotFound} = this.state;
    return (
      // <PageBase title = 'Add Ingredients' navigation = '/Application Form'>
      <div>
      {(this.state.isCreateNew) ? 
          <p><b><font size="6" color="#DAA520">New Formula</font></b></p> :
          <p><b><font size="6" color="3F51B5">Formula Details </font></b></p>
        }
      <form onSubmit={this.onFormSubmit} style={styles.formControl}>
        {/* {(this.state.numUnit!=0)? <Chip label="In Stock"/> : ''} */}
          <FormGroup>
            <TextField
              disabled = {this.state.isDisabled}
              id="name"
              label="Formula Name"
              value={this.state.name}
              onChange={this.handleChange('name')}
              margin="normal"
              required
            />
            </FormGroup>

            <FormGroup>
              <TextField
                id="description"
                label="Description "
                value={this.state.description}
                onChange={this.handleChange('description')}
                margin="normal"
                disabled = {this.state.isDisabled}
                required
                multiline
              />
            </FormGroup>
            <br></br>
            <FormControl required style={styles.unitsProvided}>
              <InputLabel htmlFor="unitsProvided">{(!this.state.isIntermediate)?'Product Units':'Amount Produced'}</InputLabel>
              <Input
                id="unitsProvided"
                value={this.state.unitsProvided}
                onChange={(event)=>this.handleUnitsProvidedChange(event)}
                disabled = {this.state.isDisabled}
                endAdornment={<InputAdornment position="end">{(!this.state.isIntermediate)?'':(this.state.nativeUnit)} </InputAdornment>}
              />
            </FormControl>

             <FormControl style={styles.packageName}>
                 <InputLabel htmlFor="Product Type ">Product Type</InputLabel>
                 <Select
                   value={this.state.isIntermediate}
                   onChange={this.handleChange('isIntermediate')}
                   inputProps={{
                     name: 'productType',
                     id: 'productType',
                   }}
                   disabled = {this.state.isDisabled}
                   required
                   style={styles.productType}

                 >
                   <MenuItem value={true}>Intermediate</MenuItem>
                   <MenuItem value={false}>Final</MenuItem>
                 </Select>
               </FormControl>
            <br></br>
            <FormGroup>
            {this.state.isDisabled && <TextField
              id="selectIngredients"
              label="Ingredients"
              value={this.state.ingredientsString}
              margin="normal"
              disabled = {this.state.isDisabled}
              multiline
              required
              style={{lineHeight:1.5}}
            />}
            {(!this.state.isDisabled) && <SelectIngredients initialArray={this.state.ingredientsArray} handleChange={this.updateIngredients}/>}
            {(this.state.productionLinesString=='') && this.state.isDisabled && (isManager && !this.state.canUpdatePL) && <p><font size="4">There are no production lines</font></p>}
            {(this.state.productionLinesString!='') && this.state.isDisabled && (isManager && !this.state.canUpdatePL) &&
            <TextField
              id="selectProductionLines"
              label="Production Lines"
              value={this.state.productionLinesString}
              margin="normal"
              disabled = {this.state.isDisabled}
              multiline
              required
              style={{lineHeight:1.5}}
            />}
            {(!this.state.isDisabled || (isManager && this.state.canUpdatePL))
              && <SelectProductionLines currentFormula={this.state.name} initialArray={this.state.productionLinesArray} handleChange={this.updateProductionLines}/>}
            </FormGroup>

            <br></br>
            {this.state.isIntermediate && <div>
            <p><font size="5">Storage Information</font></p>
              <FormControl style={styles.productType}>
              <InputLabel htmlFor="temperatureZone">Temperature</InputLabel>
                   {this.state.isIntermediate &&  <Select
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
                  </Select> }
              </FormControl>
              <br></br>
            <TextField
                required
                id="numUnitPerPackage"
                label="Quantity"
                value={this.state.numUnitPerPackage}
                onChange={(event)=>this.handleNumUnitPerPackage(event)}
                margin="normal"
                disabled = {this.state.isDisabled}
                style={styles.quantity}
            />
           <TextField
              id="nativeUnit"
              label="Native Units"
              value={this.state.nativeUnit}
              onChange={this.handleChange('nativeUnit')}
              margin="normal"
              disabled = {this.state.isDisabled}
              style = {styles.quantity}
              required
            />
            per
          <FormControl style={styles.packageName}>
            {this.state.isIntermediate && <InputLabel htmlFor="packageName">Package</InputLabel>}
            {this.state.isIntermediate && <Select
              value={this.state.packageName}
              onChange={this.handleChange("packageName")}
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
            </Select> }
          </FormControl>
          {(this.state.isCreateNew && (this.state.numUnitPerPackage!=0)) && <p>{(this.state.unitsProvided/this.state.numUnitPerPackage).toFixed(2)} packages will be produced</p>}
          </div>}
          <div style={{ display: 'flex', justifyContent: 'left', gap: '15px', marginTop: '30px' }}>
              {(this.state.isDisabled && isAdmin) && (
                <RaisedButton
                  raised
                  onClick={() => { this.setState({ isDisabled: false }); }}
                  style={{
                    backgroundColor: '#DAA520', // Gold color
                    color: '#fff', // White text
                    fontWeight: 'bold',
                    borderRadius: '5px',
                    padding: '10px 20px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  EDIT
                </RaisedButton>
              )}
              {(!this.state.canUpdatePL && !isAdmin && isManager) && (
                <RaisedButton
                  raised
                  onClick={() => { this.setState({ canUpdatePL: true }); }}
                  style={{
                    backgroundColor: '#DAA520', // Gold color
                    color: '#fff', // White text
                    fontWeight: 'bold',
                    borderRadius: '5px',
                    padding: '10px 20px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  EDIT
                </RaisedButton>
              )}
              {((!this.state.isDisabled) || (this.state.canUpdatePL)) && (
                <RaisedButton
                  raised
                  type="Submit"
                  primary="true"
                  style={{
                    backgroundColor: '#DAA520', // Gold color
                    color: '#fff', // White text
                    fontWeight: 'bold',
                    borderRadius: '5px',
                    padding: '10px 20px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  {(this.state.isCreateNew) ? 'ADD' : 'SAVE'}
                </RaisedButton>
              )}
              {this.props.location.state.fromLogs ? (
                <RaisedButton
                  raised
                  component={Link}
                  to="/log"
                  style={{
                    backgroundColor: '#E0E0E0', // Light gray for secondary buttons
                    color: '#333', // Dark text
                    fontWeight: 'bold',
                    borderRadius: '5px',
                    padding: '10px 20px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  BACK
                </RaisedButton>
              ) : (
                <RaisedButton
                  raised
                  component={Link}
                  to="/formula"
                  style={{
                    backgroundColor: '#E0E0E0', // Light gray for secondary buttons
                    color: '#333', // Dark text
                    fontWeight: 'bold',
                    borderRadius: '5px',
                    padding: '10px 20px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  BACK
                </RaisedButton>
              )}
            </div>

           </form>
                      {fireRedirect && (
             <Redirect to={'/formula'}/>
           )}
                      {pageNotFound && (<Redirect to={'/pagenotfound'}/>)}
                      </div>
    )
	}
};


export default FormulaDetails;
