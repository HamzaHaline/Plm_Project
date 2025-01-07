import React from 'react';
import PropTypes from 'prop-types';
import { TextField, Button, Card, Typography } from 'material-ui';
import { Link, Redirect } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as vendorActions from '../../interface/vendorInterface.js';
import * as testConfig from '../../../resources/testConfig.js';
import PubSub from 'pubsub-js';

const READ_FROM_DATABASE = testConfig.READ_FROM_DATABASE;
let sessionId = '';

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start', // Align form towards the top
    minHeight: '100vh',
    background: 'linear-gradient(to bottom, #fff, #f9f2dc)', // Subtle white to gold gradient
    padding: '20px',
  },
  card: {
    maxWidth: '700px', // Increased width
    padding: '40px', // Increased padding
    borderRadius: '15px',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', // Subtle shadow for elegance
    background: '#ffffff',
  },
  title: {
    fontSize: '28px', // Increased font size
    fontWeight: 'normal',
    textAlign: 'center',
    color: '#D4AF37', // Gold color for the title
    marginBottom: '30px', // Increased spacing below the title
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px', // Increased spacing between form fields
  },
  textField: {
    fontSize: '18px', // Larger text inside the input fields
  },
  buttonsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '30px', // Increased spacing above buttons
  },
  button: {
    padding: '15px 30px', // Increased button size
    fontWeight: 'bold',
    fontSize: '18px', // Larger font size
    textTransform: 'uppercase',
    borderRadius: '10px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)', // Subtle shadow
    transition: 'all 0.3s ease', // Smooth hover effect
  },
  addButton: {
    backgroundColor: '#D4AF37', // Gold color
    color: 'white',
  },
  addButtonHover: {
    backgroundColor: '#bfa133', // Darker gold on hover
  },
  backButton: {
    backgroundColor: '#e0e0e0', // Light gray for contrast
    color: '#555',
  },
  backButtonHover: {
    backgroundColor: '#c7c7c7', // Slightly darker gray on hover
  },
};


class AddVendorForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      contact: '',
      code: '',
      fireRedirect: false,
    };
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.redirectToVendorsFrom = this.redirectToVendorsFrom.bind(this);
    this.clearFields = this.clearFields.bind(this);
  }

  componentWillMount() {
    sessionId = JSON.parse(sessionStorage.getItem('user'))._id;
  }

  vendorSuccessfullyAdded() {
    toast.success('Vendor successfully added!');
    this.clearFields();
  }

  clearFields() {
    this.setState({ name: '', contact: '', code: '' });
  }

  redirectToVendorsFrom() {
    this.setState({ fireRedirect: true });
  }

  async onFormSubmit(e) {
    e.preventDefault();
    const { name, contact, code } = this.state;
    const me = this;
    await vendorActions.addVendor(name, contact, code, sessionId, function (res) {
      if (res.status === 400) {
        PubSub.publish('showAlert', res.data);
      } else if (res.status === 500) {
        toast.error('Vendor name or code already exists');
      } else {
        me.vendorSuccessfullyAdded();
      }
    });
  }

  render() {
    const { name, contact, code, fireRedirect } = this.state;

    return (
      <div style={styles.container}>
        <Card style={styles.card}>
          <Typography style={styles.title}>New Vendor</Typography>
          <form onSubmit={this.onFormSubmit} style={styles.form}>
            <TextField
              required
              fullWidth
              id="name"
              label="Vendor Name"
              value={name}
              onChange={(event) => this.setState({ name: event.target.value })}
              variant="outlined"
            />
            <TextField
              fullWidth
              id="contact"
              label="Contact Information"
              value={contact}
              onChange={(event) => this.setState({ contact: event.target.value })}
              variant="outlined"
            />
            <TextField
              required
              fullWidth
              id="code"
              label="Vendor Code"
              value={code}
              onChange={(event) => this.setState({ code: event.target.value })}
              variant="outlined"
            />
            <div style={styles.buttonsContainer}>
              <Button
                type="submit"
                style={{ ...styles.button, ...styles.addButton }}
                onMouseOver={(e) => (e.target.style.backgroundColor = styles.addButtonHover.backgroundColor)}
                onMouseOut={(e) => (e.target.style.backgroundColor = styles.addButton.backgroundColor)}
              >
                Add
              </Button>
              <Button
                component={Link}
                to="/vendors"
                style={{ ...styles.button, ...styles.backButton }}
                onMouseOver={(e) => (e.target.style.backgroundColor = styles.backButtonHover.backgroundColor)}
                onMouseOut={(e) => (e.target.style.backgroundColor = styles.backButton.backgroundColor)}
              >
                Back to Vendors
              </Button>
            </div>
          </form>
          {fireRedirect && <Redirect to="/vendors" />}
        </Card>
      </div>
    );
  }
}

export default AddVendorForm;
