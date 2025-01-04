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
  IntegratedSorting,
  SortingState,
  EditingState,
} from '@devexpress/dx-react-grid';
import {
  PagingState,
  IntegratedPaging,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  Table,
  TableHeaderRow,
  TableEditRow,
  TableFilterRow,
  TableEditColumn,
  TableColumnReordering,
  PagingPanel,
} from '@devexpress/dx-react-grid-material-ui';

import {EditButton,CommitButton,CancelButton} from '../vendors/Buttons.js';
import Button from 'material-ui/Button';
import * as logActions from '../../interface/logInterface';
import * as ingredientActions from '../../interface/ingredientInterface';

import { PureComponent, Fragment } from 'react';
import { IconButton, Icon, InputAdornment } from 'material-ui';
import {  DateTimePicker } from 'material-ui-pickers';
import KeyboardArrowLeft from 'material-ui-icons/KeyboardArrowLeft';
import KeyboardArrowRight from 'material-ui-icons/KeyboardArrowRight';
import DateRangeIcon from 'material-ui-icons/DateRange';
import AccessTimeIcon from 'material-ui-icons/AccessTime';
import KeyboardIcon from 'material-ui-icons/Keyboard';
import PubSub from 'pubsub-js';

//TODO: get user data
// const sessionId = testConfig.sessionId;
var pickerStyle = {
  color: 'white',
  width: '160px'
};

var sessionId = "";

var isAdmin =  "";
// JSON.parse(sessionStorage.getItem('user')).isAdmin;

const Cell = (props)=>{
  if(props.column.name=="item" && props.row.model == 'ingredients' && props.row.action!='delete'){
    return <Table.Cell {...props}>
    <Link to={{pathname: '/ingredient-details', state:{ingredientId: props.row.itemId, fromLogs: true} }}>{props.row.item}</Link>
    </Table.Cell>
  }else if(props.column.name=="item" && props.row.model == 'formulas' && props.row.action!='delete'){
    return <Table.Cell {...props}>
    <Link to={{pathname: '/formula-details', state:{formulaId: props.row.itemId, fromLogs: true} }}>{props.row.item}</Link>
    </Table.Cell>
  }
  return <Table.Cell {...props}
    style={{
        whiteSpace: "normal",
        wordWrap: "break-word"
      }}/>
};

Cell.propTypes = {
  column: PropTypes.shape({ name: PropTypes.string }).isRequired,
};

//const EditCell = (props) => {
//  if(props.column.name == 'capacity'){
//    return <TableEditRow.Cell {...props} />;
//  };
//  return <Cell {...props} />;
//};
//
//EditCell.propTypes = {
//  column: PropTypes.shape({ name: PropTypes.string }).isRequired,
//};

//const commandComponents = {
//  edit:    EditButton,
//  commit:  CommitButton,
//  cancel:  CancelButton,
//};

//const Command = ({ id, onExecute }) => {
//  const CommandButton = commandComponents[id];
//  return (
//    <CommandButton
//      onExecute={onExecute}
//    />
//  );
//};
//Command.propTypes = {
//  id: PropTypes.string.isRequired,
//  onExecute: PropTypes.func.isRequired,
//};

const datePredicate = (value, filter) => {
    console.log(value);
    value > this.state.startDate
}

const getRowId = row => row.id;

