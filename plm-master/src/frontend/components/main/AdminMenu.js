import React from 'react';
import { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import {Link} from 'react-router-dom';
import PersonAddIcon from 'material-ui-icons/PersonAdd';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

const styles = theme => ({
  menuItem: {
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

export const AdminItems = (
  <div>
    {/*<ListItem component={Link} to="/register" button>
      <ListItemIcon>
        <PersonAddIcon />
      </ListItemIcon>
      <ListItemText primary="Create User (Admin)" />
    </ListItem>*/}

     <ListItem component={Link} to="/admin-users" button>
      <ListItemIcon>
        <PersonAddIcon />
      </ListItemIcon>
      <ListItemText primary="Users" />
    </ListItem>
  </div>
);


