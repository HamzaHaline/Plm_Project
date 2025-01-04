// recallTable.js

import React from 'react';
import { render } from 'react-dom';
import Paper from 'material-ui/Paper';
import {
  FilteringState,
  IntegratedFiltering,
} from '@devexpress/dx-react-grid'; //for filtering
import {
	SortingState,
	IntegratedSorting
} from '@devexpress/dx-react-grid'; // for sorting
import {
  PagingState,
  IntegratedPaging,
} from '@devexpress/dx-react-grid'; // for paging
import {
	DataTypeProvider, //for ???
	EditingState,// for editing
} from '@devexpress/dx-react-grid'; 
import {
  Grid,
  Table,
  TableHeaderRow,
  TableFilterRow, // for filtering
  TableEditRow, //for editing
  TableEditColumn, //for editing
  PagingPanel, // for paging
} from '@devexpress/dx-react-grid-material-ui';
// for selecting previlege level
import Chip from 'material-ui/Chip';
import Input from 'material-ui/Input';
import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';
//
import { TableCell } from 'material-ui/Table'; //for customize filter row
import { withStyles } from 'material-ui/styles';
//local components
// import * as userInterface from '../../../interface/userInterface';
// import * as utils from '../../../utils/utils';

// var sessionId = '';


// var id = 0;

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


const getRowId = row => row.productName;

export default class SampleTable extends React.PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			columns: [
      			{ 
      				name: 'productName', 
      				title: 'Product Name',
      				getCellValue: row => (row.productName ? row.productName : undefined), 
      			},
      			{ 
      				name: 'lotNumberProduct',
      				title: 'Lot Number',
      				getCellValue: row => (row.lotNumberProduct ? row.lotNumberProduct : undefined),
      			},
      			{ 
      				name: 'timeProduced', 
      				title: 'Time Produced',
      				getCellValue: row => (row.date ? row.date.toString().replace('T', ' ').replace('Z', ' ') : undefined),
      				dataType: 'string,' 
      			},
      		],
          rows: props.recallData,
        //   //for filtering
        //   dukeUserColumns: ['dukeUser'],
      		// privilegeColumns: ['privilege'],
        //   usernameColumns: ['username'],
          //for sorting
      		sorting: [{ columnName: 'productName', direction: 'asc' }],
          //for paging
          currentPage: 0,
          pageSize: 5,
          pageSizes: [5, 10, 15],
      	}
        //for sorting
      	this.changeSorting = sorting => this.setState( {sorting} );// for sorting
        //for paging
        this.changeCurrentPage = currentPage => this.setState({ currentPage });
        this.changePageSize = pageSize => this.setState({ pageSize });
        //for refreshing table
        // this.refreshTable = props.refreshTable;
  }

  componentWillMount(){
    // sessionId = JSON.parse(sessionStorage.getItem('user'))._id;
    // console.log("sessionId set to " + sessionId);
  }

  componentWillReceiveProps(nextProps) {
  		console.log(nextProps.recallData);
  		this.setState({ rows: nextProps.recallData });  
	}

	render() {
		const { columns, sorting, editingColumnExtensions, 
      privilegeColumns, dukeUserColumns, usernameColumns,
      pageSize, pageSizes, currentPage, rows} = this.state;
		return(
			<Paper>
			<Grid
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
				<IntegratedSorting />
        <PagingState
          currentPage={currentPage}
          onCurrentPageChange={this.changeCurrentPage}
          pageSize={pageSize}
          onPageSizeChange={this.changePageSize}
        />
        <IntegratedPaging />
				<Table />
				<TableHeaderRow showSortingControls />
        <PagingPanel
            pageSizes={pageSizes}
        />
		<TableFilterRow /> 

		</Grid>
		</Paper>
		);
	}
}
