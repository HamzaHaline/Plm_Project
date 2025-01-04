import React from 'react';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/Button';
import {Link} from 'react-router-dom';
import Styles from  'react-select/dist/react-select.css';
import TextField from 'material-ui/TextField';
import {Card,CardHeader} from 'material-ui/Card';

import { withStyles } from 'material-ui/styles';
import IconButton from 'material-ui/IconButton';
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Visibility from 'material-ui-icons/Visibility';
import VisibilityOff from 'material-ui-icons/VisibilityOff';

const styles = {
  buttons: {
    marginTop: 30,
    float: 'center'
  },
  saveButton: {
    marginLeft: 5
  }
};

class SignUpForm extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      showPassword: false
    };
    this.handleClickShowPasssword = this.handleClickShowPasssword.bind(this);
  };

  handleMouseDownPassword(event){
    event.preventDefault();
  };

  handleClickShowPasssword(){
    this.setState({ showPassword: !this.state.showPassword });
  };

  render(){
    return (
<div>
    <label> Create a User </label>
    {this.props.errors.summary && <p className="error-message">{this.props.errors.summary}</p>}
      
    <form action = "/" onSubmit={this.props.onSubmit}>

      <TextField
        required
        fullWidth={true}
        id="username"
        name='username'
        label="Username"
        value={this.props.user.username}
        onChange={this.props.onChange}
        margin="normal"
      />
      <TextField
        required
        fullWidth={true}
        id="email"
        name="email"
        label="E-mail"
        value={this.props.user.email}
        onChange = {this.props.onChange}
        margin="normal"
      />
<br/><br/>
      <FormControl fullWidth required>
          <InputLabel htmlFor="password">Password</InputLabel>
          <Input
            id="password"
            name="password"
            label="Password"
            
            type={this.state.showPassword ? 'text' : 'password'}
            value={this.props.user.password}
            onChange={this.props.onChange}
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
        <RaisedButton raised color = "secondary"
          component = {Link} to = "/">Back To Dashboard</RaisedButton>
         <RaisedButton raised
          color="primary"
          style={styles.saveButton}
          type="Submit"
          primary="true"> Add </RaisedButton>
      </div>
    </form>
  </div>

    )
  }
}

SignUpForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
};

export default SignUpForm;
