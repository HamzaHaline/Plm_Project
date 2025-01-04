import React from 'react';
import PropTypes from 'prop-types';
import RegisterForm from './RegisterForm.jsx';
import { addUser } from '../../interface/userInterface.js';

import * as testConfig from '../../../resources/testConfig.js'

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
        password: ''
      }
    };

    this.processForm = this.processForm.bind(this);
    this.changeUser = this.changeUser.bind(this);
    this.userSuccessfullyAdded = this.userSuccessfullyAdded.bind(this);
  }

  componentWillMount(){
    sessionId = JSON.parse(sessionStorage.getItem('user'))._id;
  }

  userSuccessfullyAdded() {
    alert('User ' + this.state.user.username + ' is added successfully');
  }


  /**
   * Process the form.
   *
   * @param {object} event - the JavaScript event object
   */
  processForm(event) {
    // prevent default action. in this case, action is the form submission event
    event.preventDefault();

//        var str = JSON.stringify(this.state.user);
//        str = str.slice(0,-1) + ', "isAdmin": true, '+'"loggedIn":false'+'}';
//        var user = JSON.parse(str);
//        console.log(user);
    console.log("Creating user with the following information: " + JSON.stringify(this.state.user));
    var me = this;
    alert("Check Console!");
    console.log("Adding user has been commented out, please modify this part of the code");
    //commented out 
    // addUser(this.state.user.email, this.state.user.username, this.state.user.password, false, false, sessionId,
    //   (res)=>{
    //     if (res.status == 400) {
    //       alert(res.data);
    //     } else if (res.status == 500) {
    //       alert('Username or email already exists');
    //     }else{
    //       me.userSuccessfullyAdded();
    //       this.clearFields();
    //     }
    //   });
  }

  clearFields(){
    this.setState({email:""});
    this.setState({username:""});
    this.setState({password:""});
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
    user[field] = event.target.value;
    console.log("Changed user[field] to " + user[field]);
    console.log(user);
    this.setState({
      user
    });
    console.log("user after change is " + JSON.stringify(user));
  }

  /**
   * Render the component.
   */
  render() {
    return (
      <RegisterForm
        onSubmit={this.processForm}
        onChange={this.changeUser}
        errors={this.state.errors}
        user={this.state.user}
      />
    );
  }

}

RegisterPage.contextTypes = {
  router: PropTypes.object.isRequired
};

export default RegisterPage;
