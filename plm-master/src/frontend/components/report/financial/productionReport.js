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
import * as formulaActions from '../../../interface/formulaInterface';
import * as testConfig from '../../../../resources/testConfig.js';

// const sessionId = testConfig.sessionId;
var sessionId = "";
const READ_FROM_DATABASE = testConfig.READ_FROM_DATABASE;

export default class ProductionReport extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      columns: [
        { name: 'name', title: 'Formula Name' },
        { name: 'totalProvided', title: 'Total Units Produced' },
        { name: 'totalCost', title: 'Total Cost of Ingredients ($)' },
      ],
      rows: [],
      sorting:[],
      currentPage: 0,
      pageSize: 10,
      pageSizes: [10, 50, 100, 500],
      columnOrder: ['name', 'totalProvided', 'totalCost'],
    };
    this.changeSorting = sorting => this.setState({ sorting });
    this.changeCurrentPage = currentPage => this.setState({ currentPage });
    this.changePageSize = pageSize => this.setState({ pageSize });
    this.changeColumnOrder = (order) => {
      this.setState({ columnOrder: order });
    };

  }

  componentDidMount(){
    this.loadAllFormulas();
  }

  async loadAllFormulas(){
      var rawData = [];

    // try{
       if(READ_FROM_DATABASE){
         sessionId = JSON.parse(sessionStorage.getItem('user'))._id;
         rawData = await formulaActions.getAllFormulasAsync(sessionId);
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
            id: index,...row,
            totalProvided: Math.round(row.totalProvided*1000)/1000,
            totalCost: Math.round(row.totalCost*100)/100,
          })),
        ];
      }
      
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
      </Paper>
    );
  }
}
