import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
//import Select from 'react-select';
import Grid from 'material-ui/Grid';
import IconButton from 'material-ui/IconButton';
import AddCircleIcon from 'material-ui-icons/AddCircle';
import * as ingredientActions from '../../interface/ingredientInterface.js';
import * as testConfig from '../../../resources/testConfig.js';
import Tooltip from 'material-ui/Tooltip';
import Select from 'material-ui/Select';
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';
import { FormControl, FormGroup, FormHelperText } from 'material-ui/Form';
import { MenuItem } from 'material-ui/Menu';
import Button from 'material-ui/Button';
import IngredientItem from './IngredientItem.js';
import {ingredientData} from '../shoppingCart/dummyData';
import { ToastContainer, toast } from 'react-toastify';

// TODO: Get sessionID and UserID
var sessionId = "";
var userId="";

class SelectIngredients extends Component {

  constructor(props) {
    super(props)
    this.state = {
      selectName: "",
      inputQuantity: '',
      options: [],
      ingredientsArray: this.props.initialArray,
      idToNameMap: {}, //id = key, name=value
      nativeUnit: '',
    };
//     this.updateId = this.updateId.bind(this);
//     this.deleteVendor = this.deleteVendor.bind(this);
//     this.addVendor = this.addVendor.bind(this);
//     this.updatePrice = this.updatePrice.bind(this);
//     this.loadVendorsArray = this.loadVendorsArray.bind(this);
//     this.loadCodeNameArray = this.loadCodeNameArray.bind(this);
// //    this.updateName = this.updateName.bind(this);
// //    this.createMap = this.createMap.bind(this);
//     this.resetArray = this.resetArray.bind(this);

    this.deleteIngredient = this.deleteIngredient.bind(this);
    this.addIngredient = this.addIngredient.bind(this);
    this.updateQuantity = this.updateQuantity.bind(this);
    this.loadIngredientsArray = this.loadIngredientsArray.bind(this);
    this.loadCodeNameArray = this.loadCodeNameArray.bind(this);
    this.handleSelectedIngredient = this.handleSelectedIngredient.bind(this);
//    this.createMap = this.createMap.bind(this);
    this.resetArray = this.resetArray.bind(this);

  }

  componentWillMount(){
    this.loadCodeNameArray();
    this.loadIngredientsArray();
  //  this.resetArray();
  }

  componentDidMount(){
  //  this.createMap();
    console.log("componentDidMount()");
    console.log(this.state.options);
  }

  componentDidUpdate(){
    console.log("did update");
    console.log(this.state.ingredientsArray);
  }

  loadIngredientsArray(){
    console.log("ingredients array loaded");
    console.log(this.state.ingredientsArray);
    this.setState({ingredientsArray: this.props.initialArray});
  }

  async loadCodeNameArray(){
   // var startingIndex = 0;
    sessionId = JSON.parse(sessionStorage.getItem('user'))._id;
    userId = JSON.parse(sessionStorage.getItem('user'))._id;

    var rawData = [];
    try{
      rawData = await ingredientActions.getAllIngredientsAsync(sessionId);

      console.log("CALLED FOR INGREDIENTS DATA ");

      console.log(rawData);
      var optionsArray = rawData.map(obj=>{
      var temp = new Object();
      temp.ingredientName = obj.name;
      temp.label = obj.name;
      temp.nativeUnit = obj.nativeUnit;
      return temp;
      })
      var ans = optionsArray;
      console.log(optionsArray);
      for(var i=0; i<this.props.initialArray.length; i++){
        console.log("initialArray");
        console.log(this.props.initialArray);
        ans = ans.filter(option=>option.ingredientName!=this.props.initialArray[i].ingredientName);
      //  var index = optionsArray.map(item=>{item.ingredientName; console.log(item.ingredientName);}).indexOf(this.props.initialArray[i].ingredientName);
        console.log(ans);
      //  optionsArray.splice(index, 1);
      }

      this.setState({options: ans});
    }catch(e){
      toast.error(e);
    }
  }

  resetArray(name, nativeUnit, action){
    var ans = [];
     if(action=="delete"){
       var obj = new Object();
       obj.ingredientName = name;
       obj.label = name;
       obj.nativeUnit = nativeUnit;
       this.state.options.push(obj);
       console.log("what's up");
       console.log(this.state.options);
       this.setState({options:this.state.options});
     } else{
       ans = this.state.options.filter(option=>option.ingredientName!=name);
       this.setState({options:ans});
     }
  }

