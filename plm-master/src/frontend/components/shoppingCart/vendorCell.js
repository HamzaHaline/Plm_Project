
import React,{Component}  from 'react';
import PropTypes from 'prop-types';
import Select from './Select.js';
import Styles from  'react-select/dist/react-select.css';
import { withStyles } from 'material-ui/styles';
import Input from 'material-ui/Input';
import { TableCell } from 'material-ui/Table';
import { MenuItem } from 'material-ui/Menu';


const styles = theme => ({
  VendorCell: {
    verticalAlign: 'top',
    paddingRight: theme.spacing.unit,
    paddingTop: theme.spacing.unit * 1.25,
    paddingLeft: theme.spacing.unit,
    // overflow: 'visible',
  },
  });

class VendorCell extends Component{
  constructor(props){
    super (props);
    this.state = {
      vendorOptions : [],
      vendorId:"",
      vendorName:"",
      price:"",
      label:"",
    }
    this.handleVendorChange = this.handleVendorChange.bind(this);
}

  handleVendorChange(option){

    this.setState({vendorId:option.value});
    this.setState({price:option.price});
    this.setState({vendorName:option.vendorName});

    var vendorObject = new Object();

    vendorObject.vendorName=option.vendorName;
    vendorObject.vendorId=option.value;
    vendorObject.price=option.price;
    vendorObject.label = option.label

    this.props.handleChange(vendorObject);
  }

  componentWillMount(){
    this.loadVendorsOptions();
  }

  loadVendorsOptions(){
    this.setState({vendorOptions:this.props.vendorOptions});
    this.setState({vendorId: this.props.value});
  }

  render(){
    return(
      <TableCell
        style={{backgroundColor:'aliceblue'}} >
        <Select
         name="Vendor"
         options={this.state.vendorOptions}
         onChange={(option) => this.handleVendorChange(option)}
         value = {this.state.vendorId}
         />
     </TableCell>
    );
  }
}

export default withStyles(styles, { name: 'VendorCell' })(VendorCell);
