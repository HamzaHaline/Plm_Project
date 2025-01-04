// ingredientSelection.js
// adopted from https://github.com/JedWatson/react-select/blob/master/examples/src/components/Contributors.js
import React from 'react';
import createClass from 'create-react-class';
import PropTypes from 'prop-types';
//ui stuff
import Select from 'react-select';
//local imports
import * as IngredientInterface from '../../../../interface/ingredientInterface';

//globals
var sessionId = "";

const MAX_CONTRIBUTORS = 6;
const MAX_INGREDIENTS = 10;
const ASYNC_DELAY = 500;
//NOTE: this file is problematic since it does not follow standard of this.state.variable and setState().
// instead, it uses this.variable =
//this might cause unexpected bug
export default class IngredientSelection extends React.PureComponent{
	constructor(props){
		super(props);
		//setting up initial states
		this.state = {
			multi: false,
			value: null,
			availableIngredientLabelValuePair: props.ingredientLabelValuePairs,
			
		}
		//binding functions
		this.onChange = this.onChange.bind(this);
		
		this.getFilteredIngredients = this.getFilteredIngredients.bind(this);
		
		//functions from props
		this.setIngredient = this.props.setIngredient;
	}

	componentWillReceiveProps(nextProps) {
  		this.setState({ availableIngredientLabelValuePair: nextProps.ingredientLabelValuePairs });  
	}

	onChange (value) {
		this.setState({
			value: value,
		});
		console.log("Value of ingredient selection changed to");
		console.log(value);
		if(value){
			const ingredientName = value;
			this.setIngredient(ingredientName);
		} else {
			this.setIngredient(null);
		}
		
	}

	//dan methods
	fetchSessionId(){
		sessionId = JSON.parse(sessionStorage.getItem('user'))._id;
		console.log("sessionId: " + sessionId);
  	}



	async componentWillMount(){
		this.fetchSessionId();
		
	}

	getFilteredIngredients (input, callback) {	
		if(!this.state.availableIngredientLabelValuePair) {
			console.log("availableIngredientLabelValuePair has not been loaded yet")
			var data = {
				options: [],
				complete: true,
			};
			setTimeout(function() {
				callback(null, data);
			}, ASYNC_DELAY);
			return;
		}
		input = input.toLowerCase();
		console.log("availableIngredientLabelValuePair:");
		console.log(this.state.availableIngredientLabelValuePair);
		var options = this.state.availableIngredientLabelValuePair.filter(i => {
			return i.value.substr(0, input.length) === input;
		});
		console.log("options");
		console.log(options);
		var data = {
			options: options.slice(0, MAX_INGREDIENTS),
			complete: options.length <= MAX_INGREDIENTS,
		};
		setTimeout(function() {
			callback(null, data);
		}, ASYNC_DELAY);
	}
	//
	render () {
		const {availableIngredientLabelValuePair} = this.state;
		return (
			<div>
				{/*<h3 className="section-heading">{this.props.label}  <a href="https://github.com/JedWatson/react-select/tree/master/examples/src/components/Contributors.js">(Source)</a></h3>*/}
				<Select
					options={availableIngredientLabelValuePair}
					simpleValue
					clearable={this.state.clearable}
					name="selected-state"
					value={this.state.value}
					onChange={this.onChange} 
					searchable={this.state.searchable} 
					noResultsText="No results found"
					placeholder="Type to search for an ingredient or intermediate product"
				/>
			</div>
		);
	}
}