import * as React from 'react';
import Paper from 'material-ui/Paper';
import PropTypes from 'prop-types';
import {
  SelectionState,
  PagingState,
  IntegratedPaging,
  IntegratedSelection,
  EditingState,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  Table,
  TableHeaderRow,
  TableSelection,
  TableEditColumn,PagingPanel,TableEditRow,
} from '@devexpress/dx-react-grid-material-ui';
import Divider from 'material-ui/Divider';


import {DeleteButton,CancelButton,CommitButton} from '../vendors/Buttons.js';
import { Redirect } from 'react-router';
import Button from 'material-ui/Button';
import {Link} from 'react-router-dom';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';

import testData from './testData.js';
import * as distributorNetworkActions from '../../interface/distributorNetworkInterface.js';
import EditIcon from 'material-ui-icons/Edit';
import IconButton from 'material-ui/IconButton';
import { ToastContainer, toast } from 'react-toastify';
import PubSub from 'pubsub-js';

var userId="";
var sessionId="";
var isAdmin="";
var isManager="";

const EditButton = ({onExecute,row}) => (
  <IconButton
    onClick={onExecute} title="Edit row"
    disabled = {!row.isSelected}
    >
    <EditIcon />
  </IconButton>
);

const Cell = (props)=>{
  return <Table.Cell {...props}/>
};

const EditCell = (props) => {
  if(props.column.name == 'quantityToSell' || props.column.name == 'unitPrice'){
    return <TableEditRow.Cell {...props}
            required style={{backgroundColor:'aliceblue'}}
          />;
    }else{
      return <Cell {...props} style={{backgroundColor:'aliceblue'}}  />;
  };
};

const commandComponents = {
  edit: EditButton,
  delete: DeleteButton,
  commit: CommitButton,
  cancel: CancelButton,
};

const Command = ({id,onExecute,row}) => {
const CommandButton = commandComponents[id];;
  return (
    <CommandButton
      onExecute={onExecute}
      row = {row}
    />
  );
};

const EditColumnCell = (props) => {
      console.log("EditColumnCell");
      var onExecute;
      var id;
      var onExecute2;
      var id2;
      if(props.children[0]){
        onExecute = props.children[0].props.onExecute;
        id = props.children[0].props.id;
      }else if (props.children[2]){
        onExecute = props.children[2].props.onExecute;
        id = props.children[2].props.id;
        onExecute2 = props.children[3].props.onExecute;
        id2 = props.children[3].props.id;
      }else if (props.children[3]){
        onExecute2 = props.children[3].props.onExecute;
        id2 = props.children[3].props.id;
      }
      if(props.children[0]){
      return <Cell>
        <Command id = {id} onExecute = {onExecute} row = {props.row}/>
        </Cell>
    }else{
      return(
        <Cell>
        <div>
          <Command id = {id} onExecute = {onExecute} row = {props.row}/>
          <Command id = {id2} onExecute = {onExecute2} row = {props.row}/>
        </div>
      </Cell>
        );
    }
};

