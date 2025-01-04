// recallReport.js
import React from 'react';
import Paper from 'material-ui/Paper';

//local import
import IngredientSelection from './recallReportComponents/ingredientSelection.js'
import VendorSelection from './recallReportComponents/vendorSelection.js'
import LotSelection from './recallReportComponents/lotSelection.js'
import RecallTable from './recallReportComponents/recallTable.js'
import * as IngredientInterface from '../../../interface/ingredientInterface';
import { ToastContainer, toast } from 'react-toastify';
// import * as IngredientLotInterface from '../../interface/ingredientLotInterface';
// globals
var sessionId = "";
var lotsNeedToBeRecalled = [];
var idOfLotsAlreadyConsidered = [];
//
export default class RecallReport extends React.PureComponent{
	constructor(props){
		super(props); //required
		this.state = {
			//don't change these
			availableIngredientObjects:[],
			ingredientLabelValuePairs: [],
			//okay to change these
			selectedIngredientName: null,
			selectedIngredientObject: null,
			ingredientIsIntermediate: false,
			selectedVendor: null,
			vendorLabelValuePairs: [],
			lotLabelValuePairs:[],
			availableLotObjects:[],
			lotNumber: null,
			//for bfs purposes
			recalledLots:[],
			//for displaying the recall table
			recallDataReady:false,
		}
		//bind functions
		this.fetchAvailableIngredients = this.fetchAvailableIngredients.bind(this);
		this.selectIngredient = this.selectIngredient.bind(this);
		this.findSelectedIngredientObject = this.findSelectedIngredientObject.bind(this);
		this.getVendorLabelValuePairs = this.getVendorLabelValuePairs.bind(this);
		this.setVendor = this.setVendor.bind(this);
		this.skipVendor = this.skipVendor.bind(this);
		this.getLotInfo = this.getLotInfo.bind(this);
		this.filterLotsBasedOnVendorName = this.filterLotsBasedOnVendorName.bind(this);
		this.setLot = this.setLot.bind(this);
		this.fetchRecall = this.fetchRecall.bind(this);
		this.findIdOfLot = this.findIdOfLot.bind(this);

	}

	async componentDidMount(){
		this.fetchSessionId();
		await this.fetchAvailableIngredients();
	}

	fetchSessionId(){
		sessionId = JSON.parse(sessionStorage.getItem('user'))._id;
		console.log("sessionId: " + sessionId);
	}

	async fetchAvailableIngredients(){
  		const response = await IngredientInterface.getAllIngredientsAsync(sessionId);
  		console.log("response:")
  		console.log(response);
  		const ingredients = response;
  		this.setState({
			availableIngredientObjects: ingredients,
		});
  		console.log("ingredients")
  		console.log(ingredients);
  		console.log("this.state.availableIngredientObjects:");
  		console.log(this.state.availableIngredientObjects);

  		var labelValuePairs = ingredients.map(ingredientObject => ({
  			value: ingredientObject.name,
  			label: ingredientObject.name,
		}));

  		this.setState({
			ingredientLabelValuePairs: labelValuePairs,
		});

		console.log("this.state.ingredientLabelValuePairs");
		console.log(this.state.ingredientLabelValuePairs);
  	}

	selectIngredient(name){
		if(name === this.state.selectedIngredientName) return;//do nothing if it has not been changed
		console.log("Changing selectedIngredientName from " + this.state.selectedIngredientName +
			" to " + name);
		if(!name){ //name is null, reinitialize the state
			this.setState({
				selectedIngredientName: null,
				selectedIngredientObject: null,
				selectedVendor: null,
				vendorLabelValuePairs: [],
				lotLabelValuePairs:[],
				availableLotObjects:[],
				lotNumber: null,
				recallDataReady:false,

			});
			return;
		}
		//name is not null
		const selectedIngredientObject = this.findSelectedIngredientObject(name);
		if(!selectedIngredientObject) {
			toast.error("An error has occured! No ingredient object exists for the selected name "
				+ name);
			return;
		}
		// selectedIngredientObject is not null
		const vendorLabelValuePairs = this.getVendorLabelValuePairs(selectedIngredientObject);
		console.log("vendorLabelValuePairs");
		console.log(vendorLabelValuePairs);

		this.setState({
			selectedIngredientName: name,
			selectedIngredientObject: selectedIngredientObject,
			ingredientIsIntermediate: selectedIngredientObject.isIntermediate,
			selectedVendor: null,
			vendorLabelValuePairs: vendorLabelValuePairs,
			lotLabelValuePairs:[],
			availableLotObjects:[],
			lotNumber: null,
			recallDataReady:false,
		});
		if(selectedIngredientObject.isIntermediate){
			this.skipVendor(selectedIngredientObject);
		}

	}

	findSelectedIngredientObject(selectedIngredientName){
		if (!this.state.availableIngredientObjects) return null;
		for (var i = 0; i < this.state.availableIngredientObjects.length; i++) {
      		if (this.state.availableIngredientObjects[i].name === selectedIngredientName){
      			console.log("Found an ingredient with name " + selectedIngredientName);
      			console.log(this.state.availableIngredientObjects[i]);
      			return this.state.availableIngredientObjects[i];
      		}
    	}
    	return null;
	}

