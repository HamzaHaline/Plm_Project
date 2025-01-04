// mainPage.js

import React from 'react';
import Paper from 'material-ui/Paper';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Tabs, { Tab } from 'material-ui/Tabs';
import Typography from 'material-ui/Typography';

//local imports
import ShoppingCart from './shoppingCart';
import PendingOrderTable from './pendingOrder/PendingOrderTable'

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

//for deciding which tab to display when reloading
const pendingOrderKey = 'goToPendingOrders';


class ScrollableTabsButtonAuto extends React.Component {
  constructor(props){
    super(props);
    const defaultTab = sessionStorage.getItem(pendingOrderKey)? 1: 0;
    console.log('defaultTab is ' + defaultTab);
    this.state={
      value: defaultTab,
    }

    this.switchToPendingOrders = this.switchToPendingOrders.bind();
  }

  handleChange(event, value){
    this.setState({ value });
  };

  switchToPendingOrders(){
  	this.setState({value: 1});
  }


  componentWillMount(){
    console.log("componentWillMount()");
    sessionStorage.removeItem(pendingOrderKey);
    console.log(pendingOrderKey + " is removed from sessionStorage");
    console.log(sessionStorage.getItem(pendingOrderKey));
  }

  render() {
    const { classes } = this.props;
    const { value } = this.state;

    return (
      <Paper>
        <AppBar position="static" color="default">
          <Tabs
            value={value}
            onChange={this.handleChange}
            indicatorColor="primary"
            textColor="primary"
            scrollable
            scrollButtons="auto"
          >
            <Tab label="Shopping Cart" />
            <Tab label="Pending Orders" />
          </Tabs>
        </AppBar>
        {value === 0 && <ShoppingCart switchToPendingOrders={this.switchToPendingOrders}/>}
        {value === 1 && <PendingOrderTable/>}
      </Paper>
    );
  }
}

ScrollableTabsButtonAuto.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ScrollableTabsButtonAuto);
