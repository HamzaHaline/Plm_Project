import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Tabs, { Tab } from 'material-ui/Tabs';
import Typography from 'material-ui/Typography';
import ShoppingCart from './shoppingCart.js';
import PendingOrderTable from './pendingOrder/PendingOrderTable.js';
import { ToastContainer, toast } from 'react-toastify';

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

const pendingOrderKey = 'goToPendingOrders';

class MainCartView extends React.Component {

  constructor(props) {
    super(props);
    const defaultTab = sessionStorage.getItem(pendingOrderKey)? 1: 0;

    const arrivedPending = sessionStorage.getItem('arrivedPendingKey');
    if(arrivedPending){
      toast.success("Successfully marked order as arrived!");
      //sessionStorage.setItem("arrivedPendingKey",false);
      sessionStorage.removeItem("arrivedPendingKey");
    }

    console.log('defaultTab is ' + defaultTab);
    this.state = {
      value: defaultTab,
      fromPR: (props.location.state) ? props.location.state.fromPR : false,
    };

    sessionStorage.removeItem(pendingOrderKey);
    console.log(pendingOrderKey + " is removed from sessionStorage");
    console.log(sessionStorage.getItem(pendingOrderKey));

    this.changeToPending = value => {
      console.log("current value");
      console.log(value);
      this.setState({ value });
    };
    console.log("this is from pr");
    console.log(this.state.fromPR);
  }

  handleChange = (event, value) => {
    event.preventDefault();
    this.setState({ value });
  };

  render() {
    const { classes } = this.props;
    const { value } = this.state;
    return (
    <div>
       <p style={{
        
        fontSize: "28px",    // Larger font size
        fontWeight: "normal",  // Bold font weight
        color: "#DAA520",    // Gold color
        margin: "20px 0",    // Top and bottom spacing
        textTransform: "uppercase", // Make it uppercase
        textShadow: "1px 1px 2px rgba(0, 0, 0, 0.3)", // Add subtle shadow
      }}>
        Orders
      </p>
      <div className={classes.root}>
        <AppBar position="static" color="default">
          <Tabs
            value={value}
            onChange={this.handleChange}
            indicatorColor="primary"
            textColor="primary"
            scrollable
            scrollButtons="auto"
          >
            <Tab label="Cart"/>
            <Tab label="Pending Orders" />
          </Tabs>
        </AppBar>
        {value === 0 && <ShoppingCart fromPR={this.state.fromPR} changeToPending={this.changeToPending}/>}
        {value === 1 && <PendingOrderTable/>}
      </div>
    </div>
    );
  }
}

MainCartView.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MainCartView);
