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

import * as ingredientActions from '../../interface/ingredientInterface';
import * as formulaActions from '../../interface/formulaInterface';
import * as testConfig from '../../../resources/testConfig.js';
import * as uploadInterface from '../../interface/uploadInterface';
import formulaData from './dummyData';
import PubSub from 'pubsub-js';
import SnackBarDisplay from '../snackBar/snackBarDisplay';
import { ToastContainer, toast } from 'react-toastify';
//TODO: Set the user ID
var sessionId = "";
var isAdmin = "";
var isManager = "";
var userId;

var formulaSentToProduction={};

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

const AddButton = ({ onExecute }) => (
  <div style={{ textAlign: 'center', margin: '20px 0' }}>
    <Button
      style={{
        backgroundColor: '#DAA520', // Gold background
        color: '#fff', // White text color
        padding: '10px 20px', // Adjust padding for better appearance
        fontSize: '16px', // Slightly larger font
        fontWeight: 'bold',
        borderRadius: '8px', // Rounded corners
        textTransform: 'uppercase', // Uppercase text
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)', // Add shadow
        transition: 'all 0.3s ease', // Smooth hover effect
      }}
      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#F7E7CE')} // Light gold on hover
      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#DAA520')} // Reset to original color
      title="Create New Formula"
      component={Link}
      to={{ pathname: '/formula-details', state: { isCreateNew: true } }}
    >
      New
    </Button>
  </div>
);
AddButton.propTypes = {
  onExecute: PropTypes.func.isRequired,
};

const DeleteButton = ({ onExecute }) => (
  <IconButton onClick={onExecute} title="Delete row">
    <DeleteIcon />
  </IconButton>
);
DeleteButton.propTypes = {
  onExecute: PropTypes.func.isRequired,
};

const commandComponents = {
  add: AddButton,
  delete: DeleteButton,

};

