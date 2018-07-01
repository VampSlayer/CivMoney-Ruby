import React, {Component} from 'react';
import ReactHover from 'react-hover'

import * as dates from './Dates.js';
import * as url from './Url.js';
import * as rounding from './Rounding.js';

import $ from 'jquery';

import Total from './Total';
import WeekView from './WeekView';

const optionsCursorTrueWithMargin = {
  followCursor: true,
  shiftX: -200,
  shiftY: 10
}

class HomeSummaryBar extends Component {
  render() {
    var today = 'Today : ' + dates.toLocaleDate(dates.getTodaysFullDateDashes());
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
	<span className={'dailyTableRow'}>
	<ReactHover options={optionsCursorTrueWithMargin}>
          <ReactHover.Trigger type='trigger'>
            <Total
            period={dates.getMonthNameFromNumber(this.props.month)}
            total={this.props.totals.month === null
            ? '0'
            : rounding.round2Dp(this.props.totals.month)}
            currency={this.props.currency}/>
          </ReactHover.Trigger>
          <ReactHover.Hover type='hover'>
            <div className="weekly-table"><WeekView currency={this.props.currency} weeksTotals={this.props.weeksTotals} /></div>
          </ReactHover.Hover>
        </ReactHover>
	</span>
        </div>
      </div>
    );
  }
}

export default HomeSummaryBar;
