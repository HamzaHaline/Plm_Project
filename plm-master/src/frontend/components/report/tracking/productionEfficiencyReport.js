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
import { PureComponent, Fragment } from 'react';
import { IconButton, Icon, InputAdornment } from 'material-ui';
import {  DateTimePicker } from 'material-ui-pickers';
import KeyboardArrowLeft from 'material-ui-icons/KeyboardArrowLeft';
import KeyboardArrowRight from 'material-ui-icons/KeyboardArrowRight';
import DateRangeIcon from 'material-ui-icons/DateRange';
import AccessTimeIcon from 'material-ui-icons/AccessTime';
import KeyboardIcon from 'material-ui-icons/Keyboard';
import * as productionLineActions from '../../../interface/productionLineInterface.js';
import Button from 'material-ui/Button';
import PubSub from 'pubsub-js';

// const sessionId = testConfig.sessionId;
var sessionId = "";

const LeftIconButton = () => (
  <IconButton> KeyboardArrowLeft </IconButton>
);


export default class ProductionEfficiencyReport extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      columns: [
        { name: 'productionLineName', title: 'Production Line ' },
        { name: 'lineEfficiency', title: 'Utilization (%)' },
      ],
      rows: [],
      sorting:[],
      currentPage: 0,
      pageSize: 10,
      pageSizes: [10, 50, 100, 500],
      columnOrder: ['name', 'moneySpent', 'moneyProd'],
      startDate:new Date(2018, 0, 1, 0, 0, 0, 0),
      endDate: new Date(2018, 11, 31, 23, 59, 59, 0),
      overallEfficiency:'',
    };

    this.loadAllEfficiencies = this.loadAllEfficiencies.bind(this);
    this.changeSorting = sorting => this.setState({ sorting });
    this.changeCurrentPage = currentPage => this.setState({ currentPage });
    this.changePageSize = pageSize => this.setState({ pageSize });
    this.changeColumnOrder = (order) => {
      this.setState({ columnOrder: order });
    };

   this.handleStartDateChange = (date) => {
     console.log("handleStartDateChange");
     console.log(date);
     console.log(this.state.endDate);
     var endDate = this.state.endDate;

     if(this.state.endDate._d){
       endDate = this.state.endDate._d;
     }

     if(Date.parse(date._d) >  Date.parse(endDate)){
       PubSub.publish('showAlert', "Start date must be earlier than end date.");
     }else{
     this.setState({ startDate:date });
    }
  }

   this.handleEndDateChange = (date) => {
     console.log("handleEndDateChange");
     console.log(date);
     console.log(this.state.startDate);

     var startDate = this.state.startDate;

     if(this.state.startDate._d){
       startDate = this.state.startDate._d;
     }

     if(Date.parse(date._d) < Date.parse(startDate)){
       PubSub.publish('showAlert', "End date must be later than start date.");
     }else{
       this.setState({endDate:date });
     }
   }
  }

  componentDidMount(){
    sessionId = JSON.parse(sessionStorage.getItem('user'))._id;
    // this.loadAllIngredients();
  }

  async loadAllEfficiencies(event){
    console.log("loadAllEfficiencies");
    event.preventDefault();
    var temp = this;
    var startTime = Date.parse(temp.state.startDate);
    var endTime = Date.parse(temp.state.endDate);

    if(temp.state.startDate._d){
      startTime = Date.parse(temp.state.startDate._d);
    }
    if(temp.state.endDate._d){
      endTime = Date.parse(temp.state.endDate._d);
    }

    console.log(startTime);
    console.log(endTime);

    var rawData = [];
     rawData = await productionLineActions.getEfficiencies(startTime,endTime,sessionId);
     rawData = rawData.data;
     console.log(rawData);

     var processedData = [];
      if(rawData.length > 0){
        processedData = [...rawData.map((row, index)=> ({
            id: index,
            lineEfficiency:(row.efficiency!=null) ? (row.efficiency):0,
            ...row,
          })),
        ];
      }
    console.log(processedData);
    var overallEffSum =0;
    for(var i =0; i < processedData.length;i++){
      var eff = (processedData[i].lineEfficiency!=null) ? Number(processedData[i].lineEfficiency):0;
      overallEffSum+=eff;
    }
    var overallEff =0;
    overallEff = (overallEffSum!=0) ? Math.round((overallEffSum/processedData.length)*100)/100:0;

    temp.setState({rows:processedData});
    temp.setState({overallEfficiency:overallEff});

    }


  render() {
    const {classes,} = this.props;
    const { rows, columns ,sorting,currentPage,
      pageSize,pageSizes,columnOrder,startDate,endDate,overallEfficiency} = this.state;
    return (
      <Paper>
        <Fragment>
        <br/>
        <span style={{marginLeft: 20}}><font size="4">Please specify a date range:</font></span> 
        <br/>
        <br/>
        <div style={{marginLeft: 40}}>
          <span><font size="4">Start Date: </font></span>
            <DateTimePicker
                value={startDate}
                onChange={this.handleStartDateChange}
                leftArrowIcon={<KeyboardArrowLeft/>}
                rightArrowIcon={<KeyboardArrowRight/>}
                dateRangeIcon={<DateRangeIcon/>}
                timeIcon={<AccessTimeIcon/>}
                keyboardIcon={<KeyboardIcon/>}
              />
    
             <span style={{marginLeft: 10}}><font size="4">End Date: </font></span>
            <DateTimePicker
                value={endDate}
                onChange={this.handleEndDateChange}
                leftArrowIcon={<KeyboardArrowLeft/>}
                rightArrowIcon={<KeyboardArrowRight/>}
                dateRangeIcon={<DateRangeIcon/>}
                timeIcon={<AccessTimeIcon/>}
                keyboardIcon={<KeyboardIcon/>}
                style={{width:190}}
              />
            </div>
          <br/>
            <div style={{marginLeft: 40}}>
              <Button
                raised
                onClick={(event) => this.loadAllEfficiencies(event)}
                color="primary">Get Utilization</Button>
          </div>
          <br/>

      {/* </MuiPickersUtilsProvider> */}
      </Fragment>

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
        <span style={{marginLeft: 20}}><font size="4">Overall Production Efficiency (%): {overallEfficiency}</font></span> 
        <br/>
        <br/>
      </Paper>
    );
  }
}
