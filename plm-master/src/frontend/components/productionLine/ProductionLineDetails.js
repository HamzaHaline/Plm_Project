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
import { Redirect } from 'react-router';
import PubSub from 'pubsub-js';
import { ToastContainer, toast } from 'react-toastify';
import * as productionLineActions from '../../interface/productionLineInterface';
import SelectFormulas from './SelectFormulas.js';

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

class ProductionLineDetails extends React.Component{
  constructor(props) {
    super(props);
    var dummyObject = new Object();
    const details = (props.location.state.details)?(props.location.state.details):dummyObject;
    const isCreateNew = props.location.state.isCreateNew;
    this.state = {
      formulaNamesString:"",
      formulasArray: (details.formulaNames)?(details.formulaNames):[],
      productionLineId: (details.productionLineId)?(details.productionLineId):'',
      name:(details.name)?(details.name):'',
      description:(details.description)?(details.description):'',
      isIdle: isCreateNew ? true : details.isIdle,
      currentFormula: (details.currentFormula)?(details.currentFormula):{},
      startDates: (details.startDates)?(details.startDates) : [],
      endDates: (details.endDates)?(details.endDates):[],
      quantity:(details.quantity)?(details.quantity):'',
      newSpentMoney:(details.newSpentMoney)?(details.newSpentMoney):'',
      totalSpace:(details.totalSpace)?(details.totalSpace):'',
      arrayInProductOut: (details.arrayInProductOut)?(details.arrayInProductOut):[],
      isDisabled: (isCreateNew) ? false: true,
      isCreateNew: (isCreateNew),
      isValid: false,
      pageNotFound: false,
      canUpdatePL: false,
    }
    console.log("this is details");
    console.log(details);
    console.log(details.currentFormula);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.updateFormulas = this.updateFormulas.bind(this);
    this.computeFormulaNamesString = this.computeFormulaNamesString.bind(this);
    this.isValid = this.isValid.bind(this);
    this.loadProductionLine = this.loadProductionLine.bind(this);
    this.markComplete = this.markComplete.bind(this);
  }

  componentDidMount(){
    isAdmin = JSON.parse(sessionStorage.getItem('user')).isAdmin;
    isManager = JSON.parse(sessionStorage.getItem('user')).isManager;
    if(this.props.location.state.fromLogs){
      this.loadProductionLine(); //if from logs, need to fetch data
    }
      this.computeFormulaNamesString();
  }

async loadProductionLine(){
    var details = [];
    sessionId = JSON.parse(sessionStorage.getItem('user'))._id;
    userId = JSON.parse(sessionStorage.getItem('user'))._id;
    details = await productionLineActions.getProductionLineAsync(this.props.location.state.productionLineId, sessionId);
    
    if(!details){
      this.setState({pageNotFound: true}); //redirect if the production line does not exist
    }else{

    this.setState({
      name: details.name,
      productionLineId: this.props.location.state.productionLineId,
      description: details.description,
      formulasArray: details.formulaNames,
      isIdle: details.isIdle,
      currentFormula: details.currentFormula,
      startDates: details.startDates,
      endDates: details.endDates,
      quantity: details.quantity,
      newSpentMoney: details.newSpentMoney,
      totalSpace: details.totalSpace,
      arrayInProductOut: details.arrayInProductOut,
      fireRedirect: false,
      pageNotFound: false,
    });
    this.computeFormulaNamesString();
    }
  }

  handleChange = name => event => {
      this.setState({
        [name]: event.target.value,
      });
  };

  updateFormulas(updatedArray){
    this.setState({'formulaNamesArray': updatedArray});
    this.computeFormulaNamesString();
  }

  computeFormulaNamesString(){
    var formulas_string = "";
    if(this.state.formulasArray){
    for(var i =0; i < this.state.formulasArray.length; i++){
          var formulaName = this.state.formulasArray[i];
          //var vendorName = this.state.idToNameMap.get(vendorObject.codeUnique);
          formulas_string += formulaName
          if(i!= (this.state.formulasArray.length - 1)){
            formulas_string+='\n';
          }
        }
    }
    this.setState({formulaNamesString: formulas_string });
  }

  isValid(){
    console.log("is valid is called");
    var temp = this;
    if(!temp.state.name){
      toast.error(" Please enter the production line name. ");
      return false;
    }
      return true;
  }

  async markComplete(){
    var temp = this;
    sessionId = JSON.parse(sessionStorage.getItem('user'))._id;
    this.setState({isIdle:true});
    console.log("mark as complete");
    console.log(temp.state.productionLineId);
    var res = await productionLineActions.markComplete(temp.state.productionLineId, sessionId);
          console.log("asdf res");
          console.log(res);
          if(res.status == 400){
            PubSub.publish('showAlert', res.data);
          }else{
            toast.success('Production marked as completed');
          }
      temp.setState({isDisabled:true});
      temp.setState({canUpdatePL: false});
  }

