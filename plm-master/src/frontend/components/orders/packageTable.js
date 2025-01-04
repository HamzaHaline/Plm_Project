import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Paper from 'material-ui/Paper';

const styles = theme => ({
  root: {
    width: '20%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 100,
  },
  tableCell: {
    width: 30,
  }
});

let id = 0;
function createData(packageName, weight) {
  id += 1;
  return {packageName,weight};
}

const data = [
  createData('Sack', 0.5),
  createData('Pail', 1),
  createData('Drum', 3),
  createData('Supersack', 16),
  createData('Truckload', 'N/A'),
  createData('Railcar', 'N/A'),
];

function SimpleTable(props) {
  const { classes } = props;

  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell className={classes.tableCell}> Package Name </TableCell>
            <TableCell > Floor Space (sqft) </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((n, index) => (
              <TableRow key={index}>
                <TableCell className={classes.tableCell}>{n.packageName}</TableCell>
                <TableCell>{n.weight}</TableCell>
              </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

SimpleTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleTable);