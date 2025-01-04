// RadioButtonExample.js
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Radio, { RadioGroup } from 'material-ui/Radio';
import { FormLabel, FormControl, FormControlLabel, FormHelperText } from 'material-ui/Form';

const styles = theme => ({
  formControl: {
    marginTop: theme.spacing.unit * 3,
  },
  group: {
    margin: `${theme.spacing.unit}px 0`,
    display : 'flex',
  },
});

class RadioButtonsGroup extends React.Component {
	constructor(props) {
    	super(props);
    	this.state = {
      		value: 'user',
    	};
    	// this.handleChange = this.handleChange.bind(this);
  	};

  // handleChange = (event, value) => {
  // 	console.log("changing value to " + value);
  // 	console.log("props value: " + this.props.value);
  // 	console.log("props onChange: " + this.props.onChange);
  //   this.setState({ value });
  // };

  render() {
    const { classes } = this.props;

    return (
        <FormControl component="fieldset" required className={classes.formControl}>
          <FormLabel component="legend">Privilege</FormLabel>
          <RadioGroup
            aria-label="privilege"
            name="privilege"
            className={classes.group}
            value={this.props.value}
            onChange={this.props.onChange}
            row={true}
          >
            <FormControlLabel value="user" control={<Radio />} label="User" />
            <FormControlLabel value="manager" control={<Radio />} label="Manager" />
            <FormControlLabel value="admin" control={<Radio />} label="Admin" />
          </RadioGroup>
        </FormControl>
    );
  }
}

RadioButtonsGroup.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RadioButtonsGroup);