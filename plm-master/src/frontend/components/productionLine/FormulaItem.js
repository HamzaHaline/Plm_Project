import React, {Component} from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Select from 'react-select';
import Grid from 'material-ui/Grid';
import IconButton from 'material-ui/IconButton';
import RemoveCircleIcon from 'material-ui-icons/RemoveCircle';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';
import Delete from 'material-ui-icons/Delete';
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
});

class FormulaItem extends Component {

  constructor(props) {
    super(props)
    this.state = {
    };
  }

  render() {
    return (
      <div style={{marginLeft:20}}>
      {this.props.formulasArray && this.props.formulasArray.map((formulaName,index)=>(
        <div key={index}>
        {formulaName}
          <IconButton aria-label="Delete" onClick={()=>{this.props.deleteFormula(index, formulaName);}}>
            <RemoveCircleIcon />
          </IconButton>
        </div>
      ))}
      </div>
    );
  }
}

export default FormulaItem;
