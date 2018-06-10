import React, {Component} from 'react';

import * as dates from './Dates.js';

class TableRow extends Component {
    render() {
        var {data, month} = this.props;

        var row = data.map((item) => <tr key={item.id}>
            <td>
                {item.description}
            </td>
            <td
                className={item.amount == 0.00
                ? "text-orange"
                : item.amount > 0
                    ? "text-green"
                    : "text-red"}>{(item.amount / parseFloat(dates.getNumberOfDaysForMonth(month))).toFixed(2)}</td>
	    <td
                className={item.amount == 0.00
                ? "text-orange"
                : item.amount > 0
                    ? "text-green"
                    : "text-red"}>{(item.amount / 7).toFixed(2)}</td>	
	    <td onChange={this.calculateAndShowTotals}
                className={item.amount == 0.00
                ? "text-orange"
                : item.amount > 0
                    ? "text-green"
                    : "text-red"}>{(parseFloat(item.amount)).toFixed(2)}</td>
        </tr>);

        return (
            <tbody>{row}</tbody>
        );
    }
}

class ThreeColumnTable extends Component {
    render() {
        return (
            <table className="table">
                <thead>
                    <tr>
                        <td>
                            <strong>Description</strong>
                        </td>
                        <td>
                            <strong>Daily/{this.props.currency}</strong>
                        </td>
                        <td>
                            <strong>Weekly/{this.props.currency}</strong>
                        </td>
			<td>
                            <strong>Monthly/{this.props.currency}</strong>
                        </td>
                    </tr>
                </thead>
                <TableRow
                    data={this.props.data}
                    currency={this.props.currency}
		    month={this.props.month}/>
            </table>
        );
    }
}

class MonthlyFixedTransactionTable extends Component {
    render() {
        return (
            <div>
                <ThreeColumnTable data={this.props.totals} currency={this.props.currency} month={this.props.month}/>
            </div>
        );
    }
}

export default MonthlyFixedTransactionTable;
