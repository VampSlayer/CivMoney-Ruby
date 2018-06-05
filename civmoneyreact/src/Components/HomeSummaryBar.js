import React, {Component} from 'react';

import * as dates from './Dates.js';
import * as rounding from './Rounding.js';

import Total from './Total';

class HomeSummaryBar extends Component {
  constructor() {
    super();
    this.state = {
      todaysDate: ''
    }
  }

  compomentWillMount() {
    this.setState({
      todaysDate: dates.getTodaysFullDateDots()
    });
  }

  componentDidMount() {
    this.setState({
      todaysDate: dates.getTodaysFullDateDots()
    });
  }

  render() {
    var today = 'Today : ' + this.state.todaysDate;
    return (
      <div>
        <br/>
        <div className="panel-black panel-default panel-heading text-center homeSummary">
          <Total
            period={today}
            total={this.props.totals.today === null
            ? '0'
            : rounding.round2Dp(this.props.totals.today)}
            currency={this.props.currency}/>
          <Total
            period={'Week'}
            total={this.props.totals.week === null
            ? '0'
            : rounding.round2Dp(this.props.totals.week)}
            currency={this.props.currency}/>
          <Total
            period={'Month'}
            total={this.props.totals.month === null
            ? '0'
            : rounding.round2Dp(this.props.totals.month)}
            currency={this.props.currency}/>
        </div>
      </div>
    );
  }
}

export default HomeSummaryBar;
