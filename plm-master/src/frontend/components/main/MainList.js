// MainList.js
import React from 'react';
import PropTypes from 'prop-types';
import { MenuList, MenuItem } from 'material-ui/Menu';
import Paper from 'material-ui/Paper';
import { withStyles } from 'material-ui/styles';
import {Link} from 'react-router-dom';
import DashboardIcon from 'material-ui-icons/Dashboard'; //Dashboard
import KitchenIcon from 'material-ui-icons/Kitchen'; //Storage
import InventoryIcon from 'material-ui-icons/Assignment';//Inventory
import ColorizeIcon from '@material-ui/icons/Colorize'; //Ingredients
import VendorsIcon from 'material-ui-icons/Group'; // Vendors
import ShoppingCartIcon from 'material-ui-icons/ShoppingCart'; // Cart
import ReportIcon from 'material-ui-icons/Receipt'; // Report
import BugReportIcon from 'material-ui-icons/BugReport'; // Logs
import HourglassFullIcon from '@material-ui/icons/HourglassFull';
import HistoryIcon from 'material-ui-icons/History';
import BalanceIcon from 'material-ui-icons/AccountBalance';
import DistributionIcon from 'material-ui-icons/DeviceHub';
import BusinessIcon from 'material-ui-icons/Business';
import DateRangeIcon from 'material-ui-icons/DateRange';
import AttachMoneyIcon from 'material-ui-icons/AttachMoney';
import TimerIcon from 'material-ui-icons/Timer';
import AssessmentIcon from 'material-ui-icons/Assessment';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import Collapse from 'material-ui/transitions/Collapse';
import ExpandLess from 'material-ui-icons/ExpandLess';
import ExpandMore from 'material-ui-icons/ExpandMore';
import FunctionsIcon from '@material-ui/icons/Functions';

const styles = theme => ({
  menuItem: {
    '&:focus': {
      backgroundColor: 
      '#D4AF37','& $primary, & $icon': {
        color: theme.palette.common.white,
      },
    },
  },
  nested: {
    paddingLeft: theme.spacing.unit * 4,
    '&:focus': {
      backgroundColor: theme.palette.primary.main,
      '& $primary, & $icon': {
        color: theme.palette.common.white,
      },
    },
  },
  primary: {},
  icon: {},
});

var user;
var isAdmin;
var isManager;

