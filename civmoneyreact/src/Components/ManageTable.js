import React, {Component} from 'react';
import $ from 'jquery';
import * as url from './Url.js';

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
                {item.date}
            </td>
            <td
                className={item.amount === '0.0' || item.amount === '0'
                ? "text-orange"
                : item.amount > 0
                    ? "text-green"
                    : "text-red"}>{item.amount}</td>
            <td >{item.description}</td>
            <td>
                <button onClick={() => this.delete(item.id)} className="btn btn-danger">Delete</button>
            </td>
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
        this.deleteAll = this
            .deleteAll
            .bind(this);
        this.delete = this
            .delete
            .bind(this);
    }

    delete(id) {
        $.ajax({
            type: "post",
            url: url.GetBaseurl() + '/transactions/delete?[id]=' + id,
            async: true,
            xhrFields: {
                withCredentials: true
            },
            success: function () {
                for (var i = 0; i < this.state.transactions.length; i++) {
                    if (this.state.transactions[i].id === id) {
                        var newTransactions = this.state.transactions;
                        newTransactions.splice(i, 1);
                        this.setState({transactions: newTransactions});
                    }
                }
            }.bind(this),
            error: function (xhr, status, error) {
                console.log(xhr.status);
            }
        });
    }

    deleteAll() {
        for (var i = 0; i < this.state.transactions.length; i++) {
            $.ajax({
                type: "post",
                url: url.GetBaseurl() + '/transactions/delete?[id]=' + this.state.transactions[i].id,
                async: true,
                xhrFields: {
                    withCredentials: true
                },
                success: function (data) {
                    this.setState({transactions: []});
                }.bind(this),
                error: function (xhr, status, error) {
                    console.log(xhr.status);
                }
            });
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
                            <strong>Date</strong>
                        </td>
                        <td>
                            <strong>Amount/{this.props.currency}</strong>
                        </td>
                        <td>
                            <strong>Description</strong>
                        </td>
                        <td>
                            <button onClick={this.deleteAll} className="btn btn-danger">Delete All</button>
                        </td>
                    </tr>
                </thead>
                <TableRow
                    data={this.state.transactions}
                    currency={this.props.currency}
                    onDelete={this.delete}/>
            </table>
        );
    }
}

class ManageTable extends Component {
    render() {
        return (
            <div className="panel-body">
                <ThreeColumnTable data={this.props.totals} currency={this.props.currency}/>
            </div>
        );
    }
}

export default ManageTable;
