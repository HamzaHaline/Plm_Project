import React, {Component} from 'react';
import Card, {CardActions, CardHeader, CardMedia} from 'material-ui/Card';
import Button from 'material-ui/Button';
//import WelcomeImage from './box_of_veggie.jpg';
//import Typography from 'material-ui/Typography';
import * as cardConstants from  './constants.js';
//axios interface
import * as ingredientInterface from '../../../interface/ingredientInterface'
import * as userInterface from '../../../interface/userInterface'
import * as vendorInterface from '../../../interface/vendorInterface'
//dummy data for testing
import * as dummyIngredient from '../../../dummyDatas/ingredient'
import * as dummyUser from '../../../dummyDatas/user'
import * as dummyVendor from '../../../dummyDatas/vendor'
//for testing purposes only, hard coded Id from looking in the database
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
//import classnames from 'classnames';
// const ingredientId = '5a6e2b65d141d5472554fc51';
// const userId = '5a6e2f9b1c2c30482e142ddf';
// const vendorId = '5a6e333f0c569f48f7d22242';
// const sessionId = 'real-producers-root'; //back-door
//


const styles = theme => ({
  card: {
    maxWidth: 1600,
  },
  media: {
    height: 1000,
  },
});

/* What is originally inside <CardActions> for testing */
/*
            <Button onClick={()=>ingredientInterface.addIngredient(
              dummyIngredient.sampleIngredient.name, dummyIngredient.sampleIngredient.package,
              dummyIngredient.sampleIngredient.temperatureZone, dummyIngredient.sampleIngredient.vendors,
              sessionId)}>
                {cardConstants.ADD_INGREDIENTS}
            </Button>

            <Button onClick={()=>userInterface.addUser(
              dummyUser.sampleUser.email, dummyUser.sampleUser.username,
              dummyUser.sampleUser.password, dummyUser.sampleUser.isAdmin,
              dummyUser.sampleUser.loggedIn, sessionId
              )}>
                Add User
            </Button>

            <Button onClick={()=>vendorInterface.addVendor(
              dummyVendor.sampleVendor.name, dummyVendor.sampleVendor.contact,
              dummyVendor.sampleVendor.code, dummyVendor.sampleVendor.ingredients,
              sessionId)}>
                Add Vendor
            </Button>

            <Button onClick={()=>vendorInterface.getAllVendorsAsync(sessionId)}>
              All vendors
            </Button>

            <Button onClick={()=>vendorInterface.getVendorAsync(vendorId,sessionId)}>
              Get One Vendor
            </Button>

            <Button onClick={()=>vendorInterface.updateVendor(vendorId, dummyVendor.updatedVendor, sessionId)}>
              Update Vendor
            </Button>

            <Button onClick={()=>vendorInterface.deleteVendor(vendorId, sessionId)}>
              Delete Vendor
            </Button>

            <Button onClick={()=>alert("02/03/2018")}>
              Alert
            </Button>

            <Button onClick={()=>ingredientInterface.getAllIngredientsAsync(sessionId)}>
              All ingredients
            </Button>

            <Button onClick={()=>ingredientInterface.getIngredientAsync(ingredientId, sessionId)}>
              Get One Ingredient
            </Button>
            <Button onClick={()=>ingredientInterface.updateIngredient(ingredientId, dummyIngredient.updatedIngredient, sessionId)}>
              Update Ingredient
            </Button>

            <Button onClick={()=>ingredientInterface.deleteIngredient(ingredientId, sessionId)}>
              Delete Ingredient
            </Button>

            <Button onClick={()=>userInterface.getAllUsersAsync(sessionId)}>
              All Users
            </Button>

            <Button onClick={()=>userInterface.getUserAsync(userId, sessionId)}>
              Get One User
            </Button>

            <Button onClick={()=>userInterface.updateUser(userId, dummyUser.updatedUser, sessionId)}>
              Update User
            </Button>

            <Button onClick={()=>userInterface.deleteUser(userId, sessionId)}>
              Delete User
            </Button>
*/


class TestingCard extends Component {

  render() {
     const { classes } = this.props;

    return (
      <div>
        <Card className={classes.card}>
          <CardHeader title={'Welcome to the world of FOOD, '+JSON.parse(sessionStorage.getItem('user')).username+'!'}/>
          <CardMedia className={classes.media} image="/box_of_veggie.jpg"/>
          <CardActions >

          </CardActions>
        </Card>
      </div>
    );
  }
}

TestingCard.propTypes = {
  classes: PropTypes.object.isRequired,
};
//{cardConstants.WELCOME_MESSAGE}
export default withStyles(styles)(TestingCard);
