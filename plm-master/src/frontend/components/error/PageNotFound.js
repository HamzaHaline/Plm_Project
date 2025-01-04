import React from 'react';
import Paper from 'material-ui/Paper';
import { DatePicker, DatePickerInput } from 'rc-datepicker';
import 'rc-datepicker/lib/style.css';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'reactstrap';
import {Link} from 'react-router-dom';
import {
  FilteringState,
  IntegratedFiltering,
  EditingState,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  Table,
  TableHeaderRow,
  TableEditRow,
  TableFilterRow,
  TableEditColumn,
  TableColumnReordering,
} from '@devexpress/dx-react-grid-material-ui';

class PageNotFound extends React.PureComponent {

  render() {

    return (
      <div>
        <h1>404 Not Found</h1>
        <font size="3" color="red">The requested data no longer exists.</font>
      </div>
    );
  }
}

export default PageNotFound;
