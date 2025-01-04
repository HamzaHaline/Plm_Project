import React from 'react';
import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import PubSub from 'pubsub-js';
import ErrorIcon from 'material-ui-icons/Error';
import Typography from 'material-ui/Typography';
import { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';

class AlertDialog extends React.Component {
  state = {
    open: false,
    currentMessage: '',
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    //window.location.reload();
    this.setState({ open: false });
  };

  componentDidMount() {
  //  var listener = PubSub.subscribe('showMessage', mySubscriber);

    var listener = PubSub.subscribe( 'showAlert', (subscribe, message) => {
      console.log("notification is called");
      console.log(message);
      console.log(subscribe);
      this.setState({open: true});
      this.setState({currentMessage: message});
    });
      
  }

  render() {
    return (
      <div>
        <Dialog
          disableBackdropClick
          disableEscapeKeyDown
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Error</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {this.state.currentMessage}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary" autoFocus>
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default AlertDialog;