// GridExample.js
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
import * as userInterface from '../../../interface/userInterface';
import * as utils from '../../../utils/utils';
import { toast } from 'react-toastify';

var sessionId = '';

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

const getRowId = row => row.id;
//for dukeOAuth
const DukeUserFormatter = ({ value }) =>
  <Chip label={value ? 'Yes' : 'No'} />;
const BooleanEditor = ({ value, onValueChange }) => (
  <Chip label={value ? 'Yes' : 'No'} />
  
);
const DukeUserTypeProvider = props => (
  <DataTypeProvider
    formatterComponent={DukeUserFormatter}
    editorComponent={BooleanEditor}
    {...props}
  />
);

//for previleges
const PrevilegeFormatter = ({ value }) =>
  <Chip label={
  	value === 'admin' ? 'Admin' : 
  		(value === 'manager' ? 'Manager' : 'User') }
  />;

const PrevilegeEditor = ({ value, onValueChange }) => (
  <Select
    input={<Input />}
    value={value ?  value : ''}
    onChange={event => onValueChange(event.target.value.toLowerCase())}
    style={{ width: '100%', marginTop: '4px' }}
  >
    <MenuItem value={'user'}>User</MenuItem>
    <MenuItem value={'manager'}>Manager</MenuItem>
    <MenuItem value={'admin'}>Admin</MenuItem>
  </Select>
);

const PrevilegeTypeProvider = props => (
  <DataTypeProvider
    formatterComponent={PrevilegeFormatter}
    editorComponent={PrevilegeEditor}
    {...props}
  />
);
//username
const UsernameFormatter = ({ value }) =>
  <label>{value}</label>

const UsernameEditor = ({ value, onValueChange }) => (
  <label>{value}</label>
);

const UsernameTypeProvider = props => (
  <DataTypeProvider
    formatterComponent={UsernameFormatter}
    editorComponent={UsernameEditor}
    {...props}
  />
);

const UsernameFilterCellBase = ({ filter, onFilter, classes }) => (
  <TableCell className={classes.cell} >
    <Input
      placeholder="Filter..."
      value={filter ?  (filter.value!='' ? filter.value : '') : ''}
      onChange={e => onFilter(e.target.value ? { value: e.target.value } : null)}
    />
  </TableCell>
);

const PrevilegeFilterCellBase = ({ filter, onFilter, classes }) => (
  <TableCell className={classes.cell} >
    <Select
      input={<Input />}
      value={filter ?  (filter.value!='' ? filter.value : 'No Filter') : 'No Filter'}
      onChange={e => onFilter(e.target.value ? { value: e.target.value.toLowerCase() } : null)/*onValueChange(event.target.value.toLowerCase())*/}
      style={{ width: '100%', marginTop: '4px' }}
    >
      <MenuItem value={''}>No Filter</MenuItem>
      <MenuItem value={'user'}>User</MenuItem>
      <MenuItem value={'manager'}>Manager</MenuItem>
      <MenuItem value={'admin'}>Admin</MenuItem>
    </Select>
  </TableCell>
);

const DukeUserFilterCellBase = ({ filter, onFilter, classes }) => (
  <TableCell className={classes.cell} >
    <Select
      input={<Input />}
      value={filter ?  (filter.value!='' ? filter.value : 'No Filter') : 'No Filter'}
      onChange={e => onFilter(e.target.value ? { value: e.target.value} : null)/*onValueChange(event.target.value.toLowerCase())*/}
      style={{ width: '100%', marginTop: '4px' }}
    >
      <MenuItem value={''}>No Filter</MenuItem>
      <MenuItem value={'true'}>Yes</MenuItem>
      <MenuItem value={'false'}>No</MenuItem>
    </Select>
  </TableCell>
);

const PrevilegeFilterCell = withStyles(styles, { name: 'PrivilegeFilterCell' })(PrevilegeFilterCellBase);
const DukeUserFilterCell = withStyles(styles, { name: 'DukeUserFilterCell' })(DukeUserFilterCellBase);
const UsernameFilterCell = withStyles(styles, { name: 'UsernameFilterCell' })(UsernameFilterCellBase);
const FilterCell = (props) => {
	// console.log("props.column.name: " + props.column.name);
  if (props.column.name === 'privilege') {
    return <PrevilegeFilterCell {...props} />;
  } else if (props.column.name === 'dukeUser') {
    return <DukeUserFilterCell {...props} />;
  } else if (props.column.name === 'username') {
    return <UsernameFilterCell {...props} />;
  }
  return <TableFilterRow.Cell {...props} />;
};