	getVendorLabelValuePairs(selectedIngredientObject){
		console.log("Entered getVendorLabelValuePairs");
		console.log("selectedIngredientObject");
		console.log(selectedIngredientObject);
		if(!selectedIngredientObject) return;
		const vendors = selectedIngredientObject.vendors;
		console.log("vendors of the selected ingredient");
		console.log(vendors);
		var intermediateData = [];
		if (vendors){
			for(var i = 0; i < vendors.length; i++){
				intermediateData.push(vendors[i].vendorName);
			}
		}
		console.log("intermediateData");
		console.log(intermediateData);
		var vendorLabelPairs = intermediateData.map(vendorName => ({
			value: vendorName,
			label: vendorName
		}));
		console.log("vendorLabelPairs");
		console.log(vendorLabelPairs);
		return vendorLabelPairs;

	}

	async setVendor(vendorName){
		if(vendorName === this.state.selectedVendor) return; //do nothing if it has not been changed
		//get lot information from backend
		const arrayOfLots = await this.getLotInfo();
		const filteredLots = this.filterLotsBasedOnVendorName(arrayOfLots, vendorName);

		//added by charlie
		var tempArr = [];
		for (var i = 0; i < filteredLots.length; i++){
		    var flag = false;
		    for (var j = 0; j < tempArr.length; j++){
		        if (tempArr[j].lotNumber === filteredLots[i].lotNumber){
		            flag = true;
		        }
		    }
		    if (!flag) tempArr.push(filteredLots[i]);
		}

		//

		const possibleLotNumbers = tempArr.map(lotObject => (lotObject.lotNumber))
		const labelValuePairs = possibleLotNumbers.map(lotNumber => ({
			value: lotNumber,
			label: lotNumber
		}));
		console.log("possibleLotNumbers:");
		console.log(possibleLotNumbers);
		console.log("labelValuePairs");
		console.log(labelValuePairs);
		this.setState({
			selectedVendor: vendorName,
			lotLabelValuePairs:labelValuePairs,
			availableLotObjects:filteredLots,
			lotNumber: null,
			recallDataReady:false,
		})
	}

	async skipVendor(selectedIngredientObject){
		const arrayOfLots = await this.getLotInfoFromObject(selectedIngredientObject);
		//added by charlie
        var tempArr = [];
        for (var i = 0; i < arrayOfLots.length; i++){
            var flag = false;
            for (var j = 0; j < tempArr.length; j++){
                if (tempArr[j].lotNumber === arrayOfLots[i].lotNumber){
                    flag = true;
                }
            }
            if (!flag) tempArr.push(arrayOfLots[i]);
        }

		const possibleLotNumbers = tempArr.map(lotObject => (lotObject.lotNumber))
		const labelValuePairs = possibleLotNumbers.map(lotNumber => ({
			value: lotNumber,
			label: lotNumber
		}));
		console.log("possibleLotNumbers:");
		console.log(possibleLotNumbers);
		console.log("labelValuePairs");
		console.log(labelValuePairs);
		this.setState({
			lotLabelValuePairs:labelValuePairs,
			availableLotObjects:arrayOfLots,
			lotNumber: null,
			recallDataReady:false,
		})
	}

	async getLotInfo(){
		console.log(this.state.selectedIngredientObject);
		const ingredientId = this.state.selectedIngredientObject._id;
		const response = await IngredientInterface.getAllPRLotNumbersAsync(ingredientId, sessionId);
		console.log('response');
		console.log(response);
		const arrayOfLots = response.data;
		console.log("arrayOfLots");
		console.log(arrayOfLots);
		return arrayOfLots;
	}

	async getLotInfoFromObject(selectedIngredientObject){
		console.log(selectedIngredientObject);
		const ingredientId = selectedIngredientObject._id;
		const response = await IngredientInterface.getAllPRLotNumbersAsync(ingredientId, sessionId);
		console.log('response');
		console.log(response);
		const arrayOfLots = response.data;
		console.log("arrayOfLots");
		console.log(arrayOfLots);
		return arrayOfLots;
	}

	filterLotsBasedOnVendorName(arrayOfLots, vendorName){
		var filteredArray = [];
		console.log("Entered filterLotsBasedOnVendorName()")
		if(arrayOfLots){
			for(var i = 0; i < arrayOfLots.length; i++){
				const lot = arrayOfLots[i];
				if(lot.vendorNameUnique === vendorName.toLowerCase()){
					console.log("adding lot ");
					console.log(lot);
					filteredArray.push(lot);
				}
			}
		}

		console.log("Filtered array:");
		console.log(filteredArray);

		return filteredArray;
	}




