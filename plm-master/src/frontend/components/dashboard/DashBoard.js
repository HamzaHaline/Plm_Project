import React, {Component} from 'react';
import TestingCard from './testing/TestingCard.js';

class Dashboard extends Component {
  
  constructor(props) {
    super(props)
    this.state = {
    };
  }

  render() {
    return (
    	<div>
        <TestingCard/>
      </div>
    );
  }
}

export default Dashboard