import React from 'react';
import Paper from 'material-ui/Paper';
import PropTypes from 'prop-types';
import { DatePicker, DatePickerInput } from 'rc-datepicker';
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
  TableEditRow,
  TableFilterRow,
  TableHeaderRow,
  TableColumnReordering,
  PagingPanel,
} from '@devexpress/dx-react-grid-material-ui';

// import {EditButton,CommitButton,CancelButton} from '../vendors/Buttons.js';
import Button from 'material-ui/Button';
import * as productActions from '../../interface/productInterface';

import * as testConfig from '../../../resources/testConfig.js';
import productData from './testData';
import { CircularProgress } from 'material-ui/Progress';
import { LinearProgress } from 'material-ui/Progress';

import { PureComponent, Fragment } from 'react';
import { IconButton, Icon, InputAdornment } from 'material-ui';
import {  DateTimePicker } from 'material-ui-pickers';
import KeyboardArrowLeft from 'material-ui-icons/KeyboardArrowLeft';
import KeyboardArrowRight from 'material-ui-icons/KeyboardArrowRight';
import DateRangeIcon from 'material-ui-icons/DateRange';
import AccessTimeIcon from 'material-ui-icons/AccessTime';
import KeyboardIcon from 'material-ui-icons/Keyboard';
import PubSub from 'pubsub-js';

import Input from 'material-ui/Input';
import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';

import { TableCell } from 'material-ui/Table'; //for customize filter row
import { withStyles } from 'material-ui/styles';

var pickerStyle = {
  color: 'white',
  width: '160px'
};

var sessionId = "";
const READ_FROM_DATABASE = testConfig.READ_FROM_DATABASE;

var isAdmin =  "";
// JSON.parse(sessionStorage.getItem('user')).isAdmin;
const styles = theme => ({
  cell: {
    width: '100%',
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
  },
  input: {
    width: '100%',
  },
});

const StatusFilterCellBase = ({ filter, onFilter, classes }) => (
  <TableCell className={classes.cell} >
    <Select
      input={<Input />}
      value={filter ?  (filter.value!='' ? filter.value : 'No Filter') : 'No Filter'}
      onChange={e => onFilter(e.target.value ? { value: e.target.value} : null)/*onValueChange(event.target.value.toLowerCase())*/}
      style={{ width: '100%', marginTop: '4px' }}
    >
      <MenuItem value={''}>No Filter</MenuItem>
      <MenuItem value={'Pending'}>Pending</MenuItem>
      <MenuItem value={'Completed'}>Completed</MenuItem>
    </Select>
  </TableCell>
);

const StatusFilterCell = withStyles(styles, { name: 'StatusFilterCell' })(StatusFilterCellBase);

const FilterCell = (props) => {
  // console.log("props.column.name: " + props.column.name);
  if (props.column.name === 'status') {
    return <StatusFilterCell {...props} />;
  }
  return <TableFilterRow.Cell {...props} />;
};

const Cell = (props)=>{
  if(props.column.name=='name'){
    return <Table.Cell {...props}>
    <Link to={{pathname: '/product-details', state:{details: props.row} }}>{props.row.name}</Link>
    </Table.Cell>
  }else{
  return <Table.Cell {...props}/>
}
};

Cell.propTypes = {
  column: PropTypes.shape({ name: PropTypes.string }).isRequired,
};

const datePredicate = (value, filter) => {
    console.log(value);
    value > this.state.startDate
}

const getRowId = row => row.id;

class Product extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      columns: [
        { name: 'name', title: 'Name' },
        { name: 'numUnit', title: 'Number of Units' },
        { name: 'date', title: 'Timestamp' },
        { name: 'lotNumberUnique', title: 'Lot Number' },
        { name: 'productionLine', title: 'Production Line' },
        { name: 'status', title: 'Status' },
      ],
      rows:[],
      sorting: [{ columnName: 'date', direction: 'desc' }],
      integratedFilteringColumnExtensions: [
        { columnName: 'date', predicate: datePredicate },
      ],
      unchangedRows: [],
      dates: [],
      startDate: new Date(2018, 0, 1, 0, 0, 0, 0),
      endDate: new Date(2018, 11, 31, 23, 59, 59, 0),
      currentPage: 0,
      pageSize: 10,
      pageSizes: [100, 250, 500],
      loading: true,
    };
    this.changeSorting = sorting => this.setState({ sorting });
    this.changeCurrentPage = currentPage => this.setState({ currentPage });
    this.changePageSize = pageSize => this.setState({ pageSize });

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
    var temp = this;
    //setTimeout(function(){ temp.loadProductInfo(); temp.setState({loading: false})}, 1000);
    temp.loadProductInfo();
  }

  async loadProductInfo(){
    console.log("loadProductInfo");

      var rawData = [];
      sessionId = JSON.parse(sessionStorage.getItem('user'))._id;
      rawData = await productActions.getAllProductsAsync(sessionId);

      console.log(rawData);
      
      var tempDates = [];
      for (var i = 0; i<rawData.length; i++) {
        //TODO: Change this with real Date - remove new Date later
          var date = new Date(rawData[i].date).toISOString();
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
            status : (row.isIdle == false) ? 'Pending' : 'Completed',
          })),
        ];
      }
      this.setState({dates:tempDates});
      this.setState({rows:processedData});
      this.setState({unchangedRows:processedData});
  }

  render() {
    // const {classes} = this.props;
    const { rows,columns ,editingRowIds,rowChanges,integratedFilteringColumnExtensions,
       dates, startDate, endDate, filters, unchangedRows,
      pageSize, pageSizes, currentPage, sorting} = this.state;

    return (
      <div>
      <p><b><font size="6" color="3F51B5">Production List</font></b></p> 
      <Paper style={{ position: 'relative' }}>
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

          <Table cellComponent={Cell}>

          </Table>
          <TableHeaderRow showSortingControls/>

          <TableFilterRow cellComponent={FilterCell}/> 

          <PagingPanel
            pageSizes={pageSizes}
          />
        </Grid>
      </Paper>
      </div>
    );
  }
}


export default Product;
