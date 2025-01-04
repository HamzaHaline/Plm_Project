import React from 'react';
import Paper from 'material-ui/Paper';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import Divider from 'material-ui/Divider';
import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import {
  Grid,
  Table,
  TableHeaderRow,TableEditColumn,PagingPanel,TableEditRow,
} from '@devexpress/dx-react-grid-material-ui';
import TextField from 'material-ui/TextField';
import * as formulaActions from '../../interface/formulaInterface';
import Tooltip from 'material-ui/Tooltip';
import RaisedButton from 'material-ui/Button';
import * as orderActions from '../../interface/orderInterface';
import * as productActions from '../../interface/productInterface';
import SnackBarDisplay from '../snackBar/snackBarDisplay';
import PubSub from 'pubsub-js';
import { ToastContainer, toast } from 'react-toastify';
import {reviewData} from './dummyData';
import ProductionLinesTable from './ProductionLinesTable.js';
const styles = {
    buttons: {
      marginTop: 30,
      float: 'center'
    },
    orderIngredientsButton: {
      marginLeft: 50,
    },
  };


var userId;
var sessionId;
var isAdmin;

class ProductionReview extends React.Component {
  constructor(props) {
    super(props);
    // var dummyObject = new Object();
    // const selectedFormula = (props.location.state.selectedFormula)?(props.location.state.selectedFormula):dummyObject;

    this.state = {
      columns:[],
      formulaColumns: [
        { name: 'name', title: 'Name' },
        { name: 'description', title: 'Description' },
        { name: 'unitsProvided', title: 'Product Units ' },
        { name: 'ingredients', title: 'Ingredient / Quantity' },
        {key: 'sendToProd', title:''},
      ],
        formulaRows:(props.location.state) ? [props.location.state.selectedFormula] : [],
        open : true,
        columns:[
          {name: "ingredientName" , title: "Ingredient Name " },
          {name: "totalAmountNeeded" , title: "Amount Needed"},
          {name: "currentUnit" , title: "Amount In Stock"},
          {name: "delta" , title:'Additional Required Amount'},
        ],
        rows:[],

        addedQuantity:(props.location.state) ? (props.location.state.selectedFormula.unitsProvided) : '',
        // needToOrderIngredients:false,
        ingredientsToOrder:[],
        snackBarMessage:'',
        snackBarOpen:false,
        intermediates:'',
        afterLink:'',
        selectedProductionLine: '',
        hasProductionLines: true,
    };
    this.selectProductionLine = this.selectProductionLine.bind(this);
    this.cancelProduction =() =>
      this.setState({
        formulaRows:[],
        open: false,
      });
    console.log(this.state.formulaRows);

    this.productionReview = async(event) =>{
      event.preventDefault();
      console.log(" get production review");
      var temp = this;
      if(this.state.formulaRows[0].productionLinesArray.length==0){
        this.setState({hasProductionLines: false});
      }
      //var afterLink = this.state.formulaRows[0].isIntermediate? '/admin-ingredients' : '/production-line';
      var afterLink = '/production-line';
      this.setState({afterLink: afterLink});

      //TODO: Check this
      console.log(temp.state.formulaRows[0]._id+' '+Number(temp.state.addedQuantity));
      await formulaActions.checkoutFormula("review",temp.state.formulaRows[0]._id,
                          Number(temp.state.addedQuantity),'dummyString',sessionId, function(res){

              if (res.status == 400) {
                // if (!alert(res.data)){
                //     return;
                // }
                if (!PubSub.publish('showAlert',res.data)){
                    return;
                }
              } else if (res.status == 500){
                PubSub.publish('showAlert', res.data);
                //alert(res.data)
              }
              else {
                 review = res.data;
                 console.log("production review");
                 console.log(review);

                 var review = [...review.map((row, index)=> ({
                     id:index,...row,
                     currentUnit:Math.round(row.currentUnit*100)/100,
                     delta:Math.round(row.delta*100)/100,
                     totalAmountNeeded:Math.round(row.totalAmountNeeded*100)/100,
                     })),
                   ];
                   // console.log(" Formula " + JSON.stringify(review));
                   temp.setState({rows:review});

                   // Check if you need to order the ingredients
                   var data = [];
                   var intermediateData = [];

                   for(var i =0; i < review.length;i++){
                     if(review[i].delta> 0 ){
                       // Add to the Array
                       data.push(review[i]);
                       if(review[i].isIntermediate){
                         intermediateData.push(review[i]);
                       }
                     }
                   }
                   var intermediateString = "";
                   for(var j = 0; j < intermediateData.length;j++){
                     intermediateString+=intermediateData[j].ingredientName;
                     if(j!=intermediateData.length-1){
                       intermediateString+=" , ";
                     }
                   }

                   console.log(data);
                   temp.setState({intermediates:intermediateString});

                   temp.setState({ingredientsToOrder:data});
                   temp.setState({open:false});

                   // temp.setState({snackBarMessage : "Formula successfully sent for production review. "});
                   // temp.setState({snackBarOpen:true});
                   //PubSub.publish('showMessage', 'Formula successfully sent for production review.' );
                   //toast.success('Formula successfully sent for production review.');
              }
      });
    }

    console.log('preview constructed');
    this.addToShoppingCart = this.addToShoppingCart.bind(this);
    this.checkOutFormulaFinal = this.checkOutFormulaFinal.bind(this);
    this.handleSnackBarClose = this.handleSnackBarClose.bind(this);
    this.handleOnClose = this.handleOnClose.bind(this);
    console.log('everything binded');
  }


