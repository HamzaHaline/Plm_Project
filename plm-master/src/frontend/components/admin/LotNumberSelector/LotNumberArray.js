import React, {Component} from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import { FormControl, FormHelperText, FormGroup } from 'material-ui/Form';
import IconButton from 'material-ui/IconButton';
import RemoveCircleIcon from 'material-ui-icons/RemoveCircle';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';
import Delete from 'material-ui-icons/Delete';
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';

class LotNumberArray extends Component {

  constructor(props) {
    super(props)
    this.state = {
    };
  }

  render() {
    return (
      <div>
      <p>Packages Assigned</p>
    	<div style={{marginLeft:20}}>
      {this.props.lotNumberArray && this.props.lotNumberArray.map((item,index)=>(
        <div key={index}>
          <FormControl style={{width:50}}>
            <Input
              required={true}
              type="number"
              value={item.package}
              onChange={(event)=>{this.props.updateQuantity(event, index);}}
            />
         </FormControl>
         <FormControl style={{marginLeft:10}}>
          <Input
            required={true}
            value={item.lotNumber}
            onChange={(event)=>{this.props.updateLotNumber(event, index);}}
          />
         </FormControl>
          <IconButton aria-label="Delete" onClick={()=>{this.props.deleteLotNumberItem(index);}}>
            <RemoveCircleIcon />
          </IconButton>

        </div>
      ))}
      </div>
      </div>
    );
  }
}

export default LotNumberArray