	setLot(lotNumber){
		if(lotNumber === this.state.lotNumber) return; //do nothing if it has not been changed
		this.setState({
			lotNumber: lotNumber,
			recallDataReady:false,
		});
		const lotId = this.findIdOfLot(lotNumber);
		console.log("id of this lot is " + lotId);
		if (lotId){
			this.fetchRecall(lotId);
		}

	}

	findIdOfLot(lotNumber){
		if (!this.state.availableLotObjects) return null;
		for (var i = 0; i < this.state.availableLotObjects.length; i++) {
      		if (this.state.availableLotObjects[i].lotNumber === lotNumber){
      			console.log("Found an lot with lot number " + lotNumber);
      			console.log(this.state.availableLotObjects[i]);
      			return this.state.availableLotObjects[i].lotId;
      		}
    	}
    	return null;
	}
	//Given the id of a particular lot in the back-end, get everything that is made either directly
	//or indirectly from it
	async fetchRecall(lotId){
		//reinitialize globals
		lotsNeedToBeRecalled = [];
		idOfLotsAlreadyConsidered = [];
		console.log("Tracing recall based on lot with id:")
		console.log(lotId);
		const response = await IngredientInterface.getRecallAsync(lotId, sessionId);
		console.log("response for getRecallAsync");
		console.log(response);
		const araryOfRecalledLots = response.data;
		console.log("araryOfRecalledLots");
		console.log(araryOfRecalledLots);
		// do dfs
		var frontier = araryOfRecalledLots ? araryOfRecalledLots : [];
		console.log("initial frontier:");
		console.log(frontier);
		// this.setState({
		// 	lotsNeedToBeExamined: frontier,
		// });
		var numberOfIterations = 0;
		console.log("Finding Recall Recursively");
		while(frontier.length > 0){
			console.log("Interation " + numberOfIterations);
			var currentLot = frontier.pop();
			console.log("currentLot:");
			console.log(currentLot);
			var currentLotId = currentLot.productName;//use productName to identify
			console.log("currentLotId:");
			console.log(currentLotId);
			console.log("idOfLotsAlreadyConsidered");
			console.log(idOfLotsAlreadyConsidered);
			if(idOfLotsAlreadyConsidered.includes(currentLotId)) {
				console.log("skipping the lot");
				continue; //do not consider repeated elements
			}
			lotsNeedToBeRecalled = lotsNeedToBeRecalled.concat(currentLot);

			idOfLotsAlreadyConsidered.push(currentLotId);
			const lotNumberofNextIngredient = currentLot.lotNumberProduct;
			const nameOfNextIngredient = currentLot.productName;
			const vendorName = "null";
			console.log("Requesting recall based on the following parameters: \n" + 
				"lot number: " + lotNumberofNextIngredient + "\n" +
				"name of ingredient: " + nameOfNextIngredient + "\n" +
				"vendor name: " + vendorName );
			const responseRecurse = await IngredientInterface.getRecallAlternateAsync(lotNumberofNextIngredient, nameOfNextIngredient, vendorName, sessionId);
			console.log("responseRecurse");
			console.log(responseRecurse);
			const araryOfRecalledLotsRecurse = responseRecurse.data;
			console.log("araryOfRecalledLotsRecurse");
			console.log(araryOfRecalledLotsRecurse);
			frontier = frontier.concat(araryOfRecalledLotsRecurse);
			console.log("frontier:");
			console.log(frontier);
			numberOfIterations++;
		}

		console.log("lotsNeedToBeRecalled:");
		console.log(lotsNeedToBeRecalled);

		this.setState({
			recalledLots: lotsNeedToBeRecalled,
			recallDataReady:true,
		});


	}

	render() {
		const {selectedIngredientName, selectedIngredientObject, selectedVendor, lotNumber,
			vendorLabelValuePairs, lotLabelValuePairs, ingredientLabelValuePairs,
			ingredientIsIntermediate, recallDataReady, recalledLots} = this.state;
		return (
			<Paper>
			{/*
			<p> ingredient name is {selectedIngredientName}</p>
			{selectedIngredientObject && <p> ingredient id is {selectedIngredientObject._id} </p>}
			{selectedIngredientName && <p> selectedVendor is {selectedVendor} </p>}
			{selectedIngredientName && (selectedVendor || ingredientIsIntermediate) && <p> lot number is {lotNumber} </p>}
			*/}
			<IngredientSelection
				setIngredient={this.selectIngredient}
				ingredientLabelValuePairs={ingredientLabelValuePairs}
			/>
			{
				selectedIngredientName &&
				!ingredientIsIntermediate &&
				<VendorSelection
					vendorLabelValuePairs={vendorLabelValuePairs}
					setVendor={this.setVendor}
				/>
			}
			{
				selectedIngredientName &&
				(selectedVendor || ingredientIsIntermediate) &&
				<LotSelection
					lotLabelValuePairs={lotLabelValuePairs}
					setLot={this.setLot}
				/>

			}
			{
				recallDataReady &&
				<div>
				{false && <p> Recall Data Ready! </p>}
				<RecallTable
					recallData={recalledLots}
				/>
				</div>

			}
			</Paper>
		)
	}
}
