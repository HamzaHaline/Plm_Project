import React from 'react';
import PropTypes from 'prop-types';
import IconButton from 'material-ui/IconButton';
import SaveIcon from 'material-ui-icons/Save';

const CommitButton = ({ onExecute }) => (
  <IconButton onClick={onExecute} title="Save changes">
    <SaveIcon />
  </IconButton>
);
CommitButton.propTypes = {
  onExecute: PropTypes.func.isRequired,
};
export default CommitButton;