  async addToShoppingCart(event){
    // event.preventDefault();
    //TODO: send to back end
    var temp = this;
    console.log("add To cart" + JSON.stringify(this.state.ingredientsToOrder));
    // ADD the ingredients with needed amount to
    // var success = false;
    console.log(temp.state.ingredientsToOrder);
    for(var i = 0; i < temp.state.ingredientsToOrder.length;i++){
      var row = temp.state.ingredientsToOrder[i];
      var vendorName = "";
      var price = 0;
      var _package = Math.ceil(row.delta / row.numUnitPerPackage);
      var vendors = row.vendors;
      vendors.sort(function(a, b) {return a.price - b.price });
      vendorName = vendors[0].vendorName;
      price = vendors[0].price;

      console.log(" ADD ORDER ");
      // TODO: CHANGE THIS
      var ingredientLots = [];
      var temp = this;
      await orderActions.addOrder(userId,row.ingredientId,
        row.ingredientName,vendorName,_package,price,ingredientLots,sessionId,function(res){
        //TODO: Please update this
        console.log(res.status);
        if(res.status == 400){
          PubSub.publish('showAlert', res.data);
          //alert(res.data);
        }else{
          // success = true;
          // temp.setState({snackBarMessage : "Ingredients Successfully added to cart. "});
          // temp.setState({snackBarOpen:true});
          toast.success('Ingredients successfully added to cart !');
          //PubSub.publish('showMessage', ' Ingredients successfully added to cart !' );
        }
      });
    }
    //TODO: Snackbar

    event.stopPropagation();
  }
  
  async checkOutFormulaFinal(event){
    var temp = this;
    console.log(temp.state.formulaRows[0]);
    console.log("check out formula final ")
    console.log(temp.state.selectedProductionLine);
    const _id = temp.state.formulaRows[0]._id;
    const addedQuantity = temp.state.addedQuantity;
    const selectedProductionLine = temp.state.selectedProductionLine;
    console.log("_id is " + _id);
    console.log("addedQuantity is " + addedQuantity);
    console.log("selectedProductionLine is " + selectedProductionLine);
    await formulaActions.checkoutFormula("checkout", _id,
                              Number(addedQuantity), selectedProductionLine,
                              sessionId, function(res){
         if (res.status === 400) {
            PubSub.publish('showAlert', res.data);
            //alert(res.data);
         } else {
             //PubSub.publish('showMessage', ' Successfully added to production !' );
             toast.success('Successfully added to production !');
             // window.location.reload();
             const redirectUrl = temp.state.afterLink;
             console.log("redirectUrl is " + redirectUrl);
             window.location.replace(redirectUrl);
            // alert('Successfully added to production .');
         }
      });

    // event.stopPropagation();
  };

  selectProductionLine(productionName){
    this.setState({selectedProductionLine: productionName});
  }

  handleFormulaQuantity(event){
    console.log("handleFormulaChange")
    console.log(this.state.formulaRows);
    console.log(this.state.formulaRows[0].isIntermediate);
    var re = /^\d*[1-9]\d*$/;
    if(this.state.formulaRows[0].isIntermediate){
      console.log("isIntermediate");
      re = /^\d{0,10}(\.\d{0,2})?$/;
    }
    if (event.target.value == '' || (event.target.value>0 && re.test(event.target.value))) {
       this.setState({addedQuantity: event.target.value})
    }else{

      toast.error(" Quantity must be a positive number.");
    }
  }

  componentWillMount(){
    console.log(" Formula Rows " + JSON.stringify(this.state.formulaRows));
    sessionId = JSON.parse(sessionStorage.getItem('user'))._id;
    isAdmin = JSON.parse(sessionStorage.getItem('user')).isAdmin;
    userId = JSON.parse(sessionStorage.getItem('user'))._id;
  }


