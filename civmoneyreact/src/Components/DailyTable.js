import React, {Component} from 'react';

import $ from 'jquery';

import * as url from './Url.js';

class TableRow extends Component {
  render() {
    const {data} = this.props;

    const row = data.map((data) => <tr key={data.id}>
      <td>{data.description}</td>
      <td
        className={data.amount === '0.0' || data.amount === '0'
        ? "text-orange"
        : data.amount > 0
          ? "text-green"
          : "text-red"}>{data.amount}</td>
    </tr>);

    return (
      <tbody>{row}</tbody>
    );
  }
}

class TwoColumnTable extends Component {
  render() {
    return (
      <table className="daily-table">
        <thead>
	  <tr><th className="text-center" colSpan="2"><strong>{this.props.date + " : Total "} 
		<span className={this.props.total === '0.0' || this.props.total === '0'
        ? "text-orange"
        : this.props.total > 0
          ? "text-green"
          : "text-red"}>{this.props.total}</span> {this.props.currency}
	  </strong></th></tr>
          <tr>
            <td>
              <strong>{this.props.headingOne}</strong>
            </td>
            <td>
              <strong>{"Amount/" + this.props.currency}</strong>
            </td>
          </tr>
        </thead>
        <TableRow data={this.props.data}/>
      </table>
    );
  }
}

class DailyTable extends Component {

  render() {
    return (
      <div>
        <TwoColumnTable
          data={this.props.transactions}
          headingOne={"Description"}
          currency={this.props.currency}
	  date={this.props.date}
	  total={this.props.total} />
      </div>
    );
  }
}

export default DailyTable;
