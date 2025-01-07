import React from 'react';
import Paper from 'material-ui/Paper';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Tabs, { Tab } from 'material-ui/Tabs';
import Typography from 'material-ui/Typography';
import FreshnessReport from './freshnessReport';
import ProductFreshnessReport from './productFreshnessReport';
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

class FreshnessMain extends React.Component {
  state = {
    value: 0,
  };

  handleChange = (event, value) => {
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
        Freshness KPIs Reports
      </p>
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
            <Tab label="Ingredient Freshness" />
            <Tab label="Product Freshness" />
          </Tabs>
        </AppBar>
        {value === 0 && <FreshnessReport/>}
        {value === 1 && <ProductFreshnessReport/>}
      </Paper>
    </div>
    );
  }
}

FreshnessMain.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(FreshnessMain);
