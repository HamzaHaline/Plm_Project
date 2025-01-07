import React from 'react';
import PropTypes from 'prop-types';
import {
  FilteringState,
  IntegratedFiltering,
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
import { withStyles } from 'material-ui/styles';
import Styles from  'react-select/dist/react-select.css';
import PubSub from 'pubsub-js';
import dummyData from './dummyData.js';
import * as vendorActions from '../../interface/vendorInterface.js';
import * as buttons from './Buttons.js';

import * as testConfig from '../../../resources/testConfig.js';
import cookie from 'react-cookies';
import { ToastContainer, toast } from 'react-toastify';
import {Link} from 'react-router-dom';
// TODO: get session Id from the user
//var sessionId = (sessionStorage.getItem('user') == null) ? null: JSON.parse(sessionStorage.getItem('user'))._id;
var sessionId = '';
const READ_FROM_DATABASE = testConfig.READ_FROM_DATABASE;
var isAdmin = '';

const styles = theme => ({
  dialog: {
    width: 'calc(100% - 16px)',
  },
  inputRoot: {
    width: '100%',
  },
});
const FilterCell = (props) => {
  return <TableFilterRow.Cell {...props} />
}
FilterCell.propTypes = {
  column: PropTypes.shape({ name: PropTypes.string }).isRequired,
};

const AddButton = ({ onExecute }) => (
  <div style={{ textAlign: 'center' }}>
  <Button
    color="primary"
    title="Create New Vendor"
    component={Link}
    to={{ pathname: '/addVendorForm' }}
    style={{
      backgroundColor: '#D4AF37', // Gold color for luxury
      color: 'white', // White text for contrast
      fontWeight: 'bold', // Bold text
      borderRadius: '8px', // Rounded corners
      padding: '10px 20px', // Padding for a larger button
      boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)', // Subtle shadow for depth
      transition: 'all 0.3s ease', // Smooth hover effect
      textTransform: 'uppercase', // Uppercase text
    }}
    onMouseOver={(e) => (e.target.style.backgroundColor = '#B8860B')} // Darker gold on hover
    onMouseOut={(e) => (e.target.style.backgroundColor = '#D4AF37')} // Original gold color
  >
    New
  </Button>
</div>
);
AddButton.propTypes = {
  onExecute: PropTypes.func.isRequired,
};

const commandComponents = {
  add: AddButton,
  edit:    buttons.EditButton,
  delete:  buttons.DeleteButton ,
  commit:  buttons.CommitButton,
  cancel:  buttons.CancelButton ,
};

const Command = ({ id, onExecute }) => {
  const CommandButton = commandComponents[id];
  return (
    <CommandButton
      onExecute={onExecute}
    />
  );
};
Command.propTypes = {
  id: PropTypes.string.isRequired,
  onExecute: PropTypes.func.isRequired,
};

const Cell = (props)=>{
  return <Table.Cell {...props}
    style={{
            whiteSpace: "normal",
            wordWrap: "break-word"
          }}/>
};

Cell.propTypes = {
  column: PropTypes.shape({ name: PropTypes.string }).isRequired,
};

const EditCell = (props) => {
  return <TableEditRow.Cell {...props} style={{backgroundColor:'aliceblue'}}/>;
};

EditCell.propTypes = {
  column: PropTypes.shape({ name: PropTypes.string }).isRequired,
};

const getRowId = row => row.id;

