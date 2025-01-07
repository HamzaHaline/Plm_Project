import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Button from 'material-ui/Button';

const AddButton = ({ onExecute }) => (
  <div style={{ textAlign: 'center' }}>
    <Button
      style={{
        backgroundColor: '#DAA520', // Gold color
        color: 'white', // White text
        padding: '10px 20px',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        borderRadius: '5px',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
        transition: 'all 0.3s ease',
      }}
      onMouseOver={(e) => (e.target.style.backgroundColor = '#F7E7CE')} // Hover lighter gold
      onMouseOut={(e) => (e.target.style.backgroundColor = '#DAA520')} // Revert to gold
      title="Create New Ingredient"
      component={Link}
      to={{ pathname: '/ingredient-details', state: { isCreateNew: true } }}
    >
      New
    </Button>
  </div>
);

AddButton.propTypes = {
  onExecute: PropTypes.func.isRequired,
};

export default AddButton;
