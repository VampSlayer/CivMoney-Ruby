import React, {Component} from 'react';

import TimeViewTable from './TimeViewTable';

class WeekView extends Component {

    render() {
        var headingTwo = 'Amount/' + this.props.currency;
        return (
            <div>
		<TimeViewTable
                  currency={this.props.currency}
                  headingOne={'Week'}
                  headingTwo={headingTwo}
                  totals={this.props.weeksTotals}/>
            </div>
        );
    }
}

export default WeekView;
