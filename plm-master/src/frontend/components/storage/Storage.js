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

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { EditButton, CommitButton, CancelButton } from '../vendors/Buttons.js';
import Button from 'material-ui/Button';
import * as storageActions from '../../interface/storageInterface';
import * as testConfig from '../../../resources/testConfig.js';
import dummyData from './dummyData';
import PubSub from 'pubsub-js';
import { ToastContainer, toast } from 'react-toastify';

var sessionId = "";
const READ_FROM_DATABASE = testConfig.READ_FROM_DATABASE;
var isAdmin = "";

const Cell = (props) => {
  return <Table.Cell {...props} />;
};

Cell.propTypes = {
  column: PropTypes.shape({ name: PropTypes.string }).isRequired,
};

const EditCell = (props) => {
  if (props.column.name === 'capacity') {
    return <TableEditRow.Cell {...props} style={{ backgroundColor: 'aliceblue' }} />;
  } else {
    return <Cell {...props} style={{ backgroundColor: 'aliceblue' }} />;
  }
};

EditCell.propTypes = {
  column: PropTypes.shape({ name: PropTypes.string }).isRequired,
};

const commandComponents = {
  edit: EditButton,
  commit: CommitButton,
  cancel: CancelButton,
};

const Command = ({ id, onExecute }) => {
  const CommandButton = commandComponents[id];
  return <CommandButton onExecute={onExecute} />;
};

Command.propTypes = {
  id: PropTypes.string.isRequired,
  onExecute: PropTypes.func.isRequired,
};

const getRowId = (row) => row.id;

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
      rows: [],
      editingRowIds: [],
      rowChanges: {},
    };

    this.changeEditingRowIds = (editingRowIds) => this.setState({ editingRowIds });

    this.changeRowChanges = (rowChanges) => {
      this.setState({ rowChanges });
    };

    this.commitChanges = async ({ changed }) => {
      let { rows } = this.state;
      if (changed) {
        for (var i = 0; i < rows.length; i++) {
          if (changed[rows[i].id]) {
            const re = /^[0-9\b]+$/;
            var enteredQuantity = changed[rows[i].id].capacity;
            if (!re.test(enteredQuantity)) {
              toast.error(" Quantity must be a number.");
              return;
            } else if (enteredQuantity < rows[i].currentOccupiedSpace) {
              PubSub.publish('showAlert', "Entered quantity must be greater than current occupied space");
              return;
            } else {
              rows[i].capacity = enteredQuantity;
            }

            await storageActions.updateStorage(
              rows[i]._id,
              rows[i].temperatureZone,
              Number(enteredQuantity),
              rows[i].currentOccupiedSpace,
              sessionId,
              (res) => {
                if (res.status === 400) {
                  PubSub.publish('showAlert', res.data);
                  window.location.reload();
                } else {
                  this.loadStorageInfo();
                  toast.success(" Storage capacity updated successfully! ");
                }
              }
            );
          }
        }
      }
    };
  }

  componentWillMount() {
    isAdmin = JSON.parse(sessionStorage.getItem('user')).isAdmin;
  }

  componentDidMount() {
    this.loadStorageInfo();
  }

  async loadStorageInfo() {
    var rawData = [];
    if (READ_FROM_DATABASE) {
      sessionId = JSON.parse(sessionStorage.getItem('user'))._id;
      rawData = await storageActions.getAllStoragesAsync(sessionId);
    } else {
      rawData = dummyData;
    }

    var processedData = [];
    if (rawData) {
      processedData = [...rawData.map((row, index) => ({
        id: index, ...row,
      }))];
    }

    this.setState({ rows: processedData });
  }

  render() {
    const { rows, columns, editingRowIds, rowChanges } = this.state;

    // Prepare data for the chart
    const chartData = rows.map(row => ({
      name: row.temperatureZone,
      Capacity: row.capacity,
      Occupied: row.currentOccupiedSpace,
    }));

    return (
      <div>
        <p
          style={{
            fontSize: "28px", // Larger font size
            fontWeight: "normal", // Bold font weight
            color: "#DAA520", // Gold color
            margin: "20px 0", // Top and bottom spacing
            textTransform: "uppercase", // Make it uppercase
            textShadow: "1px 1px 2px rgba(0, 0, 0, 0.3)", // Add subtle shadow
          }}
        >
          Storage
        </p>
        <Paper>
          <Grid
            allowColumnResizing={true}
            rows={rows}
            columns={columns}
            getRowId={getRowId}
          >
            {isAdmin && (
              <EditingState
                editingRowIds={editingRowIds}
                onEditingRowIdsChange={this.changeEditingRowIds}
                rowChanges={rowChanges}
                onRowChangesChange={this.changeRowChanges}
                onCommitChanges={this.commitChanges}
              />
            )}

            <Table cellComponent={Cell} />
            <TableHeaderRow />
            {isAdmin && <TableEditRow cellComponent={EditCell} />}
            {isAdmin && (
              <TableEditColumn
                width={120}
                showEditCommand
                commandComponent={Command}
              />
            )}
          </Grid>
        </Paper>

        {/* Add Chart */}
        <div style={{ margin: '20px', textAlign: 'center' }}>
          <h3 style={{ color: '#DAA520', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)' }}>Storage Capacity vs Occupied Space</h3>
          <BarChart
            width={800}
            height={400}
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Capacity" fill="#8884d8" name="Capacity (sqft)" />
            <Bar dataKey="Occupied" fill="#82ca9d" name="Occupied Space (sqft)" />
          </BarChart>
        </div>
      </div>
    );
  }
}

export default Storage;
