import React from 'react';
import propTypes from 'prop-types';
import RaisedButton from 'material-ui/Button';
import {Link} from 'react-router-dom';
import Styles from  'react-select/dist/react-select.css';
import TextField from 'material-ui/TextField';

import { Redirect } from 'react-router'
import * as storageActions from '../../interface/storageInterface';
import Typography from 'material-ui/Typography';
import Card, {CardMedia} from 'material-ui/Card';
import { Switch, Route } from 'react-router-dom';
import PersistentDrawer from '../main/PersistentDrawer';
import * as userActions from '../../interface/userInterface';
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Visibility from 'material-ui-icons/Visibility';
import VisibilityOff from 'material-ui-icons/VisibilityOff';
import AppBar from 'material-ui/AppBar';

import { withStyles } from 'material-ui/styles';
import IconButton from 'material-ui/IconButton';

import axios from 'axios';
import PubSub from 'pubsub-js';
import luxuryImage from '../../a.png';
// import * as userActions from  '../../interface/userInterface';
const queryString = require('query-string');

const styles = {
  buttons: {
    marginTop: 30,
    display: 'flex', // Align buttons in a row
    justifyContent: 'center', // Center buttons horizontally
    gap: '15px', // Space between buttons
  },
  saveButton: {
    padding: '20px 25px', // Adjusted padding for a larger button
    backgroundColor: '#007BFF', // Modern blue color
    color: '#fff', // White text for contrast
    borderRadius: '15px', // Slightly rounded corners
    border: 'none', // Removes default border
    fontSize: '16px', // Larger font size
    cursor: 'pointer', // Pointer cursor on hover
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)', // Subtle shadow for depth
    transition: 'background-color 0.3s ease, transform 0.2s ease', // Smooth hover and click effect
  },
  saveButtonHover: {
    backgroundColor: '#0056b3', // Slightly darker blue on hover
  },
  saveButtonActive: {
    transform: 'scale(0.95)', // Slight shrinking effect when clicked
  },
  paper: {
    padding: 50,
    width: 500,
    textAlign: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 50,
    borderRadius: '20px', // Rounded corners for the card
    boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.2)', // Clean shadow for depth
    backgroundColor: '#f9f9f9', // Light gray background
  },
  media: {
    height: 200,
    width: 500,
    borderRadius: '20px', // Matches the card's rounded corners
    objectFit: 'cover', // Ensures proper image scaling
  },
};


  const required = (value) => {
  if (!value.toString().trim().length) {
    // We can return string or jsx as the 'error' prop for the validated Component
    return 'require';
  }
};

class LoginPage extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
  		username:'',
      password:'',
  		value:undefined,
      refrigerator:'',
      warehouse:'',
      fireRedirect: false,
      showPassword: false,
      oAuthHref: "https://oauth.oit.duke.edu/oauth/authorize.php?\
                    response_type=token&\
                    redirect_uri=https%3A%2F%2Flocalhost&\
                    scope=basic&\
                    state=1129&\
                    client_id=production-life-manager&\
                    client_secret=6JdHfn%wwI1LhBUR@@H1BXZqPkJ+ZgKI@xKR#goNGPr!nUehM=\
                    ",
      }
    // this.handleOnChange = this.handleOnChange.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleClickShowPasssword = this.handleClickShowPasssword.bind(this);
    this.registerOnClick = this.registerOnClick.bind(this);
    this.checkDukeOAuthLogin = this.checkDukeOAuthLogin.bind(this);
  }

  async getDukeUser(client_id, token){
    const dukeUser = await axios.get('https://api.colab.duke.edu/identity/v1/', {
        headers: {
         'x-api-key': client_id,
          'Authorization': `Bearer ${token}`
        }
      })
    // console.log(dukeUser);
    const dukeUserData = dukeUser.data;
    // console.log(dukeUserData);
    return dukeUserData;
  };

  async checkDukeOAuthLogin(){
    //redirects if hash exisits
    // console.log("Component did mount")
    const hash = window.location.hash;
    // console.log("Hash:")
    // console.log(hash);
    if(hash==""){
      // console.log("No hash is provided")
    } else{
      const parsed = queryString.parse(hash);
      // console.log("parsedHash:")
      // console.log(parsed);
      const client_id = "production-life-manager";
      const token = parsed["access_token"];
      // console.log("client_id: " + client_id);
      // console.log("token: " + token);
      const dukeUser = await this.getDukeUser(client_id, token);
      // console.log(dukeUser);
      const netId = dukeUser.netid;
      // console.log("netId: " + netId);
      const username = netId;
      const email = dukeUser.mail;
      // console.log("email: " + email);
      //automate log-in
      var temp = this;
      // add user to DukeUser Database if user does not exist previously
      var userAdded = false;
      await userActions.addDukeUserAutomaticAsync(email, username, false, false, true, (res) =>{
        // console.log(res);
        if (res.status == 400) {
            // message = res.data;
            // alert(message);
            sessionStorage.removeItem('user');
        } else {
          if (res.status == 200){
            // console.log(res.data);
            sessionStorage.setItem('user', JSON.stringify(res.data));
            sessionStorage.setItem('fromDukeOAuth', true);
            // console.log("hi" + JSON.parse(sessionStorage.getItem('user')).isAdmin);
            var isAdmin = JSON.parse(sessionStorage.getItem('user')).isAdmin;
            userAdded = true;
            console.log("calling login()")
            temp.props.login(isAdmin, res.data);
          };
        }
        });
      console.log("userAdded: " + userAdded);
    }
    
  }
  async componentWillMount(){
    await this.checkDukeOAuthLogin();
  }
  componentDidMount(){
    
  };

   handleClickShowPasssword(){
    this.setState({ showPassword: !this.state.showPassword });
  };

    handleMouseDownPassword(event){
    event.preventDefault();
  };

  registerOnClick(e){
    e.preventDefault();
    console.log("clicked");
    alert("There is no register button. Please ask your admin to create an account for you.");
  }

