import React from 'react';
import propTypes from 'prop-types';
import RaisedButton from 'material-ui/Button';
import {Link} from 'react-router-dom';
import Styles from  'react-select/dist/react-select.css';
import TextField from 'material-ui/TextField';
import {Card,CardHeader} from 'material-ui/Card';
import * as vendorActions from '../../interface/vendorInterface.js';

import { Redirect } from 'react-router'
import * as testConfig from '../../../resources/testConfig.js'
import PubSub from 'pubsub-js';
import { ToastContainer, toast } from 'react-toastify';
// TODO: get session Id from the user
var sessionId = "";
const READ_FROM_DATABASE = testConfig.READ_FROM_DATABASE;

const styles = {
  buttons: {
    marginTop: 30,
    float: 'center'
  },
  saveButton: {
    marginLeft: 10
  }
};

class AddVendorForm extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      value:undefined,
      contact:'',
      code:'',
      fireRedirect: false
    }
    // this.handleOnChange = this.handleOnChange.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.redirectToVendorsFrom = this.redirectToVendorsFrom.bind(this);
    this.clearFields = this.clearFields.bind(this);
  }

  componentWillMount(){
    sessionId = JSON.parse(sessionStorage.getItem('user'))._id;
  }

  vendorSuccessfullyAdded() {
    // alert('Vendor ' + this.state.name + ' is added successfully');
    toast.success('Vendor Successfully added!' );
    this.clearFields();
  }

  clearFields(){
    this.setState({name:''});
    this.setState({contact:''});
    this.setState({code:''});
  }
  redirectToVendorsFrom() {
    this.setState({ fireRedirect: true });
  }

  async onFormSubmit(e) {
    console.log("SUBMIT");
    console.log("name " + this.state.name);
    console.log("contact " + this.state.code);
    console.log("code " + this.state.contact);
    e.preventDefault()
    // TODO: Send data to the back end
//    try{
//      const response = await vendorActions.addVendor(
//      this.state.name,this.state.contact,this.state.code,sessionId);
//      this.setState({ fireRedirect: true });
//    }
//    catch (e){
//      console.log('An error passed to the front end!')
//      //TODO: error handling in the front end
//      alert(e);
//    }
  const me = this;
  await vendorActions.addVendor(

    this.state.name,this.state.contact,this.state.code,sessionId, function(res){
      if (res.status == 400) {
        PubSub.publish('showAlert', res.data);
        //alert(res.data);
      } else if (res.status == 500) {
        toast.error('Vendor name or code already exists');
      }else{
        me.vendorSuccessfullyAdded();
        // me.redirectToVendorsFrom();
      }
    });

  }

  render (){
    const { name, contact, code, fireRedirect } = this.state;
    return (
            <div>
             <p><b><font size="6" color="3F51B5">New Vendor</font></b></p>
            <form onSubmit={this.onFormSubmit}>
                <TextField
                    required
                    fullWidth={true}
                    id="name"
                    label="Name"
                    value={this.state.name}
                    onChange = {(event) => this.setState({ name: event.target.value})}
                    margin="normal"
                />
                <TextField
                    fullWidth={true}
                    id="contact"
                    label="Contact"
                    value={this.state.contact}
                    onChange = {(event) => this.setState({ contact: event.target.value})}
                    margin="normal"
                />
                <TextField
                    required
                    fullWidth={true}
                    id="code"
                    label="Code"
                    value={this.state.code}
                    onChange = {(event) => this.setState({ code: event.target.value})}
                    margin="normal"
                />
              <div style={styles.buttons}>
                  <RaisedButton raised
                            color="primary"
                            // component = {Link} to = "/vendors" //commented out because it overrides onSubmit
                            
                            type="Submit"
                            primary="true"> Add </RaisedButton>
                  <RaisedButton raised color = "default"
                  style={styles.saveButton}
                    component = {Link} to = "/vendors">Back To Vendors' List</RaisedButton>
             </div>
           </form>
           {fireRedirect && (
             <Redirect to={'/vendors'}/>
           )}
         </div>
    )
	}
};


export default AddVendorForm;