const Command = ({ id, onExecute }) => {
  const CommandButton = commandComponents[id];
  console.log("this is a command");
  console.log(commandComponents[id]);
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

const AddToProdButton = ({selectedFormula, onExecute}) => (
  // formulaSentToProduction = selectedFormula,
  // alert(formulaSentToProduction),
    <Button
      style={{width:50}}
      color="primary"
      title="Send formula to production"
      component={Link} to={{pathname: '/production-review', state:{selectedFormula: selectedFormula} }}
    > <AddShoppingCartIcon title="Send formula to production"/>
    </Button>
);
AddToProdButton.propTypes = {
  onExecute: PropTypes.func,
};

const FilterCell = (props) => {
  console.log("I am filter cell");
  console.log(props);
  if(props.column.name){
    return <TableFilterRow.Cell {...props} />
  }else{
    return <Table.Cell {...props}/>
  }
}
FilterCell.propTypes = {
  column: PropTypes.shape({ name: PropTypes.string }).isRequired,
};

const Cell = (props) => {
//  console.log(" CELL props value: ");
//  console.log(props);
  if(props.column.name=='name'){
    return <Table.Cell {...props}>
    <Link to={{pathname: '/formula-details', state:{details: props.row} }}>{props.row.name}</Link>
    </Table.Cell>
  }else if (props.column.key=='sendToProd' && (isAdmin||isManager)){
    // <Link to={{pathname: '/product-review', state:{selectedFormula: props.row} }}}
    console.log('send to prod');
    return <Table.Cell {...props}>
            <AddToProdButton selectedFormula = {props.row}/>
            </Table.Cell>
  }
  else return <Table.Cell {...props} />;
};

Cell.propTypes = {
  column: PropTypes.shape({ name: PropTypes.string }).isRequired,
};

const getRowId = row => row.id;


class Formula extends React.PureComponent {
  constructor(props) {
    super(props);
    isAdmin = JSON.parse(sessionStorage.getItem('user')).isAdmin;
    isManager = JSON.parse(sessionStorage.getItem('user')).isManager;
    this.state = {
      idToNameMap:{},
      columns: (isAdmin||isManager)?[
        { name: 'name', title: 'Name' },
        { name: 'description', title: 'Description' },
        { name: 'unitsProvided', title: 'Product Units ' },
        { name: 'ingredients', title: 'Ingredient / Quantity' },
        { name: 'productType', title: 'Product Type ' },
        {key: 'sendToProd', title:''},
      ]:[
        { name: 'name', title: 'Name' },
        { name: 'description', title: 'Description' },
        { name: 'unitsProvided', title: 'Product Units ' },
        { name: 'ingredients', title: 'Ingredient / Quantity' },
        { name: 'productType', title: 'Product Type ' }, // isIntermediate
      ],
      rows:[],
      sorting: [],
      editingRowIds: [],
      // addedRows: [],
      rowChanges: {},
      currentPage: 5,
      deletingRows: [],
      pageSize: 10,
      pageSizes: [10, 50, 100, 500],
      columnOrder: ['name', 'description', 'unitsProvided', 'ingredients', 'productType','sendToProd' ],
      options:[],
      productionFormula:{},
      snackBarOpen:false,
      snackBarMessage:'',
    };
    this.changeSorting = sorting => this.setState({ sorting });
    this.changeEditingRowIds = editingRowIds => this.setState({ editingRowIds });
    this.changeRowChanges = (rowChanges) => this.setState({ rowChanges });
    this.changeCurrentPage = currentPage => this.setState({ currentPage });
    this.changePageSize = pageSize => this.setState({ pageSize });
    this.handleSnackBarClose = this.handleSnackBarClose.bind(this);

    this.commitChanges = ({ deleted }) => {
      let { rows } = this.state;
      console.log("delete formula");
      console.log(deleted);
      console.log(this.state.deletingRows);
      this.setState({ rows, deletingRows: deleted || this.state.deletingRows });
      console.log(this.state.deletingRows);
     // if (deleted) {
     //  const deletedSet = new Set(deleted);
     //  rows = rows.filter(row => !deletedSet.has(row.id));
     // }
     // this.setState({ rows });

    };

    this.cancelDelete = () => this.setState({ deletingRows: [] });

    this.deleteRows = () => {
      console.log("delete formula rows");
      console.log(this.state.deletingRows);
      const rows = this.state.rows.slice();

      this.state.deletingRows.forEach((rowId) => {
        const index = rows.findIndex(row => row.id === rowId);
        if (index > -1) {
          // This line removes the data from the rows
          //TODO: Delete in the back end

          var formulaId = rows[index]._id;

          // TODO: Delete does not work
         formulaActions.deleteFormula(formulaId, sessionId, function(res){

         });
          console.log("delete " );
          console.log(rows[index]._id);
          console.log(sessionId);
          rows.splice(index, 1);
          // TODO: Add snackbar
          // alert(" Ingredient successfully deleted ! ");
          // this.setState({snackBarMessage : "Formula successfully deleted."});
          // this.setState({snackBarOpen:true});
          toast.success('Formula successfully deleted.', {
            position: toast.POSITION.TOP_RIGHT
          });
          //PubSub.publish('showMessage', 'Formula successfully deleted.' );
        }
      });
      this.setState({ rows, deletingRows: [] });
    };
    this.uploadFile = this.uploadFile.bind(this);
  }

  componentWillMount(){
    isAdmin = JSON.parse(sessionStorage.getItem('user')).isAdmin;
    isManager = JSON.parse(sessionStorage.getItem('user')).isManager;
    this.loadAllFormulas();
  }

  handleSnackBarClose(){
    this.setState({snackBarOpen:false});
    this.setState({snackBarMessage: ''});
  }

  componentDidMount(){
    //this.createMap();
  }

  async loadAllFormulas(){
    sessionId = JSON.parse(sessionStorage.getItem('user'))._id;
    userId = JSON.parse(sessionStorage.getItem('user'))._id;

    //TODO: Get from backend
    var data = await formulaActions.getAllFormulasAsync(sessionId);
    var rawData = (data) ? data : []

    for(var i =0; i < rawData.length;i++){
        var ingredientsArray  = rawData[i].ingredients;
        var ingredientsString = '';

        for(var j = 0; j < ingredientsArray.length;j++){
          ingredientsString+=ingredientsArray[j].ingredientName + " / " +
                          ingredientsArray[j].quantity +' '+ingredientsArray[j].nativeUnit;

          if(j!= ingredientsArray.length -1){
            ingredientsString+=', ';
          }
        }
        // NEEDS TO BE BEFORE
        rawData[i].ingredientsArray = rawData[i].ingredients;
        rawData[i].ingredients = ingredientsString;
        rawData[i].formulaId = rawData[i]._id;
        rawData[i].productionLinesArray = rawData[i].productionLines;
      }
      var processedData = [];
      if(rawData){
        processedData = [...rawData.map((row, index)=> ({
          id:index,
          // select based on whether it is Intermediate or Final
          productType: (row.isIntermediate) ? "Intermediate" :"Final",...row,
          })),
        ];
      }

      console.log(" PROCESSED DATA ")
       console.log(processedData);
      this.setState({rows: processedData});
      }


    async uploadFile(event) {
      console.log(" UPLOAD FILE ");
        let file = event.target.files[0];

        console.log(file);

        if (file) {
          let form = new FormData();
          form.append('file', file);
          console.log(form);
           await uploadInterface.uploadFormula(form, sessionId, function(res){
                if (res.status == 400) {
                    if (!alert(res.data))
                        window.location.reload();
                } else if (res.status == 500) {
                    if (!alert('Duplicate Key on Formula (different package not allowed)'))
                        window.location.reload();
                } else if (res.status == 200) {
                    console.log(res);
                    if(!alert(res.data)){
                        //PubSub.publish('showMessage', 'File successfully uploaded.' );
                        toast.success('File successfully uploaded', {
                          position: toast.POSITION.TOP_RIGHT
                        });
                        window.location.reload();
                      }
                }
           });
         }
    }

    async uploadFileInter(event) {
      console.log(" UPLOAD FILE INTER");
        let file = event.target.files[0];

        console.log(file);

        if (file) {
          let form = new FormData();
          form.append('file', file);
          console.log(form);
          
           await uploadInterface.uploadIntermediate(form, sessionId, function(res){
                if (res.status == 400) {
                    if (!alert(res.data))
                        window.location.reload();
                } else if (res.status == 500) {
                    if (!alert('Duplicate Key on Formula (different package not allowed)'))
                        window.location.reload();
                } else if (res.status == 200) {
                    console.log(res);
                    if(!alert(res.data))
                        window.location.reload();
                }
           });
         }
    }

  render() {
    const {classes,} = this.props;
    const {
      rows,
      columns,
      // tableColumnExtensions,
      sorting,
      editingRowIds,
      // addedRows,
      rowChanges,
      currentPage,
      deletingRows,
      pageSize,
      pageSizes,
      columnOrder,
      productionFormula
    } = this.state;
    return(
      <div>
       <p style={{
        
        fontSize: "28px",    // Larger font size
        fontWeight: "normal",  // Bold font weight
        color: "#DAA520",    // Gold color
        margin: "20px 0",    // Top and bottom spacing
        textTransform: "uppercase", // Make it uppercase
        textShadow: "1px 1px 2px rgba(0, 0, 0, 0.3)", // Add subtle shadow
      }}>
        Formulas
      </p>

      <Paper>
        <Grid
          allowColumnResizing = {true}
          rows={rows}
          columns={columns}
          getRowId={getRowId}>

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
          />}
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
          <TableHeaderRow showSortingControls />
          <TableFilterRow cellComponent={FilterCell}/>
          {isAdmin && <TableEditRow
            cellComponent={Cell}
          /> }


          {isAdmin && <TableEditColumn
            width={120}
            showAddCommand
            showDeleteCommand
            commandComponent={Command}
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
          <DialogTitle>Delete Formula</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure to delete the following formula?
            </DialogContentText>
            <Paper>
              <Grid
                rows={rows.filter(row => deletingRows.indexOf(row.id) > -1)}
                columns={columns}
              >
                <Table
                  // columnExtensions={tableColumnExtensions}
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
    {/* <Paper styles = {{color : "#42f4d9"}} > */}
      {isAdmin && <p><font size="5">Final Formula Import</font></p>}
      {isAdmin && <input type="file"
        name="myFile"
        onChange={this.uploadFile} /> }
      {isAdmin && <p><font size="5">Intermediate Product Formula Import</font></p>}
      {isAdmin && <input type="file"
        name="myFile"
        onChange={this.uploadFileInter} /> }
      {isAdmin &&
      <div>
        <br></br>
        Click <a href="./BulkImportEV3Proposalv2.pdf" style={{color:"#000000",}}>HERE</a> for format specification
      </div>
    }
  </div>
);
  }

};

// Formula.propTypes = {
//   classes: PropTypes.object.isRequired,
// };

export default withStyles(styles, { name: 'Formula' })(Formula);