export default class Demo extends React.PureComponent {
  constructor(props) {
    isAdmin = JSON.parse(sessionStorage.getItem('user')).isAdmin;
    isManager = JSON.parse(sessionStorage.getItem('user')).isManager;
    super(props);
    this.state = {
      columns: (isAdmin || isManager ) ? [
        { name: 'productName', title: 'Product Name' },
        // { name: 'numUnit', title: 'Total Quantity' },
        { name: 'numUnsold', title: 'Tot. Quantity' },
        { name: 'quantityToSell', title: ' Sale Quantity' },
        { name: 'unitPrice', title: 'Unit Price ($)' },
        { name: 'revenue', title: 'Revenue ($)' },
      ]:[
        { name: 'productName', title: 'Product Name' },
        // { name: 'numUnit', title: 'Total Quantity' },
        { name: 'numUnsold', title: 'Tot. Quantity' },
        { name: 'totalRevenue', title: 'Total Revenue ($)' },
      ],
      fireRedirect:false,
      rows: [],
      selection: [],
      pageSizes: [20, 50, 200, 500],
      currentPage:0,
      pageSize:20,
      selectedRows:[],
      currentRowSelected:{},
      quantity:'',
      unitPrice:'',
      review:false,
      grandTotalRevenue:0,
      editingRowIds: [],
      rowChanges: {},
    };

    this.changeSelection = selection => {
      console.log("selection");
      console.log(selection);
      var temp = this;
      if(selection.length!=0){
        let {rows} = this.state;
        var selectedRows = rows.filter(row => selection.indexOf(row.id) > -1);
        console.log(selectedRows);

        if(selectedRows && selectedRows.length >= temp.state.selectedRows.length){
          console.log("second loop");
          var lastSelectedId= selection[selection.length-1];
          console.log(lastSelectedId);
          var currentRowSelected = rows.filter(row => row.id )

          console.log(lastSelectedId);
          var lastSelectedRow = rows.filter(row => row.id ==lastSelectedId);
          temp.setState({currentRowSelected:lastSelectedRow[0]});
        }
        temp.setState({selectedRows:selectedRows});
        temp.updateGrandTotalRevenue();
      }else{
        console.log(selectedRows);
        temp.setState({selectedRows:[]});
        temp.setState({grandTotalRevenue:0});
      }
      temp.setState({ selection });
    }

    this.changeCurrentPage = currentPage => {
      this.setState({ currentPage });
    };
    this.changePageSize = pageSize => this.setState({ pageSize });


    this.cancelSelection = () => {
      console.log("cancelSelection");
      var temp = this;
      var selectedRows = temp.state.selectedRows;
      var currentRowSelected = temp.state.currentRowSelected;

      // var leftRows = rows.filter(row => row.id != currentRowSelected.id);

      // temp.setState({selectedRows:leftRows});
      temp.setState({currentRowSelected:{}});
      temp.setState({quantity:''});
      temp.setState({unitPrice:''});

      temp.updateGrandTotalRevenue();
    }

    // this.loadDistributorNetworkData = this.loadDistributorNetworkData.bind(this);
    this.updateUnitPrice = this.updateUnitPrice.bind(this);
    this.updateQuantity = this.updateQuantity.bind(this);
    this.checkSelectionValid = this.checkSelectionValid.bind(this);
    this.sellProducts = this.sellProducts.bind(this);
    this.cancelSale = this.cancelSale.bind(this);
    this.quantitySaveValid = this.quantitySaveValid.bind(this);
    this.updateGrandTotalRevenue = this.updateGrandTotalRevenue.bind(this);
    this.checkFirstInputQty = this.checkFirstInputQty.bind(this);

    this.updatePriceQtyTable = () => {
      toast.success('quantity and unit price successfully assigned!', {
        position: toast.POSITION.TOP_RIGHT
      });
      console.log("update price qty in table");
      var temp = this;
      var rowId = temp.state.currentRowSelected.id;
      const rows = temp.state.rows.slice();

      var grandTotalRev = 0;
      for(var i =0; i < rows.length;i++){
        console.log(rows[i].id);
        if(rows[i].id == rowId){
          rows[i].unitPrice = temp.state.unitPrice;
          rows[i].quantityToSell = temp.state.quantity;
          rows[i].revenue = Math.round(temp.state.quantity * temp.state.unitPrice *100)/100;

          grandTotalRev+=rows[i].revenue;

          rows[i].isSelected = true;

          console.log("inside");
          console.log(rows[i].unitPrice);
          console.log(rows[i].quantityToSell);
        }
      }
      console.log(rows);

      temp.setState({quantity:''});
      temp.setState({unitPrice:''});
      temp.setState({currentRowSelected:{}});
      temp.setState({rows:rows});

      temp.setState({grandTotalRevenue:grandTotalRev});
    }

    this.changeEditingRowIds = this.changeEditingRowIds.bind(this);
    this.changeRowChanges = this.changeRowChanges.bind(this);
    this.commitChanges = this.commitChanges.bind(this);

  }

  changeEditingRowIds(editingRowIds) {
    this.setState({ editingRowIds });
  }
  changeRowChanges(rowChanges) {
    this.setState({ rowChanges });
  }

