import React from 'react';
import Paper from 'material-ui/Paper';
import PropTypes from 'prop-types';

import {
  EditingState,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  Table,
  TableHeaderRow,
  TableEditRow,
  TableEditColumn,
  TableColumnReordering,
} from '@devexpress/dx-react-grid-material-ui';

import {EditButton,CommitButton,CancelButton} from '../vendors/Buttons.js';
import Button from 'material-ui/Button';
import * as storageActions from '../../interface/storageInterface';

import * as testConfig from '../../../resources/testConfig.js'

import dummyData from './dummyData';
import PubSub from 'pubsub-js';
import { ToastContainer, toast } from 'react-toastify';
//TODO: get user data
// const sessionId = testConfig.sessionId;

var sessionId = "";
const READ_FROM_DATABASE = testConfig.READ_FROM_DATABASE;

var isAdmin =  "";
// JSON.parse(sessionStorage.getItem('user')).isAdmin;


const Cell = (props)=>{
  return <Table.Cell {...props}/>
    
};

Cell.propTypes = {
  column: PropTypes.shape({ name: PropTypes.string }).isRequired,
};

const EditCell = (props) => {
  if(props.column.name == 'capacity'){
    return <TableEditRow.Cell {...props} style={{backgroundColor:'aliceblue'}} />;
  }else{
    return <Cell {...props} style={{backgroundColor:'aliceblue'}} />
  };
};

EditCell.propTypes = {
  column: PropTypes.shape({ name: PropTypes.string }).isRequired,
};

const commandComponents = {
  edit:    EditButton,
  commit:  CommitButton,
  cancel:  CancelButton,
};

const Command = ({ id, onExecute }) => {
  const CommandButton = commandComponents[id];
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

const getRowId = row => row.id;


class Storage extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      columns: [
        { name: 'temperatureZone', title: 'Temperature Zone' },
        { name: 'capacity', title: 'Capacity (sqft)' },
        { name: 'currentOccupiedSpace', title: 'Space Occupied (sqft)' },
        { name: 'currentEmptySpace', title: 'Space Left (sqft)' },
      ],
      rows:[],
      editingRowIds: [],
      rowChanges: {},
    };

    this.changeEditingRowIds = editingRowIds => this.setState({ editingRowIds });

    this.changeRowChanges = (rowChanges) => {
      console.log(" ROW CHANGES: ");
      this.setState({ rowChanges });
    }

    var temp = this;
    this.commitChanges = async ({ changed}) => {

      let { rows } = this.state;
      var temp = this;
      console.log(JSON.stringify(rows));
      console.log("changed " + JSON.stringify(changed));

      if(changed){

        for(var i = 0; i < rows.length;i++){

          console.log( " Changed Id " + changed[rows[i].id]);
          if(changed[rows[i].id]){
            const re = /^[0-9\b]+$/;
            var oldRow = rows[i];
            var oldCap = rows[i].capacity;
            var enteredQuantity = changed[rows[i].id].capacity;
                if (!re.test(enteredQuantity)) {
                  toast.error(" Quantity must be a number.");
                  return;
                }
                else if(enteredQuantity<rows[i].currentOccupiedSpace){
                   PubSub.publish('showAlert', "Entered quantity must be greater than current occupied space");
                   return;
                }
                else {
                    rows[i].capacity = enteredQuantity;
                }
            console.log("id " + rows[i]._id);
            console.log("zone " + rows[i].temperatureZone);

            await storageActions.updateStorage(rows[i]._id,
                rows[i].temperatureZone, Number(enteredQuantity), rows[i].currentOccupiedSpace, sessionId, function(res){
                    if (res.status == 400) {

                    console.log(rows);
                      //Reload window when cancelled
                         PubSub.publish('showAlert', res.data);
                         // PubSub.publish('showAlert', res.data);
                          window.location.reload();
                          console.log(oldCap);
                        
                      }else{
                        temp.loadStorageInfo();
                        toast.success(" Storage capacity updated successfully! ");
                      }
                  });
              }
            }
          }
        }
        this.commitChanges = this.commitChanges.bind(this);
      }

  componentWillMount(){
    isAdmin = JSON.parse(sessionStorage.getItem('user')).isAdmin;
  }


  componentDidMount() {
    this.loadStorageInfo();
  }

  async loadStorageInfo(){
    var rawData = [];
    if(READ_FROM_DATABASE){
      sessionId = JSON.parse(sessionStorage.getItem('user'))._id;
      rawData = await storageActions.getAllStoragesAsync(sessionId);
    } else {
     rawData = dummyData;
    }
    var processedData = [];
    if(rawData){
      processedData = [...rawData.map((row, index)=> ({
          id:index,...row,
        })),
      ];
    }

   this.setState({rows:processedData});
  }

  render() {
    // const {classes} = this.props;
    const { rows,columns ,editingRowIds,rowChanges,} = this.state;

    return (
    <div>
      <p><b><font size="6" color="3F51B5">Storage</font></b></p> 
      <Paper>
        <Grid
          allowColumnResizing = {true}
          rows={rows}
          columns={columns}
          getRowId={getRowId}
        >
          {isAdmin &&
            <EditingState
              editingRowIds={editingRowIds}
              onEditingRowIdsChange={this.changeEditingRowIds}
              rowChanges={rowChanges}
              onRowChangesChange={this.changeRowChanges}
              onCommitChanges={this.commitChanges}
            />}

          <Table cellComponent={Cell}/>
          <TableHeaderRow />
          {isAdmin &&
            <TableEditRow
              cellComponent={EditCell}
            />
          }
          {isAdmin &&
            <TableEditColumn
              width={120}
              showEditCommand
              commandComponent={Command}
            />}

        </Grid>
      </Paper>
    </div>
    );
  }
}

// Storage.propTypes = {
//   classes: PropTypes.object.isRequired,
// };

export default Storage;
