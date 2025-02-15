import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import classNames from 'classnames';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import List from 'material-ui/List';
//import { MenuItem } from 'material-ui/Menu';
import Typography from 'material-ui/Typography';
//import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';
import ChevronLeftIcon from 'material-ui-icons/ChevronLeft';
import ChevronRightIcon from 'material-ui-icons/ChevronRight';
import { AdminItems} from './AdminMenu.js'; //admin only
import Routes from '../../routes.js';
import Login from '../login/LoginPage';
import cookie from 'react-cookies';
import Button from 'material-ui/Button';
import {Link} from 'react-router-dom';
import ExitToApp from 'material-ui-icons/ExitToApp';
import MainList from './MainList'
import luxuryImage from '../../a.png';


const drawerWidth = 230;

const styles = theme => ({
  root: {
    width: '100%',
    height: '100%',
    zIndex: 1,
    overflow: 'hidden',
  },
  appFrame: {
    position: 'relative',
    display: 'flex',
    width: '100%',
    height: '100%',
  },
  appBar: {
    position: 'absolute',
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  'appBarShift-left': {
    marginLeft: drawerWidth,
  },
  'appBarShift-right': {
    marginRight: drawerWidth,
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 20,
  },
  hide: {
    display: 'none',
  },
  drawerPaper: {
    position: 'relative',
    height: '100%',
    width: 230, // Sidebar width
    backgroundColor: '#333', // Set the sidebar background color (dark gray)
    color: '#fff', // Set text color
    fontFamily: 'Arial, sans-serif', // Set custom font
    padding: '10px 0', // Add padding inside the sidebar
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#444', // Darker color for the header area
    padding: '20px 10px', // Add padding for spacing
    borderBottom: '1px solid #555', // Optional border for separation
  },
  
  drawerPaper: {
    position: 'relative',
    height: '100%',
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  
  content: {
    width: '100%',
    flexGrow: 1,
  //  backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    height: 'calc(100% - 56px)',
    marginTop: 56,
    [theme.breakpoints.up('sm')]: {
      height: 'calc(100% - 64px)',
      marginTop: 64,
    },
  },


  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  'contentShift-left': {
    marginLeft: 0,
  },
  'contentShift-right': {
    marginRight: 0,
  },
  flex: {
    flex: 1,
  },
  icon:{
    marginRight: 5,
  }
});


class PersistentDrawer extends React.Component {

  constructor(props) {
        super(props);
        this.state = {
          open: false,
          anchor: 'left',
          loggedIn: (sessionStorage.getItem('user')!=null),
          isAdmin: ((sessionStorage.getItem('user')!=null)?(sessionStorage.getItem('user').isAdmin):false),
        };
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
  }

  login(key, user){
    //alert(message.toString());
    //this.setState({loggedIn:key});
    //this.setState({user:JSON.stringify(user)});
    //this.setState({ user:user });
    //sessionStorage.getItem('user') = user;
    console.log("entered login()");
    console.log("key:" + key);
    this.handleDrawerOpen();
    this.setState({isAdmin: key});
    this.setState({loggedIn: (sessionStorage.getItem('user')!=null)});

    //console.log(sessionStorage.getItem('user'));
  }

  componentDidMount(){
    console.log("component did mount");
    console.log(sessionStorage.getItem('user'));
    const user = JSON.parse(sessionStorage.getItem('user'));
    console.log(typeof user);
    const isAdmin = user == null ? false : user["isAdmin"];
    console.log("user is admin: " + isAdmin);
  }

  logout(){
    sessionStorage.removeItem('user');
    this.handleDrawerClose();
    this.setState({loggedIn: (sessionStorage.getItem('user')!=null)});
  }

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  handleChangeAnchor = event => {
    this.setState({
      anchor: event.target.value,
    });
  };

  render() {
    //copied from login() to make sure refreshing does not result in incorrect rendering
    const user = JSON.parse(sessionStorage.getItem('user'));
    console.log(typeof user);
    const isAdmin = (user == null) ? false : user["isAdmin"];
    console.log("user is admin: " + isAdmin);
    const { classes, theme } = this.props;
    const { anchor, open } = this.state;
    const drawer = user && (
       
       <Drawer
        type="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
        anchor={anchor}
        open={open}
      >
        <div className={classes.drawerInner}>
        <div
            className={classes.drawerHeader}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "10px 0",
              backgroundColor: "#f4f4f4", // Light gray background for contrast
            }}
          >
                <img
                  src={luxuryImage}
                  alt="Luxury Logo"
                  style={{
                    width: "150px",
                    height: "auto",
                    display: "block",
                  }}
                />
        </div>
          
            {/* Add the logo */}
                        {/* <IconButton onClick={this.handleDrawerClose}>
              {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton> */}
          <Divider />
          {isAdmin && <List className={classes.list}>{AdminItems}</List> }
          <Divider />
          <MainList > </MainList>
        </div>
      </Drawer>
    );

    let before = null;
    let after = null;

    if (anchor === 'left') {
      before = drawer;
    } else {
      after = drawer;
    }

    return (
      <div className={classes.root}>
        <div className={classes.appFrame}>
          {this.state.loggedIn && <AppBar  style={{
                marginLeft: 180,
                backgroundColor: '#4a4a4a', // Dark gray color
              }}
              className={classNames(classes.appBar, {
                [classes.appBarShift]: open,
                [classes[`appBarShift-${anchor}`]]: open,
              })}
            >
        
            <Toolbar disableGutters={!open}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={this.handleDrawerOpen}
                className={classNames(classes.menuButton, open && classes.hide)}
              >
                <MenuIcon />
              </IconButton>
              <Typography type="title" className={classes.flex} color="inherit" style={{
                marginTop: "25px",
                marginBottom: "auto",
                textAlign: "center",
                marginLeft: "200px",
                fontSize: "24px",
                fontWeight: "bold",
                height: "67px",
                color: "white",
                textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)",
              }} noWrap> LUXURY PERFUMER

              </Typography>
              <Button raised color="secondary" style={{ marginRight: 30, padding: "12px 30px", backgroundColor: "#e53935", color: "white", borderRadius: "10px", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)", fontSize: "16px", textTransform: "uppercase", fontWeight: "bold", cursor: "pointer", transition: "all 0.3s ease" }} onMouseOver={(e) => (e.target.style.backgroundColor = "#b71c1c")} onMouseOut={(e) => (e.target.style.backgroundColor = "#e53935")} onClick={this.logout} component={Link} to="/"><ExitToApp className={classes.icon} style={{ marginRight: "8px" }} /> Logout</Button>
            </Toolbar>
          </AppBar>}
          {before}
          <main
            className={classNames(classes.content, classes[`content-${anchor}`], {
              [classes.contentShift]: open,
              [classes[`contentShift-${anchor}`]]: open,
            })}
          >
            {this.state.loggedIn && <Routes/>}
            {!this.state.loggedIn && <Login login={this.login}/>}
          </main>
          {after}
                {/* Add the Footer Here */}
            <footer
              style={{
                backgroundColor: "#4a4a4a",
                color: "white",
                textAlign: "center",
                padding: "10px 0",
                position: "fixed", // Fixed at the bottom
                bottom: 0,
                width: "100%",
              }}
            >
              <Typography variant="body1">
                © 2025 Luxury Perfumer. All rights reserved.
              </Typography>
            </footer>
        </div>
      </div>
    );
  }
}

PersistentDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(PersistentDrawer);
