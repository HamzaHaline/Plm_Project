import React from 'react';
import Paper from 'material-ui/Paper';
import {
  Grid,
  Table,
  TableHeaderRow, PagingPanel, DragDropProvider, TableColumnReordering,
} from '@devexpress/dx-react-grid-material-ui';
import {
  SortingState, PagingState,
  IntegratedPaging, IntegratedSorting,
} from '@devexpress/dx-react-grid';
import Styles from 'react-select/dist/react-select.css';
import { withStyles } from 'material-ui/styles';
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, CartesianGrid, XAxis, YAxis, Legend } from 'recharts';
import dummyData from '../../orders/dummyData';
import * as ingredientActions from '../../../interface/ingredientInterface';
import * as testConfig from '../../../../resources/testConfig.js';

var sessionId = "";
const READ_FROM_DATABASE = testConfig.READ_FROM_DATABASE;

export default class FinancialReport extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      columns: [
        { name: 'name', title: 'Ingredient Name' },
        { name: 'moneySpent', title: 'Total Expenditure ($)' },
        { name: 'moneyProd', title: 'Production Expenditure ($)' },
      ],
      rows: [],
      sorting: [],
      currentPage: 0,
      pageSize: 10,
      pageSizes: [10, 50, 100, 500],
      columnOrder: ['name', 'moneySpent', 'moneyProd'],
      selectedDateTime: new Date(),
      totalExpense: 0,
      totalProductionExpense: 0,
      selectedIngredient: '',
    };
    this.changeSorting = sorting => this.setState({ sorting });
    this.changeCurrentPage = currentPage => this.setState({ currentPage });
    this.changePageSize = pageSize => this.setState({ pageSize });
    this.changeColumnOrder = (order) => {
      this.setState({ columnOrder: order });
    };
    this.handleDateTimeChange = dateTime => {
      this.setState({ selectedDateTime: dateTime });
    };
    this.handleIngredientChange = this.handleIngredientChange.bind(this);
  }

  componentDidMount() {
    this.loadAllIngredients();
  }

  async loadAllIngredients() {
    var rawData = [];

    if (READ_FROM_DATABASE) {
      sessionId = JSON.parse(sessionStorage.getItem('user'))._id;
      rawData = await ingredientActions.getAllIngredientsOnlyAsync(sessionId);
      rawData = rawData.data;
    } else {
      rawData = dummyData;
    }

    var processedData = [];
    if (rawData) {
      processedData = [...rawData.map((row, index) => ({
        id: index,
        ...row,
        moneySpent: Math.round(row.moneySpent * 100) / 100,
        moneyProd: Math.round(row.moneyProd * 100) / 100,
      }))];
    }

    var tempExpense = 0;
    var tempProductionExpense = 0;

    for (var i = 0; i < processedData.length; i++) {
      tempExpense += processedData[i].moneySpent;
      tempProductionExpense += processedData[i].moneyProd;
    }
    this.setState({ totalExpense: tempExpense });
    this.setState({ totalProductionExpense: tempProductionExpense });
    this.setState({ rows: processedData });
  }

  handleIngredientChange(event) {
    this.setState({ selectedIngredient: event.target.value });
  }

  render() {
    const { rows, columns, sorting, currentPage, pageSize, pageSizes, columnOrder, selectedIngredient } = this.state;

    // Filter rows based on selectedIngredient
    const filteredRows = selectedIngredient
      ? rows.filter(row => row.name === selectedIngredient)
      : rows;

    // Prepare data for graphs
    const pieData = filteredRows.map(row => ({ name: row.name, value: row.moneySpent }));
    const barData = filteredRows.map(row => ({
      name: row.name,
      moneySpent: row.moneySpent,
      moneyProd: row.moneyProd,
    }));

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    return (
      <Paper>
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

        <p><font style={{ marginLeft: 20 }} size="3">Overall Ingredient Expenditure: {this.state.totalExpense}</font></p>
        <p><font style={{ marginLeft: 20 }} size="3">Overall Production Expenditure: {this.state.totalProductionExpense}</font></p>

        {/* Add Pie Chart */}
        <div style={{ margin: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h3 style={{ color: '#FFD700' }}>Ingredient Expenditure Distribution</h3>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ marginRight: '10px' }}>Filter by Ingredient:</label>
            <select
              value={selectedIngredient}
              onChange={this.handleIngredientChange}
              style={{ padding: '5px', borderRadius: '5px' }}
            >
              <option value="">All Ingredients</option>
              {rows.map(row => (
                <option key={row.id} value={row.name}>{row.name}</option>
              ))}
            </select>
          </div>
          <PieChart width={400} height={400}>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: $${value}`}
              outerRadius={150}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>

        {/* Add Bar Chart */}
        <div style={{ margin: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h3 style={{ color: '#FFD700' }}>Expenditure vs Production Cost</h3>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ marginRight: '10px' }}>Filter by Ingredient:</label>
            <select
              value={selectedIngredient}
              onChange={this.handleIngredientChange}
              style={{ padding: '5px', borderRadius: '5px' }}
            >
              <option value="">All Ingredients</option>
              {rows.map(row => (
                <option key={row.id} value={row.name}>{row.name}</option>
              ))}
            </select>
          </div>
          <BarChart width={600} height={300} data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="moneySpent" fill="#8884d8" name="Expenditure ($)" />
            <Bar dataKey="moneyProd" fill="#82ca9d" name="Production Cost ($)" />
          </BarChart>
        </div>
      </Paper>
    );
  }
}