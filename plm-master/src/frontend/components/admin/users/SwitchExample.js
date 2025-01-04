// SwitchExample.js
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import green from 'material-ui/colors/green';
import { FormGroup, FormControlLabel } from 'material-ui/Form';
import Switch from 'material-ui/Switch';

const styles = {
  // oauthSwitch: {
  // 	labelPosition: 'left',
  // }
};

class SwitchLabels extends React.Component {
  constructor(props) {
    	super(props);
  	};


  render() {
    const { classes } = this.props;

    return (
      <FormGroup row>
        <FormControlLabel
          control={
            <Switch
              checked={this.props.value}
              onChange={this.props.onChange}
              value='doesThisMatter'
              name="fromDukeOAuth"
              color="primary"
            />
          }
          label="Sign in via DukeOAuth"

        />
      </FormGroup>
    );
  }
}

SwitchLabels.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SwitchLabels);