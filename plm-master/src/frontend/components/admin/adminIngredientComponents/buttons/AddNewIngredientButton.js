import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import Button from 'material-ui/Button';


//Component for adding new ingredient
const AddButton = ({ onExecute }) => (
  <div style={{ textAlign: 'center' }}>
    <Button
      color="primary"
      title="Create New Ingredient"
      component={Link} to={{pathname: '/ingredient-details', state:{isCreateNew: true} }}
    >
      New
    </Button>
  </div>
);
AddButton.propTypes = {
  onExecute: PropTypes.func.isRequired,
};

export default AddButton;