class Vendors extends React.PureComponent
{
  constructor(props){
    super(props);
    this.state = {
      columns: [
        { name: 'name', title: 'Name' },
        { name: 'contact', title: 'Contact' },
        { name: 'code', title: 'Code' },
      ],
      rows:[],
      sorting: [],
      editingRowIds: [],
      rowChanges: {},
      currentPage: 0,
      deletingRows: [],
      pageSize: 10,
      pageSizes: [5,10,0],
      columnOrder: ['name', 'contact', 'code']
    };
    var temp = this;
    this.changeSorting = sorting => this.setState({ sorting });
    this.changeEditingRowIds = editingRowIds => this.setState({ editingRowIds });
    this.changeRowChanges = (rowChanges) => this.setState({ rowChanges });
    this.changeCurrentPage = currentPage => this.setState({ currentPage });
    this.changePageSize = pageSize => this.setState({ pageSize });
    this.commitChanges = ({ changed, deleted }) =>
    {
      console.log("Commit Changes");
      let { rows } = this.state;
      // If any value in the row is changed
      if (changed) {
        console.log("changed " + JSON.stringify(changed));
        // Variables to send data to the back end
        var vendorName ="";
        var vendorContact = "";
        var vendorCode = "";
        var vendorId="";
        let oldRows = JSON.parse(JSON.stringify(rows));
        for(var i =0; i < rows.length; i++)
        {
          // Accessing the changes made to the rows and displaying them
          if(changed[rows[i].id]){
            // Get values so you dont lose it

            if(changed[rows[i].id].name){
              rows[i].name = changed[rows[i].id].name;
              // vendorName = changed[rows[i].id].name;
            }
            if(changed[rows[i].id].contact){
              rows[i].contact = changed[rows[i].id].contact;
              // vendorContact = changed[rows[i].id].contact;
            }
            if(changed[rows[i].id].code){
              rows[i].code = changed[rows[i].id].code;
              // vendorCode = changed[rows[i].id].code;
            }
            // Get the values replaced in the row
            vendorName = rows[i].name;
            vendorContact=rows[i].contact;
            vendorCode= rows[i].code;
            vendorId=rows[i]._id;
          }

        };
        console.log("vendor Id " + vendorId);
        console.log("vendor contact " + vendorContact);
        console.log("vendor code " + vendorCode);
        console.log("vendor name " + vendorName);
        var ingredients = "";
        // TODO: Call updateVendor function to backend
        if(vendorName &&  vendorContact && vendorId && vendorCode){
          vendorActions.updateVendor(vendorName,vendorContact,vendorCode,vendorId,sessionId,function(res){
            if (res.status == 400) {
              if(!alert(res.data)){
                window.location.reload();
              }
            }else if (res.status == 500) {
                  temp.setState({rows:oldRows});
                  console.log("old rows");
                  console.log(temp.state.rows);
                  PubSub.publish('showAlert', 'Vendor name or code already exists.');
            }else{
              toast.success('Vendor successfully edited!' );
            }
          });
        }
      };
      // Delete pop up
      // let deepCopy = JSON.parse(JSON.stringify(rows));
      // this.setState({ oldRows: deepCopy});
      this.setState({ rows, deletingRows: deleted || this.state.deletingRows });
    };

    this.cancelDelete = () => this.setState({ deletingRows: [] });
    this.deleteRows = () => {
      const rows = this.state.rows.slice();
      this.state.deletingRows.forEach((rowId) =>
      {
        const index = rows.findIndex(row => row.id === rowId);
        if (index > -1) {
          // TODO: Update table in Back end

          console.log("Delete " + rows[index].name);
          vendorActions.deleteVendor(rows[index]._id, sessionId, function(res){
                if (res.status == 400) {
                  if(!alert(res.data)){
                    window.location.reload();
                  }
              }else{
                toast.success('Vendor successfully deleted!' );
              }
          });
          // removes data from the table
          rows.splice(index, 1);
        }
      });
      this.setState({ rows, deletingRows: [] });
    };
    this.changeColumnOrder = (order) => {
      this.setState({ columnOrder: order });
    };
  }

  componentWillMount(){
    isAdmin = JSON.parse(sessionStorage.getItem('user')).isAdmin;
    sessionId = JSON.parse(sessionStorage.getItem('user'))._id;
  }

  componentDidMount(){
    console.log(" MOUNT");
    this.loadAllVendors();
  }

  async loadAllVendors(){
    console.log("LOAD ALL DATA ");
    var startingIndex = 0;
    var rawData = [];
    if(READ_FROM_DATABASE){
      //TODO: Initialize data
      sessionId = JSON.parse(sessionStorage.getItem('user'))._id;
      rawData = await vendorActions.getAllVendorsAsync(sessionId);
      //commented out because collectively done after rawData is determined
      /*
      var processedData = [...rawData.map((row, index)=> ({
          id: startingIndex + index,...row,
        })),
      ];*/
    } else {
      rawData = dummyData;
    }
    console.log("rawData " + JSON.stringify(rawData));

    var processedData = [];
    if(rawData){
      processedData = [...rawData.map((row, index)=> ({
          id: startingIndex + index,...row,
        })),
      ];
    }

    console.log("processedData " + JSON.stringify(processedData));
    this.setState({rows:processedData});
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
      rowChanges,
      currentPage,
      deletingRows,
      pageSize,
      pageSizes,
      columnOrder,
    } = this.state;

    return (
      <div>
      <p style={{
        
        fontSize: "28px",    // Larger font size
        fontWeight: "normal",  // Bold font weight
        color: "#DAA520",    // Gold color
        margin: "20px 0",    // Top and bottom spacing
        textTransform: "uppercase", // Make it uppercase
        textShadow: "1px 1px 2px rgba(0, 0, 0, 0.3)", // Add subtle shadow
      }}>
        Vendors
      </p>


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
            rowChanges={rowChanges}
            onRowChangesChange={this.changeRowChanges}
            // addedRows={addedRows}
            // onAddedRowsChange={this.changeAddedRows}
            onCommitChanges={this.commitChanges}
          /> }

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
          {isAdmin &&
          <TableEditColumn
            width={120}
            showAddCommand
            showEditCommand
            showDeleteCommand
            commandComponent={Command}
          /> }
          <PagingPanel
            pageSizes={pageSizes}
          />

        </Grid>

        {isAdmin &&
        <Dialog
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

Vendors.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { name: 'ControlledModeDemo' })(Vendors);