  commitChanges({changed}) {
    console.log("commit changes");
    var temp = this;
    let { rows } = temp.state;
    if (changed) {
      console.log("changed");
      for(var i = 0; i < rows.length;i++)
      {
          if(changed[rows[i].id]){
            if(changed[rows[i].id].quantityToSell){
              console.log("changed quantity");
              var quantity = changed[rows[i].id].quantityToSell;
              if(temp.updateQuantity(quantity,true)){
                console.log(rows);
                rows[i].quantityToSell = quantity;
                quantity = (quantity > 0) ? Number(quantity) : 0;

                var unitPrice =  (rows[i].unitPrice > 0) ? Number(rows[i].unitPrice) : 0;
                var revenue = (quantity > 0 ) ? (Math.round(quantity * unitPrice*100)/100): 0;
                rows[i].revenue = revenue;
              }
            }

             if (changed[rows[i].id].unitPrice){
               console.log("changed unit price");

               if(temp.updateUnitPrice(changed[rows[i].id].unitPrice,true)){
                 console.log(rows);
                 var unitPrice = changed[rows[i].id].unitPrice;
                 var quantity =  (rows[i].quantityToSell > 0) ? Number(rows[i].quantityToSell) : 0;

                 unitPrice = (unitPrice > 0) ? Number(unitPrice) : 0;
                 var revenue = (unitPrice > 0 ) ? (Math.round(unitPrice * quantity*100)/100): 0;

                 rows[i].unitPrice = unitPrice;
                 rows[i].revenue = revenue;
               }
             }
          }
        }
    }
  }


  checkFirstInputQty(){
    console.log("check if first qty input");
    var selected = this.state.currentRowSelected;
    if(Object.keys(selected).length>0){
      if(selected.quantityToSell>0){
        return false;
      }
    return true;
  }else{
    false;
  }
  }




  updateGrandTotalRevenue(){
    console.log("updateGrandTotalRevenue");
    console.log(this.state);
    var rows = this.state.selectedRows;
    console.log(rows);
    var sum =0;
    if(rows.length){
      for(var i =0; i < rows.length;i++){
        sum+=rows[i].revenue;
      }
      this.setState({grandTotalRevenue:sum});
    }
  }

  componentWillMount(){
    sessionId = JSON.parse(sessionStorage.getItem('user'))._id;
    isAdmin = JSON.parse(sessionStorage.getItem('user')).isAdmin;
    isManager = JSON.parse(sessionStorage.getItem('user')).isManager;
    userId = JSON.parse(sessionStorage.getItem('user'))._id;

    console.log("distributor network will mount");
    console.log(isAdmin);
    console.log(isManager);
    console.log(userId);

    this.loadDistributorNetworkData();
  }

  async loadDistributorNetworkData(){
    var data = await distributorNetworkActions.getAllDistributorNetworksAsync(sessionId);
    console.log("load distribution network data");
    console.log(data);

    var processedData=[];

    for(var i =0; i < data.length;i++){
      var row = data[i];
      var numUnsold = Math.round((row.numUnit-row.numSold)*100)/100;
      if(numUnsold>0){
        var object = new Object();
        object.id = i;
        object.numUnit = row.numUnit;
        object.productName = row.productName;
        object.productNameUnique = row.productNameUnique;
        object.totalCost = row.totalCost;
        object.totalRevenue = row.totalRevenue;
        object.numUnsold = numUnsold;
        object.totalRevenue = Math.round(row.totalRevenue*100)/100;
        object.quantityToSell= '';
        object.unitPrice= '';
        object.revenue= '';
        object.isSelected= false;
        
        processedData.push(object);
      }
    }
    // var processedData = [...data.map((row, index)=> ({
    //     id:index,...row,
    //     numUnsold:Math.round((row.numUnit-row.numSold)*100)/100,
    //     totalRevenue:Math.round(row.totalRevenue*100)/100,
    //     quantityToSell:'',
    //     unitPrice:'',
    //     revenue:'',
    //     isSelected:false,
    //     })),
    //   ];
    this.setState({rows:processedData});
  }

