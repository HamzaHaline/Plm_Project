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
// import * as userActions from  '../../interface/userInterface';
const queryString = require('query-string');

const styles = {
    buttons: {
      marginTop: 30,
      float: 'center'
    },
    saveButton: {
      marginLeft: 5
    },
    paper: {
      padding: 50,
      width: 500,
      textAlign: 'center',
      marginLeft: 'auto',
      marginRight: 'auto',
      marginTop: 50
    },
    media: {
      height: 200,
      width: 500,
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
            <div>
            <AppBar style={{height:60}}>
              <Typography style={{marginTop: 'auto', marginBottom: 'auto', textAlign:'center'}} type="title" color="inherit" noWrap>
                Real Producers
              </Typography>
          </AppBar>
            <Card style={styles.paper}>
            <CardMedia
          style={styles.media}
          image="https://t3.ftcdn.net/jpg/01/27/38/98/240_F_127389862_pMUoWAQMoKsq6QOrF8kq8S9KaXOCjlHP.jpg"
        />
            <form style={{width: 500}} onSubmit={this.onFormSubmit}>
                <TextField
                    required
                    fullWidth={true}
                    label="Username"
                    value={this.state.username}
                    onChange = {(event) => this.setState({ username: event.target.value})}
                    margin="normal"
                    validations={[required]}
                />

                <FormControl fullWidth required>
                  <InputLabel htmlFor="password">Password</InputLabel>
                  <Input
                    id="password"
                    name="password"
                    label="Password"
                    
                    type={this.state.showPassword ? 'text' : 'password'}
                    value={this.state.password}
                    onChange={(event) => this.setState({ password: event.target.value})}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          onClick={this.handleClickShowPasssword}
                          onMouseDown={this.handleMouseDownPassword}
                        >
                          {this.state.showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                        }
                      />
               </FormControl>

              <div style={styles.buttons}>

                  <RaisedButton raised color = "secondary" onClick={this.handleLogin}
                   primary="true" type="Submit" >LOGIN</RaisedButton>
                  
                  <RaisedButton raised
                  style={{marginLeft: 10}}
                  color = "primary"
                  href = {this.state.oAuthHref}
                  > Duke Log In </RaisedButton>    

             </div>
           </form>
           </Card>
         </div>

    )
	}
};

export default LoginPage;
