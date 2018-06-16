import React, {Component} from 'react';

import * as dates from './Dates.js';

import ReactHover from 'react-hover'
import DailyTableWrapper from './DailyTableWrapper';

const optionsCursorTrueWithMargin = {
  followCursor: true,
  shiftX: -25,
  shiftY: -100
}

class TableRow extends Component {
  render() {
    const {data, currency} = this.props;

    const row = data.map((data) => <tr
      key={dates.toLocaleDate(data.date)}>
      <td className={'dailyTableRow'}>
        <ReactHover options={optionsCursorTrueWithMargin}>
          <ReactHover.Trigger type='trigger'>
            <span>{dates.toLocaleDate(data.date)}</span>
          </ReactHover.Trigger>
          <ReactHover.Hover type='hover'>
            <DailyTableWrapper currency={currency} date={data.date} total={data.amount}/>
          </ReactHover.Hover>
        </ReactHover>
      </td>
      <td
        className={data.amount === 0.0 || data.amount === 0
        ? "text-orange"
        : data.amount > 0
          ? "text-green"
          : "text-red"}
        key={data.amount}>{data.amount}</td>
    </tr>);

    return (
      <tbody>{row}</tbody>
    );
  }
}

class TwoColumnTable extends Component {
  render() {
    return (
      <table className="table">
        <thead>
          <tr>
            <td>
              <strong>{this.props.headingOne}</strong>
            </td>
            <td>
              <strong>{this.props.headingTwo}</strong>
            </td>
          </tr>
        </thead>
        <TableRow data={this.props.data} currency={this.props.currency}/>
      </table>
    );
  }
}

class SummaryTable extends Component {
  render() {
    const month = dates.getTodaysMonthName();	
    var headingTwo = 'Total/' + this.props.currency;
    return (
        <div className="panel-body">
          <TwoColumnTable
            data={this.props.data}
            headingOne={'Amount'}
            headingTwo={headingTwo}
            currency={this.props.currency}/>
        </div>
    );
  }
}

export default SummaryTable;