  updateQuantity(value,fromEdit){
    console.log("update quantity");
    var temp = this;
    var re = /^\d*[1-9]\d*$/;
    var unsoldQty = temp.state.currentRowSelected.numUnsold;
    var quantity = value;
    if(quantity > unsoldQty){
      toast.error("Sale quantity cannot be higher than the unsold quantity!", {
      position: toast.POSITION.TOP_RIGHT });
    }else if (quantity == '' || (quantity>0 && re.test(quantity))){
      if(fromEdit){
        return true;
      }else{
        temp.setState({quantity: quantity});
      }
    }else{
      toast.error("Quantity must be a positive integer!", {
      position: toast.POSITION.TOP_RIGHT });
    }
  };

  updateUnitPrice(value,fromEdit){
    console.log("updateUnitPrice");
    var temp = this;
    const re = /[0-9]+(\.([0-9]{4,}|000|00|0))?/
    // const re = /^\d[0-9](\.\d{0,2})?$/;
    // const re =  /^\d{0,10}(\.\d{0,2})?$/;
    if (value == '' || value == 0 || (value > 0 && re.test(value))) {
       if(fromEdit){
         return true;
       }else{
         temp.setState({unitPrice: value});
       }
    }else{
      toast.error("Unit price must be a number greater than or equal to 0!", {
      position: toast.POSITION.TOP_RIGHT });
    }
  }

  quantitySaveValid(){
    console.log("check if save quantity valid");
    var temp = this;
    var quantity = temp.state.quantity;
    var unitPrice = temp.state.unitPrice;

    if(quantity && unitPrice){
      if(quantity == '' || quantity == 0){
        console.log("null value ");
        return false;
      }else{
        return true;
      }
    }
    return false;
  }

  checkSelectionValid(){
    console.log("check selection Valid");
    var temp = this;
    var rows = temp.state.rows;
    console.log("selection valid");
    var selectedRows = rows.filter(row => temp.state.selection.indexOf(row.id) > -1);
    console.log(selectedRows);
    if(selectedRows.length > 0 ){
      for(var i =0; i < selectedRows.length;i++){
        if(Number(selectedRows[i].quantityToSell) <=0){
          return false;
        }
      }
      return true;
    }else{
      return false;
    }
  }

  cancelSale(){
    console.log("cancel sell");
    console.log(this.state.selection);
    console.log(this.state.selectedRows);
    this.setState({review:false});
  }

  async sellProducts(){
    var temp=this;
    console.log("sell products");
    console.log(temp.state.selectedRows);
    var selectedRows = temp.state.selectedRows;
    var products = [];
    console.log(temp.state.selectedRows);
    for(var i =0; i < temp.state.selectedRows.length; i++){
      var productObject = new Object();
      productObject.productName = selectedRows[i].productName;
      productObject.totalRevenue = selectedRows[i].revenue;
      productObject.quantity = selectedRows[i].quantityToSell;
      products.push(productObject);
    }
      // (products, sessionId, callback)
      console.log(products);
      await distributorNetworkActions.sellItemsAsync(products,sessionId,function(res){
        if(res.status){
          //TODO: Fix error
          PubSub.publish('showAlert', res.data );
        }else{

          temp.setState({review:false});
          //TODO: FIX RELOAD
          window.location.reload();
          temp.setState({currentRowSelected:{}});
          temp.setState({selection:[]});
          temp.setState({selectedRows:[]});

          toast.success("Products successfully sold to distributors!", {
          position: toast.POSITION.TOP_RIGHT });

        }
      });

      // temp.setState({review:false});
      // //TODO: FIX RELOAD
      // window.location.reload();
      // temp.setState({currentRowSelected:{}});
      // temp.setState({selection:[]});
      // temp.setState({selectedRows:[]});

  }

