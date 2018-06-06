import React, {Component} from 'react';

import $ from 'jquery';

import * as url from './Url.js';
import * as dates from './Dates.js';

class TableRow extends Component {
    constructor() {
        super();
        this.delete = this
            .delete
            .bind(this);
    }

    delete(id) {
        this
            .props
            .onDelete(id);
    }

    render() {
        var {data} = this.props;

        var row = data.map((item) => <tr key={item.id}>
            <td>
                {dates.toLocaleDate(item.date)}
            </td>
            <td
                className={item.amount == 0.0
                ? "text-orange"
                : item.amount > 0
                    ? "text-green"
                    : "text-red"}>{item.amount}</td>
            <td >{item.description}</td>
            <td>
                <button onClick={() => this.props.onDelete(item.id)} className="btn btn-danger">Delete</button>
            </td>
        </tr>);
        return (
            <tbody>{row}</tbody>
        );
    }
}

class ManageTable extends Component {

    render() {
        return (
            <table className="table">
                <thead>
                    <tr>
                        <td>
                            <strong>Date</strong>
                        </td>
                        <td>
                            <strong>Amount/{this.props.currency}</strong>
                        </td>
                        <td>
                            <strong>Description</strong>
                        </td>
                        <td>
                            <button onClick={() => this.props.deleteAll(this.props.totals)} className="btn btn-danger">Delete All</button>
                        </td>
                    </tr>
                </thead>
                <TableRow
                    data={this.props.totals}
                    currency={this.props.currency}
                    onDelete={this.props.delete}/>
            </table>
        );
    }
}

export default ManageTable;