class Log extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      columns: [
        { name: 'username', title: 'Username' },
        { name: 'action', title: 'Action' },
        { name: 'model', title: 'Model' },
        { name: 'item', title: 'Entity' },
        { name: 'date', title: 'Timestamp' },
      ],
      integratedFilteringColumnExtensions: [
        { columnName: 'date', predicate: datePredicate },
      ],
      rows:[],
      sorting: [{ columnName: 'date', direction: 'desc' }],
      unchangedRows: [],
      dates: [],
      startDate: new Date(2018, 0, 1, 0, 0, 0, 0),
      endDate: new Date(2018, 11, 31, 23, 59, 59, 0),
      currentPage: 0,
      pageSize: 10,
      pageSizes: [10, 50, 100, 500],
      //filters: [{ columnName: 'date', value: this.startDate }],
      //editingRowIds: [],
      //rowChanges: {},
    };
    this.changeSorting = sorting => this.setState({ sorting });
    this.changeCurrentPage = currentPage => this.setState({ currentPage });
    this.changePageSize = pageSize => this.setState({ pageSize });
    //this.changeFilters = filters => this.setState({ filters });

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
        this.setState({
          startDate: date
        }, function(){
          console.log(this.state.startDate);
          var newRows = [];
          for (var i = 0; i<this.state.unchangedRows.length; i++) {
                var date2 = this.state.unchangedRows[i].date;
                var year = date2.slice(0, 4);
                var month = date2.slice(5, 7);
                var day = date2.slice(8, 10);
                var hours = date2.slice(11, 13);
                var minutes = date2.slice(14, 16);
                var seconds = date2.slice(17, 19);
                var milliseconds = date2.slice(20, 22);
                var tempDate = new Date(year, month - 1, day, hours, minutes, seconds, milliseconds);
                var tempTime = tempDate.getTime();
                if(tempTime>=date && tempTime<=this.state.endDate){
                  newRows.push(this.state.unchangedRows[i]);
                }
          }
          this.setState({
              rows: newRows
          });
        });
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
        this.setState({
          endDate: date
        }, function(){
          console.log(this.state.startDate);
          var newRows = [];
          for (var i = 0; i<this.state.unchangedRows.length; i++) {
                var date2 = this.state.unchangedRows[i].date;
                var year = date2.slice(0, 4);
                var month = date2.slice(5, 7);
                var day = date2.slice(8, 10);
                var hours = date2.slice(11, 13);
                var minutes = date2.slice(14, 16);
                var seconds = date2.slice(17, 19);
                var milliseconds = date2.slice(20, 22);
                var tempDate = new Date(year, month - 1, day, hours, minutes, seconds, milliseconds);
                var tempTime = tempDate.getTime();
                if(tempTime<=date && tempTime>=this.state.startDate){
                  newRows.push(this.state.unchangedRows[i]);
                }
          }
          this.setState({
              rows: newRows
          });
        });
       }
    }    
  }

  componentWillMount(){
    isAdmin = JSON.parse(sessionStorage.getItem('user')).isAdmin;
  }

  componentDidMount() {
    this.loadLogInfo();
  }

  async loadLogInfo(){
      var rawData = [];
      sessionId = JSON.parse(sessionStorage.getItem('user'))._id;
      rawData = await logActions.getAllLogsAsync(sessionId);
      if(rawData){
        rawData = rawData.reverse();
      }
      
      var tempDates = [];
       for (var i = 0; i<rawData.length; i++) {
           var date = rawData[i].date;

           var year = date.slice(0, 4);
           var month = date.slice(5, 7);
           var day = date.slice(8, 10);
           var hours = date.slice(11, 13);
           var minutes = date.slice(14, 16);
           var seconds = date.slice(17, 19);
           var milliseconds = date.slice(20, 22);
           tempDates[i] = new Date(year, month - 1, day, hours, minutes, seconds, milliseconds);
           rawData[i].date = date.replace('T',' ').replace('Z',' ');
       }
       var processedData = [];
       if(rawData){
        processedData = [...rawData.map((row, index)=> ({
           id:index,...row,
         })),
        ];
       }

       this.setState({dates:tempDates});
       this.setState({rows:processedData});
       this.setState({unchangedRows:processedData});
  }

  render() {
    // const {classes} = this.props;
    const { integratedFilteringColumnExtensions, rows,columns, dates, startDate, endDate, filters, unchangedRows, 
      pageSize, pageSizes, currentPage, sorting} = this.state;

    return (
      <div>
      <p><b><font size="6" color="3F51B5">Logs</font></b></p> 
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

      {/* </MuiPickersUtilsProvider> */}
      </Fragment>
        <Grid
          allowColumnResizing = {true}
          rows={rows}
          columns={columns}
          getRowId={getRowId}
        >
          <FilteringState defaultFilters={[]} />
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
          <Table cellComponent={Cell}/>
          <TableHeaderRow showSortingControls/>
          <TableFilterRow />
          <PagingPanel
            pageSizes={pageSizes}
          />
        </Grid>
      </Paper>
      </div>
    );
  }
}

// Storage.propTypes = {
//   classes: PropTypes.object.isRequired,
// };

export default Log;
