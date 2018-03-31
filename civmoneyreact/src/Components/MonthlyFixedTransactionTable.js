import React, {Component} from 'react';

import * as dates from './Dates.js';

class TableRow extends Component {
    render() {
        var {data} = this.props;

        var row = data.map((item) => <tr key={item.id}>
            <td>
                {item.description}
            </td>
            <td
                className={item.amount === '0.0' || item.amount === '0' || item.amount === 0
                ? "text-orange"
                : item.amount > 0
                    ? "text-green"
                    : "text-red"}>{(item.amount / parseFloat(dates.getNumberOfDaysThisMonth())).toFixed(2)}</td>
	    <td
                className={item.amount === '0.0' || item.amount === '0' || item.amount === 0
                ? "text-orange"
                : item.amount > 0
                    ? "text-green"
                    : "text-red"}>{(item.amount / 7).toFixed(2)}</td>	
	    <td onChange={this.calculateAndShowTotals}
                className={item.amount === '0.0' || item.amount === '0' || item.amount === 0
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
    constructor() {
        super();
        this.state = {
            transactions: []
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({transactions: nextProps.data});
    }

    compomentWillMount() {
        this.setState({transactions: this.props.data});
    }

    componentDidMount() {
        this.setState({transactions: this.props.data});
    }

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
                    data={this.state.transactions}
                    currency={this.props.currency}/>
            </table>
        );
    }
}

class MonthlyFixedTransactionTable extends Component {
    render() {
        return (
            <div>
                <ThreeColumnTable data={this.props.totals} currency={this.props.currency}/>
            </div>
        );
    }
}

export default MonthlyFixedTransactionTable;