export default class SampleTable extends React.PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			columns: [
      			{ 
      				name: 'username', 
      				title: 'Username',
      				getCellValue: row => (row.username ? row.username : undefined), 
      			},
      			{ 
      				name: 'email', 
      				title: 'E-mail',
      				getCellValue: row => (row.email ? row.email : undefined), 
      			},
      			{ 
      				name: 'privilege', 
      				title: 'Privilege',
      				getCellValue: row => (row.privilege ? row.privilege : undefined),
      				dataType: 'string,' 
      			},
            {
              name: 'dukeUser',
              title: 'Duke User',
              getCellValue: row => (row.fromDukeOAuth ? row.fromDukeOAuth : false),
              dataType: 'boolean',
            },
      		],
          rows: [],
          //for filtering
          dukeUserColumns: ['dukeUser'],
      		privilegeColumns: ['privilege'],
          usernameColumns: ['username'],
          //for sorting
      		sorting: [{ columnName: 'username', direction: 'asc' }],
          //for editing
      		editingColumnExtensions: [
        		{
         			columnName: 'username',
          			createRowChange: (row, value) => ( {...row, username: value} ),
        		},
        		{
          			columnName: 'email',
          			createRowChange: (row, value) => ( {...row, email: value} ),
       			},
        		{
          			columnName: 'privilege',
          			createRowChange: (row, value) => ( {...row, privilege: value} ),
        		},
      		],
          //for paging
          currentPage: 0,
          pageSize: 5,
          pageSizes: [5, 10, 15],
      	}
        //for sorting
      	this.changeSorting = sorting => this.setState( {sorting} );// for sorting
      	//for editing
        this.commitChanges = this.commitChanges.bind(this); // for editing
        //for paging
        this.changeCurrentPage = currentPage => this.setState({ currentPage });
        this.changePageSize = pageSize => this.setState({ pageSize });
        //for refreshing table
        this.refreshTable = props.refreshTable;
  }

	async commitChanges({ added, changed, deleted }) { //function for saving changes in table
    let { rows } = this.props;
    console.log("Entered commitChanges()");
    if (added) {
      //this part should not be executed because we removed NEW from the UI
      console.log("entering added");
      const startingAddedId = (rows.length - 1) > 0 ? rows[rows.length - 1].id + 1 : 0;
      rows = [
        ...rows,
        ...added.map((row, index) => ({
          id: startingAddedId + index,
          ...row,
        })),
      ];
    }
    if (changed) {
    	console.log("entering changed");
      // rows = rows.map(row => (changed[row.id] ? { ...row, ...changed[row.id] } : row));
      console.log("parameter 'changed':");
      console.log(changed);
      console.log('type:' + typeof changed);
      const changedRows = rows.filter(row => changed[row.id]);
      console.log("the following row has changed:");
      console.log(changedRows);
      for (var i = 0; i < changedRows.length; i++){
        const userObject = changedRows[i];
        const userId = userObject.userId;
        const rowId = userObject.id;
        const afterChange = changed[rowId];
        console.log("Row is changed into");
        console.log(afterChange);
        const userDataRetrieved = await userInterface.getUserAsync(userId, sessionId);
        console.log("Retrieved info from database:");
        console.log(userDataRetrieved);
        //parse data
        const newUserName = afterChange.username;
        const newEmail = afterChange.email;
        const oldPassword = userDataRetrieved.password;
        var newIsAdmin = false;
        var newIsManager = false;
        const privilegeLevel = afterChange.privilege.toLowerCase();
        if ( privilegeLevel === 'admin'){
          newIsAdmin = true;
          newIsManager = true;
        } else if (privilegeLevel === 'manager' ){
          newIsManager = true
        }
        const newFromDukeOAuth = afterChange.fromDukeOAuth;
        const oldLoggedIn = userDataRetrieved.loggedIn; 
        await userInterface.updateUser(userId, newUserName, newEmail, oldPassword, newIsAdmin,
          newIsManager, newFromDukeOAuth, oldLoggedIn, sessionId, res => this.refreshTable());
        
      }
    }
    if (deleted) {
    	console.log("entering deleted")
      console.log("parameter 'deleted':")
      console.log(deleted);
      const deletedSet = new Set(deleted);
      const deleteRows = rows.filter(row => deletedSet.has(row.id));
      console.log("This row is supposed to be deleted:");
      console.log(deleteRows);
      for (var i = 0; i < deleteRows.length; i++){
        const userObject = deleteRows[i];
        console.log("Deleting user...")
        console.log(userObject);
        const userId = userObject.userId;
        console.log("userId: " + userId);
        //issue delete
        console.log("sessionId: " + sessionId);
        const userName = userObject.username;
        console.log("username: " + userName);
        await userInterface.deleteUser(userId, sessionId, (res)=>{
          toast.success('User ' + userName + ' is deleted', {
            position: toast.POSITION.TOP_RIGHT
          });
        });
        this.refreshTable();
      }
      // rows = rows.filter(row => !deletedSet.has(row.id));
    }
    // this.setState({ rows });
  }

  async loadAllUsers(){
    // const sessionId = JSON.parse(sessionStorage.getItem('user'))._id;
    // // const fromDukeOAuth = JSON.parse(sessionStorage.getItem('fromDukeOAuth'));
    // // console.log("sessionId:" + sessionId);
    // // console.log("fromDukeOAuth:" + fromDukeOAuth);
    // // const sessionInfo = utils.createSessionInfoObject(sessionId, fromDukeOAuth);
    // // console.log("sessionInfo:");
    // // console.log(sessionInfo);
    // const rawUserData = await userInterface.getAllUsersAsync(sessionId);
    // console.log("rawUserData:");
    // console.log(rawUserData);
    // if (rawUserData.length == 0){
    //   return;
    // }
    // var processedData=[];
    // // loop through users
    // for (var i = 0; i < rawUserData.length; i++) {
    //   const currentUser = rawUserData[i];
    //   console.log("processing user..." );
    //   console.log(currentUser);
    //   //process data
    //   var singleData = new Object ();
    // // match schema for user
    //   singleData.username = currentUser.username;
    //   singleData.email = currentUser.email;
    //   singleData.isAdmin = currentUser.isAdmin;
    //   singleData.isManager = currentUser.isManager;
    //   singleData.fromDukeOAuth = currentUser.fromDukeOAuth;
    //   singleData.loggedIn = currentUser.loggedIn;
    //   singleData.userId = currentUser._id;
    //   singleData.privilege = 'user';
    //   //add privilege property, which is a string
    //   if (singleData.isAdmin){
    //     singleData.privilege = 'admin';
    //   } else if (singleData.isManager){
    //     singleData.privilege = 'manager';
    //   }
    //   console.log("packaged user");
    //   console.log(singleData);
    //   processedData.push(singleData);
    // };

    // var finalData = [...processedData.map((row, index)=> ({
    //     id: index,...row,
    //   })),
    // ];

    // console.log("Finished Processing All Data:");
    // console.log(finalData);
    // this.setState({rows: finalData});

  };
  componentWillMount(){
    sessionId = JSON.parse(sessionStorage.getItem('user'))._id;
    console.log("sessionId set to " + sessionId);
  }
  componentDidMount(){
    this.loadAllUsers();
    // console.log("constructor in GridExample: rows:")
    // console.log("Getting user data from props:");
    // console.log(this.props.rows);
    // this.setState({rows: this.props.rows});
  }

	render() {
		const { columns, sorting, editingColumnExtensions, 
      privilegeColumns, dukeUserColumns, usernameColumns,
      pageSize, pageSizes, currentPage, } = this.state;
    const { rows } = this.props;
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
        <DukeUserTypeProvider
          for={dukeUserColumns}
        />
				<PrevilegeTypeProvider
					for={privilegeColumns}
				/>
        <UsernameTypeProvider
          for={usernameColumns}
        />
				<EditingState
            		columnExtensions={editingColumnExtensions}
            		onCommitChanges={this.commitChanges}
        />
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
				<TableFilterRow 
					cellComponent={FilterCell}
				/> 
				<TableEditRow />
        <TableEditColumn showEditCommand showDeleteCommand />
			</Grid>
			</Paper>
		);
	}
}
