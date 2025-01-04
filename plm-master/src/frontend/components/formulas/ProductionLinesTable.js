import React from 'react';
import PropTypes from 'prop-types';
import {
  FilteringState,
  IntegratedFiltering,
} from '@devexpress/dx-react-grid';
import {
  SortingState, EditingState, PagingState,
  IntegratedPaging, IntegratedSorting, SelectionState
} from '@devexpress/dx-react-grid';
import {
  Grid,
  Table, TableFilterRow, TableHeaderRow, TableEditRow, TableEditColumn,
  PagingPanel, DragDropProvider, TableColumnReordering, TableSelection,
} from '@devexpress/dx-react-grid-material-ui';
import Paper from 'material-ui/Paper';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import Input from 'material-ui/Input';
import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';
import { TableCell } from 'material-ui/Table';

import DeleteIcon from 'material-ui-icons/Delete';
import EditIcon from 'material-ui-icons/Edit';
import SaveIcon from 'material-ui-icons/Save';
import CancelIcon from 'material-ui-icons/Cancel';
import AddShoppingCartIcon from 'material-ui-icons/AddShoppingCart';
import { withStyles } from 'material-ui/styles';

import Styles from  'react-select/dist/react-select.css';
import ReactSelect from 'react-select';
import {Link} from 'react-router-dom';

import * as productionLinesActions from '../../interface/productionLineInterface';
import * as formulaActions from '../../interface/formulaInterface';
import * as testConfig from '../../../resources/testConfig.js';
import * as uploadInterface from '../../interface/uploadInterface';
import PubSub from 'pubsub-js';
import { ToastContainer, toast } from 'react-toastify';
import Typography from 'material-ui/Typography';

//TODO: Set the user ID
var sessionId = "";
var userId;

const READ_FROM_DATABASE = testConfig.READ_FROM_DATABASE;


const styles = theme => ({
  lookupEditCell: {
    verticalAlign: 'top',
    paddingRight: theme.spacing.unit,
    paddingTop: theme.spacing.unit * 1.25,
    paddingLeft: theme.spacing.unit,
  },
  dialog: {
    width: 'calc(100% - 16px)',
  },
  inputRoot: {
    width: '100%',
  },
  button: {
    margin: theme.spacing.unit,
  },
});

const Cell = (props) => {
  console.log("Productionline cell props value: ");
  console.log(props);
  if(props.column.name=='isIdle'){
    return (props.row.isIdle) ? <Table.Cell {...props}> <p><font color="green">IDLE</font></p></Table.Cell> :
           <Table.Cell {...props}> <Typography color="error">BUSY</Typography> </Table.Cell> 
  }
  else return <Table.Cell {...props} />;
};

Cell.propTypes = {
  column: PropTypes.shape({ name: PropTypes.string }).isRequired,
};

const SelectionCell = (props) => {
  console.log("selection cell props value: ");
  console.log(props);
  if(props.row.isIdle)
    return <TableSelection.Cell {...props} />;
  else
    return <div></div>
};

SelectionCell.propTypes = {
  column: PropTypes.shape({ name: PropTypes.string }).isRequired,
};

const getRowId = row => row.id;

class ProductionLinesTable extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      columns:[
        { name: 'name', title: 'Name' },
        { name: 'description', title: 'Description' },
        { name: 'currentFormula', title: 'Current Formula' },
        { name: 'isIdle', title: 'Status' },],
      rows:[],
      sorting: [{ columnName: 'isIdle', direction: 'desc' }],
      currentPage: 5,
      pageSize: 10,
      pageSizes: [10, 50, 100, 500],
      columnOrder: ['name', 'description', 'isIdle', 'currentFormula'],
      options:[],
      productionFormula:{},
      selection: [],
    };
    this.changeSorting = sorting => this.setState({ sorting });
    this.changeCurrentPage = currentPage => this.setState({ currentPage });
    this.changePageSize = pageSize => this.setState({ pageSize });
    var temp = this;
    this.changeSelection = selection => {
      console.log("change selection");
      console.log(selection);
      var newSelection = new Array();
      if(selection.length==1){
        newSelection.push(selection[0]);
      }else{
        newSelection.push(selection[1]);
      }
      temp.setState({ selection:newSelection });
      if(temp.state.rows[newSelection]){
        temp.props.handleChange(temp.state.rows[newSelection].name);
      }else{
        temp.props.handleChange("");
      }
    };
  }

  componentWillMount(){
    this.loadProductionLines();
  }

  async loadProductionLines(){
    sessionId = JSON.parse(sessionStorage.getItem('user'))._id;
    userId = JSON.parse(sessionStorage.getItem('user'))._id;
    var productionLinesArray = this.props.productionLinesArray;
    console.log("This is the production lines array");
    console.log(productionLinesArray);
    var rawData = [];
    //TODO: Get from backend
    for(var i =0; i<productionLinesArray.length;i++){
      console.log("this is the name of the PL: " + productionLinesArray[i]);
      var singleData = await productionLinesActions.getProductionLineByNameAsync(productionLinesArray[i],sessionId);
      console.log("this is the single data");
      console.log(singleData);
      rawData.push(singleData.data);
    }
    var processedData = [];
    if(rawData){
      processedData = [...rawData.map((row, index)=> ({
        id:index,...row,
      })),];
    }
    this.setState({rows: processedData});

    var availableLines = processedData.filter(element=>element.isIdle)
    console.log("these are the available lines");
    console.log(availableLines);
    if(availableLines.length==0){
      this.props.hasProductionLines();
    }
  }

  render() {
    const {classes,} = this.props;
    const {
      rows,
      columns,
      selection,
      sorting,
      currentPage,
      pageSize,
      pageSizes,
      columnOrder,
      productionFormula
    } = this.state;
    return(
      <div>
      <Paper>
        <Grid
          allowColumnResizing = {true}
          rows={rows}
          columns={columns}
          getRowId={getRowId}>

          <PagingState
            currentPage={currentPage}
            onCurrentPageChange={this.changeCurrentPage}
            pageSize={pageSize}
            onPageSizeChange={this.changePageSize}
          />
          <SortingState
            sorting={sorting}
            onSortingChange={this.changeSorting}
          />
          <IntegratedSorting />
          <IntegratedPaging />
          <SelectionState
            selection={selection}
            onSelectionChange={this.changeSelection}
          />
          <DragDropProvider />
          {/* {this.state.snackBarOpen && <SnackBarDisplay
                open = {this.state.snackBarOpen}
                message = {this.state.snackBarMessage}
                handleSnackBarClose = {this.handleSnackBarClose}
              /> } */}
          <Table
            // columnExtensions={tableColumnExtensions}
            cellComponent={Cell}
          />
          <TableColumnReordering
            order={columnOrder}
            onOrderChange={this.changeColumnOrder}
          />
          <TableHeaderRow showSortingControls/>
          <TableSelection 
            cellComponent={SelectionCell}
            highlightRow
          />
          <PagingPanel
            pageSizes={pageSizes}
          />
        </Grid>
    </Paper>
  </div>
);
  }

};

// Formula.propTypes = {
//   classes: PropTypes.object.isRequired,
// };

export default withStyles(styles, { name: 'ProductionLinesTable' })(ProductionLinesTable);
