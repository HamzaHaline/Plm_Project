import React from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import WelcomeImage from './box_of_veggie.jpg';
import * as cardConstants from  './constants.js';
import logo from '../NavigationBar/grain1.png';
//axios interface
import * as ingredientInterface from '../../../interface/ingredientInterface'
import * as userInterface from '../../../interface/userInterface'
import * as vendorInterface from '../../../interface/vendorInterface'
//dummy data for testing
import * as dummyIngredient from '../../../dummyDatas/ingredient'
import * as dummyUser from '../../../dummyDatas/user'
import * as dummyVendor from '../../../dummyDatas/vendor'

//for testing purposes only, hard coded Id from looking in the database
const sessionId = 'real-producers-root'; //back-door
//
const WelcomeCard = () => (
  <Card>
    <CardHeader
      // title={cardConstants.CARD_HEADER}
      // avatar={logo}
    />
    <CardMedia
      overlay={<CardTitle title= {cardConstants.WELCOME_MESSAGE} />}
    >
      <img src={WelcomeImage}/>
    </CardMedia>

    <CardActions>
      <FlatButton label={cardConstants.ADD_INGREDIENTS} onClick={()=>ingredientInterface.addIngredient(
        dummyIngredient.sampleIngredient.name, dummyIngredient.sampleIngredient.package, 
        dummyIngredient.sampleIngredient.temperatureZone, dummyIngredient.sampleIngredient.vendors,
        sessionId)} />
      <FlatButton label="Add User" onClick={()=>userInterface.addUser(
        dummyUser.sampleUser.email, dummyUser.sampleUser.username,
        dummyUser.sampleUser.password, dummyUser.sampleUser.isAdmin,
        dummyUser.sampleUser.loggedIn, sessionId
        )} />
      <FlatButton label={cardConstants.ADD_VENDORS} onClick={()=>vendorInterface.addVendor(
        dummyVendor.sampleVendor.name, dummyVendor.sampleVendor.contact,
        dummyVendor.sampleVendor.code, dummyVendor.sampleVendor.ingredients,
        sessionId)} />

      <FlatButton label="All vendors" onClick={()=>vendorInterface.getAllVendorsAsync(sessionId)} />
      <FlatButton label="Get One Vendor" onClick={()=>vendorInterface.getVendorAsync(vendorId, sessionId)} />
      <FlatButton label="Update Vendor" onClick={()=>vendorInterface.updateVendor(vendorId, dummyVendor.updatedVendor, sessionId)} />
      <FlatButton label="Delete Vendor" onClick={()=>vendorInterface.deleteVendor(vendorId, sessionId)} />

      <FlatButton label="Alert" onClick={()=>alert("02/03/2018")} />

      <FlatButton label="All ingredients" onClick={()=>ingredientInterface.getAllIngredientsAsync(sessionId)} />
      <FlatButton label="Get One Ingredient" onClick={()=>ingredientInterface.getIngredientAsync(ingredientId, sessionId)} />
      <FlatButton label="Update Ingredient" onClick={()=>ingredientInterface.updateIngredient(ingredientId, dummyIngredient.updatedIngredient, sessionId)} />
      <FlatButton label="Delete Ingredient" onClick={()=>ingredientInterface.deleteIngredient(ingredientId, sessionId)} />

      <FlatButton label="All Users" onClick={()=>userInterface.getAllUsersAsync(sessionId)} />
      <FlatButton label="Get One User" onClick={()=>userInterface.getUserAsync(userId, sessionId)} />
      <FlatButton label="Update User" onClick={()=>userInterface.updateUser(userId, dummyUser.updatedUser, sessionId)} />
      <FlatButton label="Delete User" onClick={()=>userInterface.deleteUser(userId, sessionId)} />

    </CardActions>
  </Card>
);

export default WelcomeCard;
