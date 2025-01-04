// lotSelection.js

import React from 'react';
import createClass from 'create-react-class';
import PropTypes from 'prop-types';
import Select from 'react-select';

export default class LotSelection extends React.PureComponent{
	constructor(props){
		super(props);
		this.state = {
			//for select
			searchable: false,
			clearable: true,
			rtl: false,
			value: null,
			//
			lots: props.lotLabelValuePairs,

		}
		//binding functions
		this.updateValue = this.updateValue.bind(this);
		this.setLot = props.setLot;
	}

	componentDidMount(){
		console.log("lots:");
		console.log(this.state.lots);
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps.lotLabelValuePairs == this.state.lots) return;

  		this.setState({ 
  			lots: nextProps.lotLabelValuePairs,
  			value: null,
  		});  
	}

	updateValue (newValue) {
		this.setState({
			value: newValue,
		});
		console.log(newValue);
		this.setLot(newValue);
	}

	

	render() {
		const {lots} = this.state;

		return (
			<div>
			{/*<p> This is lot selection </p>*/}
			<Select
				options={lots}
				simpleValue
				clearable={this.state.clearable}
				name="selected-state"
				value={this.state.value}
				onChange={this.updateValue}
				rtl={this.state.rtl}
				searchable={this.state.searchable}
				placeholder="Select Lot Number..."
			/>
			{/*<p> Here ends lot selection </p>*/}
			</div>
		)
	}

}