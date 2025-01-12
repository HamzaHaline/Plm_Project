import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
//import Select from 'react-select';
import Grid from 'material-ui/Grid';
import IconButton from 'material-ui/IconButton';
import AddCircleIcon from 'material-ui-icons/AddCircle';
import * as productionLineActions from '../../interface/productionLineInterface.js';
import * as testConfig from '../../../resources/testConfig.js';
import Tooltip from 'material-ui/Tooltip';
import Select from 'material-ui/Select';
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';
import { FormControl, FormGroup, FormHelperText } from 'material-ui/Form';
import { MenuItem } from 'material-ui/Menu';
import Button from 'material-ui/Button';
import ProductionLineItem from './ProductionLineItem.js';
import { ToastContainer, toast } from 'react-toastify';
import * as productionLinesActions from '../../interface/productionLineInterface';
// TODO: Get sessionID and UserID
var sessionId = "";
var userId="";

class SelectProductionLines extends Component {

  constructor(props) {
    super(props)
    this.state = {
      selectName: "",
      options: [],
      formulasArray: this.props.initialArray,
    };

    this.deleteFormula = this.deleteFormula.bind(this);
    this.addFormula = this.addFormula.bind(this);
    this.loadFormulasArray = this.loadFormulasArray.bind(this);
    this.loadCodeNameArray = this.loadCodeNameArray.bind(this);
    this.handleSelectedFormula = this.handleSelectedFormula.bind(this);
    this.resetArray = this.resetArray.bind(this);

  }

  componentWillMount(){
    this.loadCodeNameArray();
    this.loadFormulasArray();
  }

  loadFormulasArray(){
    this.setState({formulasArray: this.props.initialArray});
  }

  async loadCodeNameArray(){
   // var startingIndex = 0;
    sessionId = JSON.parse(sessionStorage.getItem('user'))._id;
    userId = JSON.parse(sessionStorage.getItem('user'))._id;

    var rawData = [];
    try{
      rawData = await productionLineActions.getAllProductionLinesAsync(sessionId);

      console.log("CALLED FOR FORMULAS DATA ");
      console.log(rawData);

      var optionsArray = rawData.map(obj=>{
        return obj.name;
      });

      var ans = optionsArray;
      for(var i=0; i<this.props.initialArray.length; i++){
        ans = ans.filter(option=>option!=this.props.initialArray[i]);
      } //filtering out the formulas that production line has to generate the options

      this.setState({options: ans});
      }catch(e){
        alert(e);
      }
  }

  resetArray(name, action){
    var ans = [];
     if(action=="delete"){
       this.state.options.push(name);
       this.setState({options:this.state.options});
     } else{
       ans = this.state.options.filter(option=>option!=name);
       this.setState({options:ans});
     }
  }


  addFormula(){
    console.log("addFormula is called");
    var newFormulaName = this.state.selectName;
    this.state.formulasArray.push(newFormulaName);
    this.setState({formulasArray:this.state.formulasArray});
    console.log(this.state.formulasArray);
    this.resetArray(newFormulaName, "add");
    this.setState({selectName: ""})
    this.props.handleChange(this.state.formulasArray);
  }

  async deleteFormula(index, name){
    var singleData = await productionLinesActions.getProductionLineByNameAsync(name,sessionId);
    if(singleData.data.currentFormula==this.props.currentFormula){
      toast.error('Production line is currently being used!');
    }
    else if (index !== -1) {
      console.log("delete");
      var searchedFormula = this.state.formulasArray.find(function(element){
        return element==name;
      });
      this.state.formulasArray.splice(index, 1);
      this.setState({formulasArray:this.state.formulasArray});
      this.resetArray(name, "delete");
      this.props.handleChange(this.state.formulasArray);
    }
  }

  updateId (formulaName, index) {
    console.log("updateId is fired");
    if(index!=-1){
      this.state.formulasArray[index] = formulaName;
      this.setState({formulasArray: this.state.formulasArray});
      this.props.handleChange(this.state.formulasArray);
    }
  }

  handleSelectedFormula(event){
    var selectedName = event.target.value;
    var searchedFormula = this.state.options.find(function(element){
      return element==selectedName;
    });
    this.setState({selectName:selectedName});
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
          <p>Production Lines:</p>
          <FormControl style={{marginLeft: 20, width:150}}>
            <InputLabel htmlFor="productionLineName">Production Line</InputLabel>
            <Select
             disabled={this.state.options.length==0}
             value={this.state.selectName}
             onChange={this.handleSelectedFormula}
             inputProps={{
              name: 'productionLineName',
              id: 'productionLineName',
             }}>
            {this.state.options.map((formulaName, index)=>(<MenuItem key={index} value={formulaName}>{formulaName}</MenuItem>))}
            </Select>
         </FormControl>
         {this.state.selectName &&
         <Button raised style={{marginLeft:10}} onClick={()=>{this.addFormula();}}>ADD Production Line</Button>}
      <br/>
      <ProductionLineItem
        formulasArray={this.state.formulasArray}
        deleteFormula={this.deleteFormula}
        updateId={this.updateId}
        options={this.state.options} />
      </div>
    );
  }
}

export default SelectProductionLines;
