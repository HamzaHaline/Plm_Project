import React from 'react';
import Paper from 'material-ui/Paper';
import {
  Grid,
  Table,
  TableHeaderRow,
  PagingPanel,
  DragDropProvider,
  TableColumnReordering,
} from '@devexpress/dx-react-grid-material-ui';
import {
  SortingState,
  PagingState,
  IntegratedPaging,
  IntegratedSorting,
} from '@devexpress/dx-react-grid';
import Styles from 'react-select/dist/react-select.css';
import { withStyles } from 'material-ui/styles';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'; // Import Recharts components
import dummyData from '../../orders/dummyData';
import * as formulaActions from '../../../interface/formulaInterface';
import * as testConfig from '../../../../resources/testConfig.js';

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
      sorting: [],
      currentPage: 0,
      pageSize: 10,
      pageSizes: [10, 50, 100, 500],
      columnOrder: ['name', 'totalProvided', 'totalCost'],
      selectedFormula: '',
    };
    this.changeSorting = sorting => this.setState({ sorting });
    this.changeCurrentPage = currentPage => this.setState({ currentPage });
    this.changePageSize = pageSize => this.setState({ pageSize });
    this.changeColumnOrder = (order) => {
      this.setState({ columnOrder: order });
    };
    this.handleFormulaChange = this.handleFormulaChange.bind(this);
  }

  componentDidMount() {
    this.loadAllFormulas();
  }

  async loadAllFormulas() {
    var rawData = [];

    if (READ_FROM_DATABASE) {
      sessionId = JSON.parse(sessionStorage.getItem('user'))._id;
      rawData = await formulaActions.getAllFormulasAsync(sessionId);
    } else {
      rawData = dummyData;
    }

    var processedData = [];
    if (rawData) {
      processedData = [...rawData.map((row, index) => ({
        id: index,
        ...row,
        totalProvided: Math.round(row.totalProvided * 1000) / 1000,
        totalCost: Math.round(row.totalCost * 100) / 100,
      }))];
    }

    this.setState({ rows: processedData });
  }

  handleFormulaChange(event) {
    this.setState({ selectedFormula: event.target.value });
  }

  render() {
    const { rows, columns, sorting, currentPage, pageSize, pageSizes, columnOrder, selectedFormula } = this.state;

    // Filter rows based on selectedFormula
    const filteredRows = selectedFormula
      ? rows.filter(row => row.name === selectedFormula)
      : rows;

    // Prepare data for the chart
    const chartData = filteredRows.map(row => ({
      name: row.name,
      totalProvided: row.totalProvided,
      totalCost: row.totalCost,
    }));

    return (
      <Paper>
        {/* Add Title */}
        <div style={{ margin: '20px', textAlign: 'center' }}>
          <h3 style={{ color: '#FFD700' }}>Production Report</h3>
        </div>

        {/* Add Filter */}
        <div style={{ margin: '20px', textAlign: 'center' }}>
          <label style={{ marginRight: '10px', fontWeight: 'bold' }}>Filter by Formula Name:</label>
          <select
            value={selectedFormula}
            onChange={this.handleFormulaChange}
            style={{ padding: '5px', borderRadius: '5px', border: '1px solid #ccc' }}
          >
            <option value="">All Formulas</option>
            {rows.map(row => (
              <option key={row.id} value={row.name}>{row.name}</option>
            ))}
          </select>
        </div>

        <Grid
          allowColumnResizing={true}
          rows={filteredRows}
          columns={columns}
        >
          <SortingState sorting={sorting} onSortingChange={this.changeSorting} />
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
          <PagingPanel pageSizes={pageSizes} />
        </Grid>

        {/* Add the bar chart below the table */}
        <div style={{ margin: '20px' }}>
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
            <Bar dataKey="totalProvided" fill="#82ca9d" name="Units Produced" />
            <Bar dataKey="totalCost" fill="#8884d8" name="Cost ($)" />
          </BarChart>
        </div>
      </Paper>
    );
  }
}