  async onFormSubmit(e) {
    var temp = this;
    sessionId = JSON.parse(sessionStorage.getItem('user'))._id;
    e.preventDefault();
    console.log("submit formula ");
    var isValid = temp.isValid();
    if(isValid && temp.state.isCreateNew){
      if(temp.state.description==''){
        toast.warning("There is no description for: " + temp.state.name);
      }
      await productionLineActions.addProductionLine(temp.state.name, temp.state.description, 
        temp.state.formulasArray, temp.state.isIdle, sessionId, function(res){
              //TODO: Please update the error accordingly
              if(res.status==400 || res.status==500){
                PubSub.publish('showAlert', res.data );
              }else{
                temp.setState({fireRedirect: true});
                toast.success('Production line successfully added.');
              }
            });
    }else if (!temp.state.isCreateNew && isValid){
      await productionLineActions.updateProductionLine(temp.state.productionLineId, temp.state.name,
        temp.state.description, temp.state.formulasArray, temp.state.isIdle, sessionId, function(res){
          if(res.status == 400){
            PubSub.publish('showAlert', res.data);
          }else{
            temp.setState({fireRedirect: true});
            toast.success('Production line successfully updated.');
          }
        });
      temp.setState({isDisabled:true});
      temp.setState({canUpdatePL: false});
    }
  }

  render (){
    const { formulaId,name, description, isCreateNew,
      isDisabled, fireRedirect, pageNotFound} = this.state;
    return (
      <div>
      {(this.state.isCreateNew) ? 
          <p><b><font size="6" color="#DAA520">New Production Line</font></b></p> :
          <p><b><font size="6" color="#DAA520">Production Line Details</font></b></p>
        }
      <form onSubmit={this.onFormSubmit} style={styles.formControl}>
          <FormGroup>
            <TextField
              disabled = {this.state.isDisabled}
              id="name"
              label="Name"
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
                multiline
              />
          </FormGroup>
          <FormGroup>
            {(this.state.formulaNamesString=='') && this.state.isDisabled && (isManager && !this.state.canUpdatePL) && <p><font size="4">There are no formulas</font></p>}
            {(this.state.formulaNamesString!='') && this.state.isDisabled && (isManager && !this.state.canUpdatePL) &&
            <TextField
              id="selectFormulas"
              label="Formulas"
              value={this.state.formulaNamesString}
              margin="normal"
              disabled = {this.state.isDisabled}
              multiline
              required
              style={{lineHeight:1.5}}
            />}
            {(!this.state.isDisabled || (isManager && this.state.canUpdatePL))
              && <SelectFormulas currentFormula={this.state.currentFormula} initialArray={this.state.formulasArray} handleChange={this.updateFormulas}/>}
          </FormGroup>
        <br/>
        <p><font size="5">Production Run Information</font></p>
            <TextField
                required
                id="isIdle"
                label="Status"
                value={(this.state.isIdle)?"Idle":"Busy"}
                margin="normal"
                disabled = {true}
                style={styles.quantity}
            />
            {!this.state.isIdle && <TextField
              id="currentFormula"
              label="Formula under production"
              value={this.state.currentFormula}
              onChange={this.handleChange('currentFormula')}
              margin="normal"
              disabled = {true}
              style = {{width:190}}
              required
            />}
           {!this.state.isIdle &&(this.state.isDisabled && (isAdmin || isManager)) && <RaisedButton raised color="default" onClick={()=>this.markComplete()}>Complete</RaisedButton>}
              <div style={styles.buttons}>
                
                {(this.state.isDisabled && isAdmin) && <RaisedButton raised  style={{ backgroundColor: '#DAA520'}} onClick={()=>{this.setState({isDisabled:false});}} >EDIT</RaisedButton>}
                {(!this.state.canUpdatePL && !isAdmin && isManager) && <RaisedButton raised color = "secondary" onClick={()=>{this.setState({canUpdatePL:true});}} >EDIT</RaisedButton>}
                {( (!this.state.isDisabled) || (this.state.canUpdatePL) )&& 
                  <RaisedButton raised style={{
                    backgroundColor: '#DAA520', // Gold background
                    color: '#fff', // White text
                    fontWeight: 'bold',
                    margin: '10px', // Add margin for spacing
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Subtle shadow
                  }}type="Submit"
                  > {(this.state.isCreateNew)? 'ADD' : 'SAVE'} </RaisedButton>}

                {this.props.location.state.fromLogs?
                  <RaisedButton raised color="default" component={Link} to='/log'
                  style = {{marginLeft: 10}}> BACK </RaisedButton>:
                  <RaisedButton raised color="default"
                  component={Link} to='/production-line'
                  style = {{marginLeft: 10}}
                  > BACK </RaisedButton>
                }
             </div>
           </form>
            {fireRedirect && (<Redirect to={'/production-line'}/>)}
            {pageNotFound && (<Redirect to={'/pagenotfound'}/>)}
        </div>
    )
	}
};


export default ProductionLineDetails;
