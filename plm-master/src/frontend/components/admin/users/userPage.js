// userPage.js
import React from 'react';
import PropTypes from 'prop-types';
//local imports
import { addLocalUser, addDukeUser } from '../../../interface/userInterface.js';
import * as testConfig from '../../../../resources/testConfig.js';
import ExpansionPanelExample from './ExpansionPanelExample';
import * as userInterface from '../../../interface/userInterface';
import PubSub from 'pubsub-js';
import { ToastContainer, toast } from 'react-toastify';
import Typography from 'material-ui/Typography';
// TODO: get session Id from the user
var sessionId = "";
// const sessionId = testConfig.sessionId;
const READ_FROM_DATABASE = testConfig.READ_FROM_DATABASE;
class RegisterPage extends React.Component {

  /**
   * Class constructor.
   */
  constructor(props, context) {
    super(props, context);

    // set the initial component state
    this.state = {
      errors: {},
      user: {
        email: '',
        username: '',
        password: '',
        privilege: 'user',
        fromDukeOAuth: false,
      },
      userTableRows: [],

    };
    //function that are used as props
    //for register
    this.processForm = this.processForm.bind(this);
    this.changeUser = this.changeUser.bind(this);
    this.userSuccessfullyAdded = this.userSuccessfullyAdded.bind(this);
    //for table display
    this.loadAllUsers = this.loadAllUsers.bind(this);
    //for both register and table display
    this.refreshTableInfo = this.refreshTableInfo.bind(this);
    
  }

  async componentWillMount(){
    sessionId = JSON.parse(sessionStorage.getItem('user'))._id;
    await this.loadAllUsers();
  }

  userSuccessfullyAdded() {
    toast.success('User ' + this.state.user.username + ' is added successfully', {
      position: toast.POSITION.TOP_RIGHT
    });
    //alert('User ' + this.state.user.username + ' is added successfully');
  }


  /**
   * Process the form.
   *
   * @param {object} event - the JavaScript event object
   */
  processForm(event) {
    // prevent default action. in this case, action is the form submission event
    event.preventDefault();
    console.log("Creating user...");
    const userInfo = this.state.user;
    console.log(userInfo);
//        var str = JSON.stringify(this.state.user);
//        str = str.slice(0,-1) + ', "isAdmin": true, '+'"loggedIn":false'+'}';
//        var user = JSON.parse(str);
//        console.log(user);
    // this.clearFields();
    // console.log("Creating user with the following information: " + JSON.stringify(this.state.user));
    var me = this;
    var isAdmin = false;
    var isManager = false;
    const privilegeLevel = userInfo.privilege.toLowerCase();
    if ( privilegeLevel === 'admin'){
      isAdmin = true;
      isManager = true;
    } else if (privilegeLevel === 'manager' ){
      isManager = true
    }
    if (userInfo.fromDukeOAuth){
      addDukeUser(userInfo.username, userInfo.email, isAdmin, isManager, sessionId, 
        (res)=>
        {
          if (res.status == 400) {
            PubSub.publish('showAlert', res.data );
            //alert(res.data);
          } else if (res.status == 500) {
            PubSub.publish('showAlert', "Username or email already exists" );
            //alert('Username or email already exists');
          }else{
            me.userSuccessfullyAdded();
            this.clearFields();
            this.refreshTableInfo()
          }
        }
      );
    } else {
      addLocalUser(userInfo.username, userInfo.password, userInfo.email, isAdmin, isManager, sessionId, 
        (res)=>
        {
          if (res.status == 400) {
            PubSub.publish('showAlert', res.data );
            //alert(res.data);
          } else if (res.status == 500) {
            PubSub.publish('showAlert', "Username or email already exists" );
            //alert('Username or email already exists');
          }else{
            me.userSuccessfullyAdded();
            this.clearFields();
            this.refreshTableInfo();
          }
        }
      );
    }

  }

  clearFields(){
    this.setState(
      {
        user:{
          ...this.state.user, 
          email:"",
          username:"",
          password:"",
          privilege:"user",
          fromDukeOAuth:false
        }
      }
    );
  }

  /**
   * Change the user object.
   *
   * @param {object} event - the JavaScript event object
   */
  changeUser(event) {
    const field = event.target.name;
    console.log("field is " + field);
    const user = this.state.user;
    console.log("user before change is " + JSON.stringify(user));
    if (field === "fromDukeOAuth"){
      user[field] = event.target.checked;
    } else{
      user[field] = event.target.value;
    }
    
    
    console.log("Changed user[" + field +"] to " + user[field]);
    console.log(user);
    this.setState({
      user
    });
    console.log("user after change is " + JSON.stringify(user));
  }

  refreshTableInfo(){
    this.loadAllUsers();
  }

  /*************************************
   * Functions that related to table displaying all users
   **************************************/
  async loadAllUsers(){
    const sessionId = JSON.parse(sessionStorage.getItem('user'))._id;
    // const fromDukeOAuth = JSON.parse(sessionStorage.getItem('fromDukeOAuth'));
    // console.log("sessionId:" + sessionId);
    // console.log("fromDukeOAuth:" + fromDukeOAuth);
    // const sessionInfo = utils.createSessionInfoObject(sessionId, fromDukeOAuth);
    // console.log("sessionInfo:");
    // console.log(sessionInfo);
    const rawUserData = await userInterface.getAllUsersAsync(sessionId);
    console.log("rawUserData:");
    console.log(rawUserData);
    if (rawUserData.length == 0){
      return;
    }
    var processedData=[];
    // loop through users
    for (var i = 0; i < rawUserData.length; i++) {
      const currentUser = rawUserData[i];
      console.log("processing user..." );
      console.log(currentUser);
      //process data
      var singleData = new Object ();
    // match schema for user
      singleData.username = currentUser.username;
      singleData.email = currentUser.email;
      singleData.isAdmin = currentUser.isAdmin;
      singleData.isManager = currentUser.isManager;
      singleData.fromDukeOAuth = currentUser.fromDukeOAuth;
      singleData.loggedIn = currentUser.loggedIn;
      singleData.userId = currentUser._id;
      singleData.privilege = 'user';
      //add privilege property, which is a string
      if (singleData.isAdmin){
        singleData.privilege = 'admin';
      } else if (singleData.isManager){
        singleData.privilege = 'manager';
      }
      console.log("packaged user");
      console.log(singleData);
      if (singleData.username == 'admin' && !singleData.fromDukeOAuth ){
        //do nothing
      } else {
        processedData.push(singleData);
      }
      
    };

    var finalData = [...processedData.map((row, index)=> ({
        id: index,...row,
      })),
    ];

    console.log("Finished Processing All Data:");
    console.log(finalData);
    this.setState({userTableRows: finalData});
    console.log("userTableRows:")
    console.log(this.state.userTableRows);
  };


  /**************************************
   * Render
  **************************************/

  /**
   * Render the component.
   */
  render() {
    return (
      <div>
        <p><b><font size="6" color="3F51B5">User Management</font></b></p>
        <ExpansionPanelExample
          //for register page
          onFormSubmit={this.processForm}
          onFormChange={this.changeUser}
          formErrors={this.state.errors}
          formUser={this.state.user}
          //for display users
          rows={this.state.userTableRows}
          refreshTable={this.refreshTableInfo}
        />
      </div>
    );
  }

}

RegisterPage.contextTypes = {
  router: PropTypes.object.isRequired
};

export default RegisterPage;
