import React from 'react';
import Paper from 'material-ui/Paper';
import {
  Grid,
  Table,
  TableHeaderRow,PagingPanel,DragDropProvider,TableColumnReordering,
} from '@devexpress/dx-react-grid-material-ui';
import {
  SortingState, PagingState,
  IntegratedPaging, IntegratedSorting,
} from '@devexpress/dx-react-grid';
import Styles from  'react-select/dist/react-select.css';
import { withStyles } from 'material-ui/styles';
import dummyData from '../../orders/dummyData';
import * as ingredientActions from '../../../interface/ingredientInterface';
import * as testConfig from '../../../../resources/testConfig.js';

// const sessionId = testConfig.sessionId;
var sessionId = "";
const READ_FROM_DATABASE = testConfig.READ_FROM_DATABASE;


export default class FinancialReport extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      columns: [
        { name: 'name', title: 'Ingredient Name' },
        { name: 'moneySpent', title: 'Total Expenditure ($) ' },
        { name: 'moneyProd', title: 'Production Expenditure ($)' },
      ],
      rows: [],
      sorting:[],
      currentPage: 0,
      pageSize: 10,
      pageSizes: [10, 50, 100, 500],
      columnOrder: ['name', 'moneySpent', 'moneyProd'],
      selectedDateTime: new Date(),
      totalExpense: 0,
      totalProductionExpense: 0,
    };
    this.changeSorting = sorting => this.setState({ sorting });
    this.changeCurrentPage = currentPage => this.setState({ currentPage });
    this.changePageSize = pageSize => this.setState({ pageSize });
    this.changeColumnOrder = (order) => {
      this.setState({ columnOrder: order });
    };
    this.handleDateTimeChange = dateTime => {
      this.setState({ selectedDateTime: dateTime });
    }
  }

  componentDidMount(){
    this.loadAllIngredients();
  }



  async loadAllIngredients(){
      var rawData = [];

    // try{
       if(READ_FROM_DATABASE){
         sessionId = JSON.parse(sessionStorage.getItem('user'))._id;
         rawData = await ingredientActions.getAllIngredientsOnlyAsync(sessionId);
         rawData = rawData.data;
       }else{
         rawData = dummyData;
       }
     // }catch(e){
       // console.log("Error passed to front end");
       // alert(e);
     // }
     // adds integer values as row id

     var processedData = [];
      if(rawData){
        processedData = [...rawData.map((row, index)=> ({
            id: index,
            ...row,
            moneySpent: Math.round(row.moneySpent*100)/100,
            moneyProd: Math.round(row.moneyProd*100)/100,
          })),
        ];
      }

      var tempExpense = 0;
      var tempProductionExpense = 0;

      for(var i=0; i<processedData.length; i++){
        tempExpense+=processedData[i].moneySpent;
        tempProductionExpense+=processedData[i].moneyProd;
      }
      this.setState({totalExpense:tempExpense});
      this.setState({totalProductionExpense:tempProductionExpense});
     this.setState({rows:processedData});
   }


  render() {
    const {classes,} = this.props;
    const { rows, columns ,sorting,currentPage,
      pageSize,pageSizes,columnOrder} = this.state;
    return (
      <Paper>
      
        <Grid
          allowColumnResizing = {true}
          rows={rows}
          columns={columns}
        >
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
          <DragDropProvider />

          <Table />

          <TableColumnReordering
            order={columnOrder}
            onOrderChange={this.changeColumnOrder}
          />

          <TableHeaderRow showSortingControls />
          <PagingPanel
            pageSizes={pageSizes}
          />
        </Grid>
        <p><font style={{marginLeft: 20}} size="4">Overall Ingredient Expenditure: {this.state.totalExpense}</font></p>
        <p><font style={{marginLeft: 20}} size="4">Overall Production Expenditure: {this.state.totalProductionExpense}</font></p>
        <br/>
      </Paper>
    );
  }
}