  render() {
    const { rows, columns, selection,pageSizes,currentPage ,pageSize,
      fireRedirect,selectedRows,currentRowSelected,
      quantity,unitPrice,grandTotalRevenue,editingRowIds, rowChanges} = this.state;

    return (
      <div>
        {/* <span>Total revenue: {grandTotalRevenue}</span> */}
        <p><b><font size="6" color="3F51B5">Distribution Network</font></b></p> 
        <Paper>
          <Grid
            rows={rows}
            columns={columns}
          >
            <PagingState
              currentPage={currentPage}
              onCurrentPageChange={this.changeCurrentPage}
              pageSize={pageSize}
              onPageSizeChange={this.changePageSize}
            />
            {(isAdmin || isManager ) && <SelectionState
              selection={selection}
              onSelectionChange={this.changeSelection}
            />}
            <Table
            cellComponent={Cell}/>

            {(isAdmin || isManager ) && <EditingState
            editingRowIds={editingRowIds}
            onEditingRowIdsChange={this.changeEditingRowIds}
            rowChanges={rowChanges}
            onRowChangesChange={this.changeRowChanges}
            onCommitChanges={this.commitChanges}
          />}
        {(isAdmin || isManager) && <TableEditRow
            cellComponent={EditCell}/>}

          {(isAdmin || isManager) && <TableEditColumn
            width={120}
            showEditCommand
            cellComponent = {EditColumnCell}
          />}
            <IntegratedPaging />
            {(isAdmin || isManager) && <IntegratedSelection />}

            <TableHeaderRow />
            {(isAdmin || isManager) &&  <TableSelection selectByRowClick />}
            <PagingPanel
              pageSizes={pageSizes}
            />
          </Grid>
          {(isAdmin || isManager) &&  <Dialog
            open={(currentRowSelected) ? this.checkFirstInputQty():false}
            onClose={this.cancelSelection}
            // classes={{ paper: classes.dialog }}
          >
            <DialogTitle>Enter Quantity and Unit Price </DialogTitle>
            <DialogContent>
              {/* <DialogContentText>
                Are you sure to remove this product from the sale?
              </DialogContentText> */}
              <Paper
                style = {{backgroundColor:'aliceblue'}}>
                <Grid
                  rows={[currentRowSelected]}
                  columns={columns}

                >
                  <Table/>
                  <TableHeaderRow />
                </Grid>
              </Paper>
              <Divider/>
              <Paper>
                <TextField
                  required
                  margin="dense"
                  id="quantity"
                  label="Enter Quantity"
                  value = {quantity}
                  fullWidth = {false}
                  onChange={(event) => {event.preventDefault(),this.updateQuantity(event.target.value,false)}}
                  // verticalSpacing= "desnse"
                  style={{
                  marginLeft: 20,
                  martginRight: 20
                  }}/>

                  <TextField
                    required
                    margin="dense"
                    id="unitPrice"
                    label="Enter Unit Price ($)"
                    value = {unitPrice}
                    fullWidth = {false}
                    onChange={(event) => {event.preventDefault(),this.updateUnitPrice(event.target.value,false)}}
                    // verticalSpacing= "desnse"
                    style={{
                    marginLeft: 20,
                    martginRight: 20
                    }}/>
              </Paper>

            </DialogContent>
            <DialogActions>
              <Button onClick={this.cancelSelection} color="secondary">Cancel</Button>
              <Button
                disabled = {!this.quantitySaveValid()}
                onClick={this.updatePriceQtyTable} color="primary">SAVE</Button>
            </DialogActions>
          </Dialog> }

          {(isAdmin || isManager) && <Dialog
            open={this.state.review}
            onClose={this.cancelSale}
            // classes={{ paper: classes.dialog }}
          >
            <DialogTitle>Sell products </DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure to sell the selected products?
              </DialogContentText>
              <Paper>
                <Grid
                  rows={selectedRows}
                  columns={columns}
                >
                  <Table/>
                  <TableHeaderRow />
                </Grid>
              </Paper>
              <Divider/>
              <p><font size="4" style={{marginTop:30}}>Total revenue: $ {Math.round(grandTotalRevenue*100)/100}</font></p>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.cancelSale} color="primary">Cancel</Button>
              <Button onClick={this.sellProducts} color="secondary">Sell</Button>
            </DialogActions>
          </Dialog>}
          {(isAdmin || isManager)&& <Button raised
                color="primary"
                disabled = {!this.checkSelectionValid()}
                style = {{marginLeft: 20, marginBottom: 30}}
                onClick = {(event) => { this.setState({review:true}), this.updateGrandTotalRevenue()}}
                primary="true">Sell</Button>}
        </Paper>
      </div>
    );
  }
}