handleMouseDownPassword(event){
    event.preventDefault();
  };

  handleClickShowPasssword(){
    this.setState({ showPassword: !this.state.showPassword });
  };

  onFormSubmit(e) {
    console.log("SUBMIT");
    console.log("username " + this.state.username);
    console.log("password " + this.state.password);
    // TODO: Send data to the back end

    e.preventDefault()
    this.setState({ fireRedirect: true });
    }

  async handleLogin(e){
    console.log("I was fired");
    var res;
    var message = "";
    e.preventDefault();
    var temp = this;
    userActions.authenticateAsync(this.state.username, this.state.password, function(res){
        console.log(res);
        if (res.status == 400) {
            message = res.data;
            // alert(message);
            PubSub.publish('showAlert', message);
            sessionStorage.removeItem('user');
            sessionStorage.removeItem('fromDukeOAuth');
        } else {
            console.log(res.data);
            sessionStorage.setItem('user', JSON.stringify(res.data));
            sessionStorage.setItem('fromDukeOAuth', false);
            console.log("hi" + JSON.parse(sessionStorage.getItem('user')).isAdmin);
            var isAdmin = JSON.parse(sessionStorage.getItem('user')).isAdmin;
            temp.props.login(isAdmin, res.data);
        }
    });
  }


  render (){
    const { name, contact, code,fireRedirect, oAuthHref } = this.state;
    return (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "100vh",
              background: "linear-gradient(to bottom, #f5f5f5, #e9e9e9)", // Gradient background
              backgroundSize: "cover", // Ensures the gradient covers the full viewport
              backgroundAttachment: "fixed", // Fixes the background in place
              margin: 0, // Removes any default margin
            }}
          >
    
          <AppBar
            style={{
              height: 60,
              background: "linear-gradient(90deg, #1a1a1a, #4a4a4a)",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
            }}
          >
            <Typography
              style={{
                marginTop: "auto",
                marginBottom: "auto",
                textAlign: "center",
                fontSize: "24px",
                fontWeight: "bold",
                color: "white",
                textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)",
              }}
              color="inherit"
              noWrap
            >
              LUXURY PERFUMER
            </Typography>
          </AppBar>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "100vh",
              background: "linear-gradient(to bottom, #f5f5f5, #e9e9e9)", // Gradient background
              backgroundSize: "cover", // Ensures the gradient covers the full viewport
              backgroundAttachment: "fixed", // Fixes the background in place
              margin: 0, // Removes any default margin
              paddingTop: "50px", // Pushes the card upwards slightly
            }}
          ></div>
            <Card style={{ ...styles.paper, marginTop: "-400px" }}>
            <CardMedia
            style={{
              height: 300, // Adjust the height as needed
              width: '100%', // Adjust the width as needed
              objectFit: 'cover', // Ensures the image scales correctly
              borderRadius: '10px', // Optional for rounded corners
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)', // Optional for shadow
            }}
            image={luxuryImage}
            title="Luxury Perfume"
          />
        
            <form style={{width: 500}} onSubmit={this.onFormSubmit}>
      
                <TextField
                  required
                  fullWidth
                  label="Username"
                  value={this.state.username}
                  onChange={(event) => this.setState({ username: event.target.value })}
                  margin="normal"
                  variant="outlined"
                  style={{
                    backgroundColor: '#f9f9f9', // Light background inside the input
                    borderRadius: '10px', // Rounded corners for the input
                    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)', // Slight shadow for the input
                    marginBottom: '20px', // Space between username and password
                  }}
                  InputLabelProps={{
                    style: { color: '#888' }, // Label color
                  }}
                  inputProps={{
                    style: {
                      padding: '15px', // Padding inside the input
                    },
                  }}
                />
                
                

                {/* Password Field */}
                <TextField
                  required
                  fullWidth
                  label="Password" // This will act as the floating label
                  type={this.state.showPassword ? "text" : "password"} // Toggle password visibility
                  value={this.state.password}
                  onChange={(event) => this.setState({ password: event.target.value })}
                  margin="normal"
                  variant="outlined"
                  style={{
                    backgroundColor: '#f9f9f9', // Light background inside the input
                    borderRadius: '10px', // Rounded corners for the input
                    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)', // Slight shadow for the input
                    marginBottom: '20px', // Space below the password field
                  }}
                  InputLabelProps={{
                    style: { color: '#888' }, // Label color
                  }}
                  inputProps={{
                    style: {
                      padding: '15px', // Padding inside the input
                    },
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={this.handleClickShowPasssword}
                          onMouseDown={this.handleMouseDownPassword}
                        >
                          {this.state.showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />



                <div style={styles.buttons}>
                  <RaisedButton
                    raised
                    color="primary"
                    onClick={this.handleLogin}
                    type="Submit"
                    style={{
                      padding: "12px 30px",
                      backgroundColor: "#D4AF37", // Bright pink color for login button
                      color: "white",
                      borderRadius: "10px", // Rounded corners
                      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)", // Add shadow for depth
                      fontSize: "16px", // Increase font size
                      textTransform: "uppercase",
                      fontWeight: "bold",
                      cursor: "pointer",
                      transition: "all 0.3s ease", // Smooth hover effect
                    }}
                    onMouseOver={(e) => (e.target.style.backgroundColor = "#c2185b")} // Slightly darker on hover
                    onMouseOut={(e) => (e.target.style.backgroundColor = "#e91e63")} // Restore on mouse out
                  >
                    LOGIN
                  </RaisedButton>
                  <RaisedButton
                    raised
                    color="secondary"
                    style={{
                      padding: "12px 30px",
                      backgroundColor: "#e53935", // Bright red color for logout button
                      color: "white",
                      borderRadius: "10px", // Rounded corners
                      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)", // Add shadow for depth
                      fontSize: "16px", // Increase font size
                      textTransform: "uppercase",
                      fontWeight: "bold",
                      cursor: "pointer",
                      transition: "all 0.3s ease", // Smooth hover effect
                    }}
                    onMouseOver={(e) => (e.target.style.backgroundColor = "#b71c1c")} // Slightly darker on hover
                    onMouseOut={(e) => (e.target.style.backgroundColor = "#e53935")} // Restore on mouse out
                    onClick={() => {
                      // Perform logout logic
                      sessionStorage.removeItem("user"); // Clear session data or authentication token
                      alert("You have successfully logged out!"); // Optional feedback message
                      
                      // Close the page
                      window.close(); // Closes the current tab
                    }}
                  >
                    Logout
                  </RaisedButton>

                </div>

           </form>
           

           </Card>
           {/* Footer Section */}
           
            <div
              style={{
                backgroundColor: "#333333",
                position: "fixed",
                bottom: 0,
                left: 0,
                width: "100%",
                textAlign: "center",
                color: "#fff",
                padding: "15px 0", // Add padding
                fontSize: "14px",
                fontWeight: "lighter", // Softer font weight
                boxShadow: "0px -4px 10px rgba(0, 0, 0, 0.2)", // Add shadow on top
              }}
            >
              <Typography variant="body2" style={{ color: "#ccc" }}>
                © 2025 - Developed by Hamza HALINE Anis HENTIT | Private License
              </Typography>
              
            </div>

         </div>
         
         

    )
	}
};

export default LoginPage;