  handleOnClose(){
    this.setState({open:false});
  }

  handleSnackBarClose(){
    this.setState({snackBarOpen:false});
    this.setState({snackBarMessage: ''});
  }

  render() {
    // const {classes} = this.props;
    // const { classes } = this.props;
    const {formulaRows,rows,columns,formulaColumns,intermediates} = this.state;
    return (
      <div>
      <p><b><font size="6" color="3F51B5">Production Review</font></b></p>
      <Paper>
        <Grid
          allowColumnResizing = {true}
          rows={rows}
          columns={columns}
        >
          {/* <DragDropProvider /> */}
          <Table />
          <TableHeaderRow  />
        </Grid>

      <Divider/>

      {/* {this.state.snackBarOpen && <SnackBarDisplay
            open = {this.state.snackBarOpen}
            message = {this.state.snackBarMessage}
            handleSnackBarClose = {this.handleSnackBarClose}
          /> } */}

          <Dialog
            open={this.state.open}
            onClose={this.handleOnClose}
          >
            <DialogTitle>Check out to production</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure to produce this formula?
              </DialogContentText>
              <Paper>
                <Grid
                  rows={this.state.formulaRows}
                  columns={this.state.formulaColumns}
                >
                  <Table/>
                  <TableHeaderRow />
                </Grid>
              </Paper>
              <Divider />
              <Paper>
                <TextField
                  required
                  autoFocus
                  margin="dense"
                  id="quantity"
                  label="Enter Quantity"
                  value = {this.state.addedQuantity}
                  fullWidth = {false}
                  onChange={(event) => this.handleFormulaQuantity(event)}
                  // verticalSpacing= "desnse"
                  style={{
                  marginLeft: 20,
                  martginRight: 20
                  }}/>
              </Paper>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={this.cancelProduction}
                color="primary"
                component = {Link} to = "/formula"
                >Cancel</Button>
              <Button
                component = {Link} to = "/production-review"
                onClick={(event) => this.productionReview(event)} color="secondary">Add To Production</Button>
            </DialogActions>
          </Dialog>
      </Paper>
      <div style={styles.buttons}>
        {(this.state.ingredientsToOrder.length!=0) && (this.state.intermediates.length==0)&& <p><font size="5">You do not have enough ingredients. Order the difference?</font></p>}
        {(this.state.ingredientsToOrder.length!=0) && (this.state.intermediates.length!=0)&&
          <p><font size="5">
            {"Please go BACK to Formulas to produce the given intermediates: " + this.state.intermediates }</font></p>}
        {(this.state.ingredientsToOrder.length!=0) &&
          <Tooltip id="tooltip-bottom" title="Ingredients with additional amount > 0 added to cart " placement="bottom">
            <RaisedButton raised
                  color="primary"
                  // className=classes.button
                  disabled ={this.state.intermediates.length!=0}
                  style={styles.orderIngredientsButton}
                  onClick = {(event) => this.addToShoppingCart(event)}
                  component = {Link} to = {{pathname: '/cart', state:{fromPR: true} }}
                  //component = {<Link to = {{pathname: '/cart', state:{fromPR: true} }}/>}
                  primary="true"> Order Ingredients </RaisedButton>
          </Tooltip> }
          {(this.state.ingredientsToOrder.length==0) &&
          <div>
            <p><font size="5">Select Production Line</font></p>
            <ProductionLinesTable hasProductionLines={()=>{this.setState({hasProductionLines: false});}} productionLinesArray={this.state.formulaRows[0].productionLinesArray} handleChange={this.selectProductionLine}/>
            <br/>
          </div>
          }
          {(!this.state.hasProductionLines) && (this.state.ingredientsToOrder.length==0) && <p><font size="5">There are no available production lines.</font></p>}
          {(this.state.ingredientsToOrder.length==0) && (this.state.hasProductionLines) &&
            <Tooltip id="tooltip-bottom" title="Send formula to production" placement="bottom">
              <RaisedButton raised
                    color="primary"
                    // className=classes.button
                    disabled = {this.state.selectedProductionLine == ''}
                    style={styles.orderIngredientsButton}
                    onClick = {(event) => this.checkOutFormulaFinal(event)}
                    // component = {Link} to = {this.state.afterLink}
                    primary="true">Send to production</RaisedButton>
            </Tooltip>}
        <RaisedButton color="default"
        raised
          component={Link} to='/formula'
          style = {{marginLeft: 10}}
          > BACK </RaisedButton>
      <br/>
      <br/>
      <br/>
      <br/>
     </div>
   </div>
    );
  }
}

export default ProductionReview;
