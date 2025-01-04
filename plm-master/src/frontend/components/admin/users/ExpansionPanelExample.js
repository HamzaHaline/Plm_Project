// ExpansionPanelExample.js
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import ExpansionPanel, {
  ExpansionPanelSummary,
  ExpansionPanelDetails,
} from 'material-ui/ExpansionPanel';
import Typography from 'material-ui/Typography';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
//local imports
import RegisterForm from './RegisterForm.jsx';
import UserTable from './UserTable';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
});

function SimpleExpansionPanel(props) {
  const { classes } = props;
  return (
    <div className={classes.root}>
      
      <ExpansionPanel defaultExpanded>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.heading}>View All Users (Except Local Admin)</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <UserTable 
          	rows={props.rows}
          	refreshTable={props.refreshTable}
          />
        </ExpansionPanelDetails>
      </ExpansionPanel>

      <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.heading}>Create New Users</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
        	<RegisterForm
          		onSubmit={props.onFormSubmit}
          		onChange={props.onFormChange}
          		errors={props.formErrors}
          		user={props.formUser}
        	/>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    {/*
      <ExpansionPanel disabled>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.heading}>Disabled Expansion Panel</Typography>
        </ExpansionPanelSummary>
      </ExpansionPanel>
	*/}
    </div>
  );
}

SimpleExpansionPanel.propTypes = {
  classes: PropTypes.object.isRequired,
  onFormSubmit: PropTypes.func.isRequired,
  onFormChange: PropTypes.func.isRequired,
  formErrors: PropTypes.object.isRequired,
  formUser: PropTypes.object.isRequired
};

export default withStyles(styles)(SimpleExpansionPanel);