  addIngredient(){

    var newIngredient = new Object();
    console.log("addIngredient() was called");
    console.log(this.state.selectName);
    var tempId = this.state.selectName;
    var quantityFloat = parseFloat(this.state.inputQuantity);
    newIngredient = {ingredientName: tempId, quantity: quantityFloat, nativeUnit: this.state.nativeUnit};
    console.log("NEW INGREDIENT " + newIngredient);
    // var updateIngredient = new Array(this.state.ingredientsArray.slice(0));
    // updateIngredient.push(newIngredient);
    // console.log("I was called");
    // console.log( updateIngredient);
    this.state.ingredientsArray.push(newIngredient);
    this.setState({ingredientsArray:this.state.ingredientsArray});
    this.resetArray(tempId, this.state.nativeUnit, "add");
    this.setState({nativeUnit: ''});
    this.setState({inputQuantity : 0});
    this.setState({selectName: ""})
    console.log(this.state.ingredientsArray);
    this.props.handleChange(this.state.ingredientsArray);
  }

  deleteIngredient(index, name){
    if (index !== -1) {
      console.log("delete");
      // var updateIngredient = this.state.ingredientsArray.slice();
      // updateIngredient.splice(index, 1);
      // console.log("deletedArray");
      // console.log(updateIngredient);
      // this.setState({ingredientsArray: updateIngredient});
      var searchedIngredient = this.state.ingredientsArray.find(function(element){
        return element.ingredientName==name;
      });
      this.state.ingredientsArray.splice(index, 1);
      this.setState({ingredientsArray:this.state.ingredientsArray});
      this.resetArray(name, searchedIngredient.nativeUnit, "delete");
      this.props.handleChange(this.state.ingredientsArray);
    }

  }

  updateId (ingredient, index) {
    console.log("updateId is fired");
    if(index!=-1){
      // var updateIngredient = this.state.ingredientsArray.slice();
      // updateIngredient[index].ingredient = ingredient.id;
      // this.setState({ingredientsArray: updateIngredient});
      this.state.ingredientsArray[index].ingredientName = ingredient.ingredientName;
      this.setState({ingredientsArray: this.state.ingredientsArray});
      this.props.handleChange(this.state.ingredientsArray);
    }
  }

  updateQuantity (newQuantity, index){
    // console.log("this is the quantity");
    // var quantity = parseFloat(newQuantity.target.value);

    var quantity = newQuantity.target.value;
    console.log(typeof (quantity));
    // const re =/^[1-9]\d*$/;


    // const re = /^\d*\.?\d*$/;
    const re = /^\d{0,10}(\.\d{0,2})?$/;
      if ( index>=0 && re.test(quantity) && quantity!=null) {
        this.state.ingredientsArray[index].quantity = quantity;
        this.setState({ingredientsArray: this.state.ingredientsArray});
        this.props.handleChange(this.state.ingredientsArray);
      }else
        toast.error("Quantity must be a positive number.");
  }


updateQuantityHere(event){
  console.log(" UPDATE HERE " + event.target.value);
   const re = /^\d*\.?\d*$/;
  // const re =/^[1-9]\d*$/;
      if ( event.target.value == '' || (event.target.value>0 && re.test(event.target.value))) {
         this.setState({inputQuantity: event.target.value})
      }else{
        toast.error("Quantity must be a positive number.");
      }
  }

  handleSelectedIngredient(event){
    var selectedName = event.target.value;
    console.log(this.props.initialArray);
    var searchedIngredient = this.state.options.find(function(element){
      return element.ingredientName==selectedName;
    });
    console.log("found ingredient");
    console.log(searchedIngredient);
    this.setState({selectName:selectedName});
    this.setState({nativeUnit:searchedIngredient.nativeUnit});
  }

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
          <p>Ingredients:</p>
          <FormControl style={{marginLeft: 20, width:150}}>
            <InputLabel htmlFor="vendorName">Ingredient</InputLabel>
            <Select
             disabled={this.state.options.length==0}
             value={this.state.selectName}
             onChange={this.handleSelectedIngredient}
             inputProps={{
              name: 'ingredientName',
              id: 'ingredientName',
             }}>
            {this.state.options.map((ingredient, index)=>(<MenuItem key={index} value={ingredient.ingredientName}>{ingredient.ingredientName}</MenuItem>))}
            </Select>
         </FormControl>
         <FormControl style={{marginLeft:10}}>
          <InputLabel htmlFor="amount">Quantity</InputLabel>

          <Input
            style={{width:50}}
            id="adornment-amount"
            required
            onChange={(value)=>{this.updateQuantityHere(value);}}
            value={this.state.inputQuantity}
          />
         </FormControl>
         {this.state.selectName && (this.state.inputQuantity>0) &&
         <Button raised style={{marginLeft:10}} onClick={()=>{this.addIngredient();}}>ADD INGREDIENT</Button>}
 <br/>


      <IngredientItem idToNameMap = {this.state.idToNameMap}
        ingredientsArray={this.state.ingredientsArray}
        deleteIngredient={this.deleteIngredient}
        updateId={this.updateId} updateQuantity={this.updateQuantity}
        options={this.state.options} />
      </div>
    );
  }
}

export default SelectIngredients;
