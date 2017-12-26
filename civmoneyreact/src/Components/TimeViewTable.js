import React, {Component} from 'react';

class TableRow extends Component {
    render() {
        var {data} = this.props;
        var row;
        if (Array.isArray(data)) {
            row = data.map((item) => <tr key={item.date}>
                <td>
                    {item.date}
                </td>
                <td
                    className={item.amount === '0.0' || item.amount === '0'
                    ? "text-orange"
                    : item.amount > 0
                        ? "text-green"
                        : "text-red"}>{item.amount}</td>
            </tr>);
        }

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
                <TableRow data={this.props.data}/>
            </table>
        );
    }
}

class TimeViewTable extends Component {
    render() {
        return (
            <div>
                <div className="panel-body">
                    <TwoColumnTable
                        data={this.props.totals}
                        headingOne={this.props.headingOne}
                        headingTwo={this.props.headingTwo}/>
                </div>
            </div>
        );
    }
}

export default TimeViewTable;
