import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Tabs, { Tab } from 'material-ui/Tabs';
import Typography from 'material-ui/Typography';
import AdminIngredients from './AdminIngredients';
import Intermediates from './intermediates';


function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    backgroundColor: theme.palette.background.paper,
  },
});

class MainIngredientView extends React.Component {
  state = {
    value: 0,
  };

  handleChange = (event, value) => {
    event.preventDefault();
    this.setState({ value });
  };

  render() {
    const { classes } = this.props;
    const { value } = this.state;

    return (
      <div className={classes.root}>
      <p><b><font size="6" color="3F51B5">Ingredients</font></b></p>
        <AppBar position="static" color="default">
          <Tabs
            value={value}
            onChange={this.handleChange}
            indicatorColor="primary"
            textColor="primary"
            scrollable
            scrollButtons="auto"
          >
            <Tab label="Ingredients" />
            <Tab label="Intermediates" />
          </Tabs>
        </AppBar>
        {value === 0 && <AdminIngredients/>}
        {value === 1 && <Intermediates/>}
      </div>
    );
  }
}

MainIngredientView.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MainIngredientView);
