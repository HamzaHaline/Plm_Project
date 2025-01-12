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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import dummyData from '../../orders/dummyData';
import * as distributorNetworkActions from '../../../interface/distributorNetworkInterface.js';
import data from '../../distributorNetwork/testData';

var sessionId = "";

export default class FreshnessReport extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        { name: 'productName', title: 'Product Name' },
        { name: 'numSold', title: 'Sale Quantity' },
        { name: 'averagePerUnitPrice', title: 'Avg. Per-unit Price ($)' },
        { name: 'totalRevenue', title: 'Total Revenue ($)' },
        { name: 'totalCost', title: 'Ingredient Cost ($)' },
        { name: 'totalProfit', title: 'Total Profit ($)' },
        { name: 'perUnitProfit', title: 'Per Unit Profit ($)' },
        { name: 'profitMargin', title: 'Profit Margin (%)' },
      ],
      rows: [],
      sorting: [],
      currentPage: 0,
      pageSize: 10,
      pageSizes: [10, 50, 100, 500],
      columnOrder: ['name', 'averageWaitTime', 'worstWaitTime'],
      totalRevenue: 0,
      totalCost: 0,
      totalProfit: 0,
    };
    this.changeSorting = sorting => this.setState({ sorting });
    this.changeCurrentPage = currentPage => this.setState({ currentPage });
    this.changePageSize = pageSize => this.setState({ pageSize });
    this.changeColumnOrder = (order) => {
      this.setState({ columnOrder: order });
    };
  }

  componentDidMount() {
    sessionId = JSON.parse(sessionStorage.getItem('user'))._id;
    this.loadDistributorNetworkData();
  }

  async loadDistributorNetworkData() {
    console.log("load distribution network data");
    var data = await distributorNetworkActions.getAllDistributorNetworksAsync(sessionId);
    console.log("Here");
    console.log(data);
    var processedData = [...data.map((row, index) => ({
      id: index, ...row,
      totalCost: Math.round(row.totalCost * 100) / 100,
      numSold: (row.numSold > 0) ? (Math.round(row.numSold * 100) / 100) : 0,
      averagePerUnitPrice: (Number(row.totalRevenue) > 0) ? (Math.round((Number(row.totalRevenue) / Number(row.numSold)) * 100) / 100) : 0,
      totalProfit: ((Number(row.totalRevenue) - Number(row.totalCost)) != 0) ? (Math.round((row.totalRevenue - row.totalCost) * 100) / 100) : 0,
      perUnitProfit: (Number(row.totalRevenue - row.totalCost) != 0) ? (Math.round((Number(row.totalRevenue - row.totalCost) / Number(row.numSold)) * 100) / 100) : 0,
      profitMargin: (Number(row.totalRevenue) > 0) ? (Math.round((Number(row.totalRevenue) / Number(row.totalCost)) * 10000) / 100) : 0,
    }))];

    var tempCost = 0;
    var tempRevenue = 0;
    var tempProfit = 0;

    for (var i = 0; i < processedData.length; i++) {
      tempCost += processedData[i].totalCost;
      tempRevenue += processedData[i].totalRevenue;
      tempProfit += processedData[i].totalProfit;
    }

    this.setState({ totalCost: tempCost });
    this.setState({ totalRevenue: tempRevenue });
    this.setState({ totalProfit: tempProfit });
    this.setState({ rows: processedData });
  }

  render() {
    const { rows, columns, sorting, currentPage, pageSize, pageSizes, columnOrder } = this.state;

    // Prepare data for the chart
    const chartData = rows.map(row => ({
      name: row.productName,
      Revenue: row.totalRevenue,
      Cost: row.totalCost,
      Profit: row.totalProfit,
    }));

    return (
      <Paper>
        <Grid
          allowColumnResizing={true}
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
          <PagingPanel pageSizes={pageSizes} />
        </Grid>
        <p><font style={{ marginLeft: 20 }} size="4">Overall Cost: {this.state.totalCost}</font></p>
        <p><font style={{ marginLeft: 20 }} size="4">Overall Revenue: {this.state.totalRevenue}</font></p>
        <p><font style={{ marginLeft: 20 }} size="4">Overall Profit: {this.state.totalProfit}</font></p>

        {/* Add Chart Below */}
        <div style={{ margin: '20px', textAlign: 'center' }}>
          <h3 style={{ color: '#FFD700', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)' }}>Financial Overview</h3>
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
            <Bar dataKey="Revenue" fill="#82ca9d" name="Revenue ($)" />
            <Bar dataKey="Cost" fill="#8884d8" name="Cost ($)" />
            <Bar dataKey="Profit" fill="#ffc658" name="Profit ($)" />
          </BarChart>
        </div>
      </Paper>
    );
  }
}
