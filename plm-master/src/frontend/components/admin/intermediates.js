import React from 'react';
import PropTypes from 'prop-types';
import {
  FilteringState,
  IntegratedFiltering,
} from '@devexpress/dx-react-grid';
import {
  SortingState, EditingState, PagingState,
  IntegratedPaging, IntegratedSorting,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  Table, TableFilterRow, TableHeaderRow, TableEditRow, TableEditColumn,
  PagingPanel, DragDropProvider, TableColumnReordering,
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
// import EditIcon from 'material-ui-icons/Edit';
// import SaveIcon from 'material-ui-icons/Save';
// import CancelIcon from 'material-ui-icons/Cancel';
import { withStyles } from 'material-ui/styles';

import Styles from  'react-select/dist/react-select.css';
import ReactSelect from 'react-select';
import testData from './testIngredients';
import SelectVendors from './SelectVendors';
import * as ingredientInterface from '../../interface/ingredientInterface';
import * as vendorInterface from '../../interface/vendorInterface';
import * as uploadInterface from '../../interface/uploadInterface';
import * as inventoryInterface from '../../interface/inventoryInterface';
  // TODO: get the sessionId
import * as testConfig from '../../../resources/testConfig.js';
import PubSub from 'pubsub-js';
import { ToastContainer, toast } from 'react-toastify';
import {Link} from 'react-router-dom';


const READ_FROM_DATABASE = testConfig.READ_FROM_DATABASE;
var isAdmin = "";
var isManager = "";
var sessionId = "";

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

const DeleteButton = ({ onExecute }) => (
  <IconButton onClick={onExecute} title="Delete row">
    <DeleteIcon />
  </IconButton>
);
DeleteButton.propTypes = {
  onExecute: PropTypes.func.isRequired,
};

const FilterCell = (props) => {
  return <TableFilterRow.Cell {...props} />
}
FilterCell.propTypes = {
  column: PropTypes.shape({ name: PropTypes.string }).isRequired,
};

const MultiSelectCellBase = ({
  onValueChange, vendorsArray, classes
}) => (
  <TableCell className={classes.lookupEditCell}>

     <SelectVendors initialArray={vendorsArray} handleChange={onValueChange}/>
    {/* </ReactSelect> */}
  </TableCell>
);

MultiSelectCellBase.propTypes = {
  onValueChange: PropTypes.func.isRequired,
  vendorsArray: PropTypes.any,
  classes: PropTypes.object.isRequired,
};

MultiSelectCellBase.defaultProps = {
  value: PropTypes.any,
};

export const MultiSelectCell = withStyles(styles, { name: 'ControlledModeDemo' })(MultiSelectCellBase);

const Cell = (props) => {
  console.log(" CELL props value: ");
  console.log(props);
  if(props.column.name=='name'){
    return <Table.Cell {...props}>
    <Link to={{pathname: '/ingredient-details', state:{details: props.row , isIntermediate:true} }}>{props.row.name}</Link>
    {/* {(props.row.numUnit>0)&&<Chip style={{marginLeft: 10}} label="In Stock"/>} */}
    </Table.Cell>
  }
  return <Table.Cell {...props} />;
};

Cell.propTypes = {
  column: PropTypes.shape({ name: PropTypes.string }).isRequired,
};

const EditCell = (props) => {
  return <TableEditRow.Cell {...props} />;
};
EditCell.propTypes = {
  column: PropTypes.shape({ name: PropTypes.string }).isRequired,
};

const getRowId = row => row.id;


class Intermediates extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      idToNameMap:{},
      columns: [
        { name: 'name', title: 'Name' },
        { name: 'packageNameString', title: 'Package' },
        { name: 'temperatureZone', title: 'Temperature Zone' },
        { name: 'numUnitString', title: "Current Quantity in Stock"},
        { name: 'space', title: "Space Occupied (sqft)"},
      ],
      // TODO: get data to display from back end
      // rows: testData.tablePage.items,

      rows:[],
      sorting: [],
      editingRowIds: [],
      addedRows: [],
      rowChanges: {},
      currentPage: 5,
      deletingRows: [],
      pageSize: 10,
      pageSizes: [5, 10, 0],
      columnOrder: ['name', 'temperatureZone', 'packageNameString', 'numUnitString', 'space'],
      options:[],
      lotNumberString:''
    };

    this.changeSorting = sorting => this.setState({ sorting });
    this.changeCurrentPage = currentPage => this.setState({ currentPage });
    this.changePageSize = pageSize => this.setState({ pageSize });
    this.commitChanges = async ( {deleted}) => {
      let { rows } = this.state;
      this.setState({ rows, deletingRows: deleted || this.state.deletingRows });
    };

    this.cancelDelete = () => this.setState({ deletingRows: [] });
    var tempThis = this;
    this.deleteRows = () => {
      const rows = this.state.rows.slice();
      this.state.deletingRows.forEach((rowId) => {
        const index = rows.findIndex(row => row.id === rowId);
        if (index > -1) {
          // This line removes the data from the rows
          //TODO: get the right data and send it to back end for delete
          var name = rows[index].name;
          var packageName = rows[index].packageName;
          console.log("delete");
          console.log(rows[index].ingredientId);
          ingredientInterface.deleteIngredient(rows[index].ingredientId, sessionId, function(res){
                if (res.status == 400) {
                    //alert(res.data);
                    PubSub.publish('showAlert', res.data);
                } else {
                    rows.splice(index, 1);
                    tempThis.loadAllIngredients();
                    toast.success('Ingredient successfully deleted!', {
                      position: toast.POSITION.TOP_RIGHT
                    });
                    //PubSub.publish('showMessage', ' Ingredient Successfully deleted!' );
                    // alert(" Ingredient successfully deleted ! ");
                }
          });
        }
      });
      this.setState({ rows, deletingRows: [] });
    };

    this.changeColumnOrder = (order) => {
      this.setState({ columnOrder: order });
    };
    // this.uploadFile = this.uploadFile.bind(this);
  }
  componentWillMount(){
    // this.loadCodeNameArray();
    this.loadAllIngredients();
    isAdmin = JSON.parse(sessionStorage.getItem('user')).isAdmin;
    isManager = JSON.parse(sessionStorage.getItem('user')).isManager;
  }

  componentDidMount(){
    //this.createMap();
  }

  // handleTabChange = (event, value) => {
  //   this.setState({ currentTab: value });
  // };

  async loadAllIngredients(){
    sessionId = JSON.parse(sessionStorage.getItem('user'))._id;
    var rawData = await ingredientInterface.getAllIntermediatesOnlyAsync(sessionId);
    rawData = (rawData)? rawData.data:[],
    console.log("getallIntermediates");
    console.log(rawData);
    if(rawData.length==0){
      return
    }
    var processedData=[];
    var finalData =[];
    for (var i = 0; i < rawData.length; i++) {
      // if(rawData[i].isIntermediate){
          var singleData = new Object ();
          console.log("singleData");
          console.log(singleData);
          singleData.name = rawData[i].name;
          singleData.packageName = rawData[i].packageName;
          singleData.packageNameString = rawData[i].packageName + " (" + rawData[i].numUnitPerPackage + " " + rawData[i].nativeUnit +")";
          singleData.temperatureZone = rawData[i].temperatureZone;
          singleData.moneySpent = rawData[i].moneySpent;
          singleData.moneyProd = rawData[i].moneyProd;
          singleData.nativeUnit = rawData[i].nativeUnit;
          singleData.numUnitPerPackage = rawData[i].numUnitPerPackage;
          singleData.numUnit = rawData[i].numUnit;
          singleData.numUnitString = rawData[i].numUnit + " " + rawData[i].nativeUnit;
          singleData.space = rawData[i].space;
          singleData.ingredientId = rawData[i]._id;
          processedData.push(singleData);
        // }
    }

    if(processedData.length ){
       finalData = [...processedData.map((row, index)=> ({
          id: index,...row,
        })),
      ];
      this.setState({rows: finalData});
    }
    console.log("loadAllIngredients()");
    console.log(finalData);
  }


  render() {
    const {
      classes,
    } = this.props;
    const {
      rows,
      columns,
      tableColumnExtensions,
      sorting,
      editingRowIds,
      addedRows,
      rowChanges,
      currentPage,
      deletingRows,
      pageSize,
      pageSizes,
      columnOrder,
      currentTab
    } = this.state;

    return (
      <div>
      <Paper>
        <Grid
          allowColumnResizing = {true}
          rows={rows}
          columns={columns}
          getRowId={getRowId}
        >
        <FilteringState/>
          <IntegratedFiltering />
          <SortingState
            sorting={sorting}
            onSortingChange={this.changeSorting}
          />
          <PagingState
            currentPage={currentPage}
            onCurrentPageChange={this.changeCurrentPage}
            pageSize={pageSize}
            onPageSizeChange={this.changePageSize}
          />

          <IntegratedSorting />
          <IntegratedPaging />

          {isAdmin && <EditingState
            editingRowIds={editingRowIds}
            onEditingRowIdsChange={this.changeEditingRowIds}
            // rowChanges={rowChanges}
            // onRowChangesChange={this.changeRowChanges}
            // addedRows={addedRows}
            // onAddedRowsChange={this.changeAddedRows}
            onCommitChanges={this.commitChanges}
          />}

          <DragDropProvider />


          <Table
            columnExtensions={tableColumnExtensions}
            cellComponent={Cell}
          />

          <TableColumnReordering
            order={columnOrder}
            onOrderChange={this.changeColumnOrder}
          />

          <TableHeaderRow showSortingControls />
          <TableFilterRow cellComponent={FilterCell}/>
          {isAdmin && <TableEditRow
            cellComponent={EditCell}
          /> }
          {isAdmin && <TableEditColumn
            width={120}
            // showAddCommand={!addedRows.length}
            showDeleteCommand
            commandComponent={DeleteButton}
          />}
          <PagingPanel
            pageSizes={pageSizes}
          />
        </Grid>

        {isAdmin && <Dialog
          open={!!deletingRows.length}
          onClose={this.cancelDelete}
          classes={{ paper: classes.dialog }}
        >
          <DialogTitle>Delete Row</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure to delete the following row?
            </DialogContentText>
            <Paper>
              <Grid
                rows={rows.filter(row => deletingRows.indexOf(row.id) > -1)}
                columns={columns}
              >
                <Table
                  columnExtensions={tableColumnExtensions}
                  cellComponent={Cell}
                  order={columnOrder}
                />
                <TableHeaderRow />
              </Grid>
            </Paper>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.cancelDelete} color="primary">Cancel</Button>
            <Button onClick={this.deleteRows} color="secondary">Delete</Button>
          </DialogActions>
        </Dialog>
      }
      </Paper>
    </div>
    );
  }
}

Intermediates.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { name: 'Intermediates' })(Intermediates);