class MainList extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      open: true,
    };
    user = JSON.parse(sessionStorage.getItem('user'));
    isAdmin = (user == null) ? false : user["isAdmin"];
    isManager = (user == null) ? false : user["isManager"];
  }

  handleClick = () => {
    this.setState({ open: !this.state.open });
  };

  render(){
    const { classes } = this.props;

    return (
      <div>
        <MenuList>
          <MenuItem className={classes.menuItem} component={Link} to="/vendors" button>
            <ListItemIcon className={classes.icon}>
              <VendorsIcon />
            </ListItemIcon>
            <ListItemText classes={{ primary: classes.primary }} inset primary="Vendors" />
          </MenuItem>

          <MenuItem className={classes.menuItem} component={Link} to="/admin-ingredients" button>
            <ListItemIcon className={classes.icon}>
              <ColorizeIcon />
            </ListItemIcon>
            <ListItemText classes={{ primary: classes.primary }} inset primary="Ingredients" />
          </MenuItem>

          { (isManager || isAdmin) &&
          <MenuItem className={classes.menuItem} component={Link} to="/cart" button>
            <ListItemIcon className={classes.icon}>
              <ShoppingCartIcon />
            </ListItemIcon>
            <ListItemText classes={{ primary: classes.primary }} inset primary="Orders" />
          </MenuItem>
          }

          {/* (isManager || isAdmin) &&
          <MenuItem className={classes.menuItem} component={Link} to="/pending-orders" button>
            <ListItemIcon className={classes.icon}>
              <DateRangeIcon />
            </ListItemIcon>
            <ListItemText classes={{ primary: classes.primary }} inset primary="Pending orders" />
          </MenuItem>*/
          }

          <MenuItem className={classes.menuItem} component={Link} to="/formula" button>
            <ListItemIcon className={classes.icon}>
              <FunctionsIcon />
            </ListItemIcon>
            <ListItemText classes={{ primary: classes.primary }} inset primary="Fragrance Formula" />
          </MenuItem>

          <MenuItem className={classes.menuItem} component={Link} to="/production-line" button>
            <ListItemIcon className={classes.icon}>
              <BusinessIcon/>
            </ListItemIcon>
            <ListItemText classes={{ primary: classes.primary }} inset primary="Production Line" />
          </MenuItem>

          <MenuItem className={classes.menuItem} component={Link} to="/product" button>
            <ListItemIcon className={classes.icon}>
              <HourglassFullIcon />
            </ListItemIcon>
            <ListItemText classes={{ primary: classes.primary }} inset primary="Productions" />
          </MenuItem>

          <MenuItem className={classes.menuItem} component={Link} to="/distribution-network" button>
            <ListItemIcon className={classes.icon}>
              <DistributionIcon/>
            </ListItemIcon>
            <ListItemText classes={{ primary: classes.primary }} inset primary="Distribution Network" />
          </MenuItem>

          <MenuItem className={classes.menuItem} component={Link} to="/storage" button>
            <ListItemIcon className={classes.icon}>
              <KitchenIcon />
            </ListItemIcon>
            <ListItemText classes={{ primary: classes.primary }} inset primary="Storage" />
          </MenuItem>

          <MenuItem className={classes.menuItem} button onClick={this.handleClick}>
            <ListItemIcon className={classes.icon}>
              <ReportIcon />
            </ListItemIcon>
            <ListItemText classes={{ primary: classes.primary }} inset primary="KPIs" />
            {this.state.open ? <ExpandLess /> : <ExpandMore />}
          
          </MenuItem>
          <Collapse in={this.state.open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {/* Financial */}
              <ListItem
                button
                className={classes.nested}
                component={Link}
                to="/report-financial"
                style={{
                  backgroundColor: 'transparent',
                  borderRadius: '5px',
                  color: '#D4AF37', // Gold text color
                  transition: 'all 0.3s ease',
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#F7E7CE')} // Lighter gold on hover
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <ListItemIcon
                  className={classes.icon}
                  style={{
                    color: '#D4AF37', // Gold icon color
                  }}
                >
                  <AttachMoneyIcon />
                </ListItemIcon>
                <ListItemText
                  inset
                  primary="Financial"
                  style={{
                    color: '#D4AF37', // Ensure gold text color
                  }}
                />
              </ListItem>

              {/* Freshness */}
              <ListItem
                button
                className={classes.nested}
                component={Link}
                to="/report-freshness"
                style={{
                  backgroundColor: 'transparent',
                  borderRadius: '5px',
                  color: '#D4AF37', // Gold text color
                  transition: 'all 0.3s ease',
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#F7E7CE')} // Lighter gold on hover
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <ListItemIcon
                  className={classes.icon}
                  style={{
                    color: '#D4AF37', // Gold icon color
                  }}
                >
                  <TimerIcon />
                </ListItemIcon>
                <ListItemText
                  inset
                  primary="Freshness"
                  style={{
                    color: '#D4AF37', // Ensure gold text color
                  }}
                />
              </ListItem>

              {/* Tracking */}
              <ListItem
                button
                className={classes.nested}
                component={Link}
                to="/report-tracking"
                style={{
                  backgroundColor: 'transparent',
                  borderRadius: '5px',
                  color: '#D4AF37', // Gold text color
                  transition: 'all 0.3s ease',
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#F7E7CE')} // Lighter gold on hover
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <ListItemIcon
                  className={classes.icon}
                  style={{
                    color: '#D4AF37', // Gold icon color
                  }}
                >
                  <AssessmentIcon />
                </ListItemIcon>
                <ListItemText
                  inset
                  primary="Tracking"
                  style={{
                    color: '#D4AF37', // Ensure gold text color
                  }}
                />
              </ListItem>
            </List>
          </Collapse>

          {(isManager || isAdmin) &&
          <MenuItem className={classes.menuItem} component={Link} to="/log" button>
            <ListItemIcon className={classes.icon}>
              <BugReportIcon />
            </ListItemIcon>
            <ListItemText classes={{ primary: classes.primary }} inset primary="Logs" />
          </MenuItem>
          }
        </MenuList>
      </div>
    );
  }
}

MainList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MainList);
