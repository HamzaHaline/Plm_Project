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
import * as ingredientActions from '../../../interface/ingredientInterface';
import * as testConfig from '../../../../resources/testConfig.js';

// const sessionId = testConfig.sessionId;
var sessionId = "";
// var userId = "";
const READ_FROM_DATABASE = testConfig.READ_FROM_DATABASE;

export default class FreshnessReport extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        // ingredientName also includes intermediate name
        { name: 'ingredientName', title: 'Ingredient/Intermediate Name' },
        { name: 'averageWaitTime', title: 'Average Wait Time' },
        { name: 'worstWaitTime', title: 'Worst-case Wait Time' },
      ],
      rows: [],
      sorting: [],
      currentPage: 0,
      pageSize: 10,
      pageSizes: [10, 50, 100, 500],
      columnOrder: ['name', 'averageWaitTime', 'worstWaitTime'],
      overallFreshness: '',
      totalWorstCase: '',
    };
    this.changeSorting = sorting => this.setState({ sorting });
    this.changeCurrentPage = currentPage => this.setState({ currentPage });
    this.changePageSize = pageSize => this.setState({ pageSize });
    this.changeColumnOrder = (order) => {
      this.setState({ columnOrder: order });
    };
  }

  componentDidMount() {
    this.loadAllIngredients();
  }

  async loadAllIngredients() {
    var rawData = [];
    sessionId = JSON.parse(sessionStorage.getItem('user'))._id;
    console.log('getting fresh data ' + sessionId);
    rawData = await ingredientActions.getFreshAsync(sessionId);
    console.log(rawData);

    var processedData = [];
    if (rawData.data) rawData = rawData.data; // to handle response
    if (rawData) {
      processedData = [...rawData.map((row, index) => ({
        id: index,
        ...row,
        averageWaitTime: row.averageDay + "d  " + row.averageHour + "h " + row.averageMinute + "m",
        worstWaitTime: row.oldestDay + "d  " + row.oldestHour + "h " + row.oldestMinute + "m",
      }))];
    }

    var totalMinutesSum = 0;
    var worstCase = 0;

    for (var i = 0; i < processedData.length; i++) {
      var tempWorst = 0;
      totalMinutesSum += Number(processedData[i].averageDay) * 24 * 60 + Number(processedData[i].averageHour) * 60 + Number(processedData[i].averageMinute);
      tempWorst += Number(processedData[i].oldestDay) * 24 * 60 + Number(processedData[i].oldestHour) * 60 + Number(processedData[i].oldestMinute);
      if (tempWorst > worstCase) {
        worstCase = Number(processedData[i].oldestDay) + "d  " + Number(processedData[i].oldestHour) + "h " + Number(processedData[i].oldestMinute) + "m";
      }
    }

    if (worstCase == 0) {
      this.setState({ totalWorstCase: '' });
    } else {
      this.setState({ totalWorstCase: worstCase });
    }
    totalMinutesSum = Math.round(totalMinutesSum / processedData.length);
    this.setState({ rows: processedData });

    var overallDay = Math.floor(totalMinutesSum / 24 / 60);
    var overallHour = Math.floor(totalMinutesSum / 60 % 24);
    var overallMin = Math.floor(totalMinutesSum % 60);
    var overallFreshness = overallDay + "d  " + overallHour + "h " + overallMin + "m";
    if (isNaN(overallDay) || isNaN(overallHour) || isNaN(overallMin)) {
      overallFreshness = '';
    }
    this.setState({ overallFreshness: overallFreshness });
  }

  render() {
    const { rows, columns, sorting, currentPage, pageSize, pageSizes, columnOrder } = this.state;

    // Prepare data for the chart
    const chartData = rows.map(row => ({
      name: row.ingredientName,
      averageWaitTime: parseInt(row.averageDay) * 24 + parseInt(row.averageHour),
      worstWaitTime: parseInt(row.oldestDay) * 24 + parseInt(row.oldestHour),
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
        <p><font style={{ marginLeft: 20 }} size="4">Overall Freshness: {this.state.overallFreshness}</font></p>
        <p><font style={{ marginLeft: 20 }} size="4">Overall Worst-case: {this.state.totalWorstCase}</font></p>

        {/* Add Chart Below */}
        <div style={{ margin: '20px', textAlign: 'center' }}>
          <h3 style={{ color: '#FFD700' }}>Ingredient Freshness Overview</h3>
          <BarChart
            width={800}
            height={400}
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="averageWaitTime" fill="#8884d8" name="Average Wait Time (hours)" />
            <Bar dataKey="worstWaitTime" fill="#82ca9d" name="Worst-case Wait Time (hours)" />
          </BarChart>
        </div>
      </Paper>
    );
  }
}
