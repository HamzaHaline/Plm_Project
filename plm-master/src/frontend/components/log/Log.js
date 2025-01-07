import React from 'react';
import Paper from 'material-ui/Paper';
import { DateTimePicker } from 'material-ui-pickers';
import {
  FilteringState,
  IntegratedFiltering,
  IntegratedSorting,
  SortingState,
} from '@devexpress/dx-react-grid';
import {
  PagingState,
  IntegratedPaging,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  Table,
  TableHeaderRow,
  TableFilterRow,
  PagingPanel,
} from '@devexpress/dx-react-grid-material-ui';
import KeyboardArrowLeft from 'material-ui-icons/KeyboardArrowLeft';
import KeyboardArrowRight from 'material-ui-icons/KeyboardArrowRight';
import DateRangeIcon from 'material-ui-icons/DateRange';
import AccessTimeIcon from 'material-ui-icons/AccessTime';
import KeyboardIcon from 'material-ui-icons/Keyboard';
import PubSub from 'pubsub-js';
import * as logActions from '../../interface/logInterface';

const getRowId = (row) => row.id;

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
      rows: [],
      unchangedRows: [],
      sorting: [{ columnName: 'date', direction: 'desc' }],
      startDate: new Date(2025, 0, 1, 0, 0, 0, 0),
      endDate: new Date(2025, 11, 31, 23, 59, 59, 0),
      currentPage: 0,
      pageSize: 10,
      pageSizes: [10, 50, 100, 500],
    };
  }

  componentDidMount() {
    this.loadLogInfo();
  }

  async loadLogInfo() {
    const sessionId = JSON.parse(sessionStorage.getItem('user'))._id;
    let rawData = await logActions.getAllLogsAsync(sessionId);

    if (rawData) {
      rawData = rawData.reverse();
    }

    const processedData = rawData.map((row, index) => ({
      id: index,
      ...row,
      date: row.date.replace('T', ' ').replace('Z', ' '),
    }));

    this.setState({ rows: processedData, unchangedRows: processedData });
  }

  handleStartDateChange = (date) => {
    const { endDate, unchangedRows } = this.state;
    if (Date.parse(date) > Date.parse(endDate)) {
      PubSub.publish('showAlert', 'Start date must be earlier than end date.');
    } else {
      this.setState({ startDate: date }, () => {
        this.filterRows();
      });
    }
  };

  handleEndDateChange = (date) => {
    const { startDate, unchangedRows } = this.state;
    if (Date.parse(date) < Date.parse(startDate)) {
      PubSub.publish('showAlert', 'End date must be later than start date.');
    } else {
      this.setState({ endDate: date }, () => {
        this.filterRows();
      });
    }
  };

  filterRows = () => {
    const { unchangedRows, startDate, endDate } = this.state;
    const filteredRows = unchangedRows.filter((row) => {
      const rowDate = new Date(row.date);
      return rowDate >= startDate && rowDate <= endDate;
    });
    this.setState({ rows: filteredRows });
  };

  render() {
    const {
      rows,
      columns,
      startDate,
      endDate,
      pageSize,
      pageSizes,
      currentPage,
      sorting,
    } = this.state;

    return (
      <div style={{ padding: '20px', backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
        <p
          style={{
            fontSize: '28px',
            fontWeight: 'normal',
            color: '#DAA520',
            margin: '20px 0',
            textTransform: 'uppercase',
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)',
          }}
        >
          Logs
        </p>
        <Paper
          style={{
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
            backgroundColor: '#fff',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '20px',
            }}
          >
            <div style={{ marginRight: '40px' }}>
              <span
                style={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: '#333',
                }}
              >
                Start Date:{' '}
              </span>
              <DateTimePicker
                value={startDate}
                onChange={this.handleStartDateChange}
                leftArrowIcon={<KeyboardArrowLeft />}
                rightArrowIcon={<KeyboardArrowRight />}
                dateRangeIcon={<DateRangeIcon />}
                timeIcon={<AccessTimeIcon />}
                keyboardIcon={<KeyboardIcon />}
                style={{
                  width: '200px',
                  border: '1px solid #ccc',
                  borderRadius: '5px',
                  padding: '5px',
                  backgroundColor: '#f7f7f7',
                }}
              />
            </div>
            <div>
              <span
                style={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: '#333',
                }}
              >
                End Date:{' '}
              </span>
              <DateTimePicker
                value={endDate}
                onChange={this.handleEndDateChange}
                leftArrowIcon={<KeyboardArrowLeft />}
                rightArrowIcon={<KeyboardArrowRight />}
                dateRangeIcon={<DateRangeIcon />}
                timeIcon={<AccessTimeIcon />}
                keyboardIcon={<KeyboardIcon />}
                style={{
                  width: '200px',
                  border: '1px solid #ccc',
                  borderRadius: '5px',
                  padding: '5px',
                  backgroundColor: '#f7f7f7',
                }}
              />
            </div>
          </div>
          <Grid rows={rows} columns={columns} getRowId={getRowId}>
            <FilteringState defaultFilters={[]} />
            <IntegratedFiltering />
            <SortingState sorting={sorting} onSortingChange={(sorting) => this.setState({ sorting })} />
            <PagingState
              currentPage={currentPage}
              onCurrentPageChange={(currentPage) => this.setState({ currentPage })}
              pageSize={pageSize}
              onPageSizeChange={(pageSize) => this.setState({ pageSize })}
            />
            <IntegratedSorting />
            <IntegratedPaging />
            <Table
              cellComponent={(props) => (
                <Table.Cell
                  {...props}
                  style={{
                    borderBottom: '1px solid #ddd',
                    padding: '10px',
                    fontSize: '14px',
                    textAlign: 'center',
                  }}
                />
              )}
            />
            <TableHeaderRow
              showSortingControls
              cellComponent={(props) => (
                <TableHeaderRow.Cell
                  {...props}
                  style={{
                    backgroundColor: '#DAA520',
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    textAlign: 'center',
                    padding: '10px',
                  }}
                />
              )}
            />
            <TableFilterRow />
            <PagingPanel pageSizes={pageSizes} />
          </Grid>
        </Paper>
      </div>
    );
  }
}

export default Log;
