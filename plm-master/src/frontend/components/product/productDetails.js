import React from 'react';
import Paper from 'material-ui/Paper';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import Divider from 'material-ui/Divider';
import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import {
  GroupingState,
  IntegratedGrouping,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  Table,
  TableHeaderRow, TableGroupRow,PagingPanel,TableEditRow,
} from '@devexpress/dx-react-grid-material-ui';
import RaisedButton from 'material-ui/Button';

const styles = {
    buttons: {
      marginTop: 30,
      float: 'center'
    },
  };

var userId;
var sessionId;
var isAdmin;

const ingredientNameGroupCriteria = value => ({ key: value.substr(0, 1) });

class ProductDetails extends React.Component {
  constructor(props) {
    super(props);
    // var dummyObject = new Object();
    this.state = {
        productRows:(props.location.state) ? [props.location.state.details] : [],
        open : true,
        columns:[
          { name: 'ingredientName', title: 'Ingredient Name ' },
          { name: 'vendorName', title: 'Vendor ' },
          { name: 'lotNumber', title: 'Lot Number ' },
        ],
        rows:[],
        productName:'',
        time:'',
        // integratedGroupingColumnExtensions: [
        //   { columnName: 'ingredientName', criteria: ingredientNameGroupCriteria },
        // ],
        // tableGroupColumnExtension: [
        //   { columnName: 'ingredientName', showWhenGrouped: true },
        // ],
        grouping: [{ columnName: 'ingredientName' }],
    };

    this.changeGrouping = grouping => this.setState({ grouping });

}

  componentWillMount(){
    // console.log(" Formula Rows " + JSON.stringify(this.state.formulaRows));
    isAdmin = JSON.parse(sessionStorage.getItem('user')).isAdmin;
    var rawData = this.state.productRows[0].ingredients;

    var processedData = [];
      if(rawData){
        processedData = [...rawData.map((row, index)=> ({
            id:index,...row,
          })),
        ];
      }

    this.setState({rows: processedData});
    this.setState({productName:this.state.productRows[0].name});
    this.setState({time:this.state.productRows[0].date});
  }

  render() {
    const {productRows,rows,columns, grouping} = this.state;
    return (
      <div>
      <p><b><font size="6" color="3F51B5">Product Details</font></b></p> 
      <p><font size="4">Name: {this.state.productName} </font></p>
      <p><font size="4">Time Made: {this.state.time}</font></p>
      <Paper>
        <Grid
          rows={this.state.rows}
          columns={this.state.columns}
        >
          <GroupingState
            grouping={grouping}
          />
          <IntegratedGrouping/>
          <Table/>
          <TableHeaderRow />
          <TableGroupRow/>
        </Grid>

    <Divider />
      </Paper>
      <Button color="default"
        component={Link} to='/product'
        style = {{marginTop: 10}}
        raised
        > BACK </Button>
   </div>

    );
  }
}
export default ProductDetails;
