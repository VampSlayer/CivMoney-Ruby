import React, {Component} from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

import * as dates from './Dates.js';

import ChartCustomToolTip from './ChartCustomToolTip';


class SummaryChart extends Component {

formatDate(date){
return parseFloat(date.slice(-2));
}

  render() {
    const month = dates.getTodaysMonthName();
	const amountLabel = "Amount / " + this.props.currency;
	if(this.props.data !== undefined && this.props.data.length > 0){
    return (	
     <div>
        <div className="panel-black panel-default panel-heading text-center">
          <div className="text-center">{month}</div>
        </div>
	
	<div className="panel-size">
        <ResponsiveContainer width="100%" height="100%">
        <BarChart data={this.props.data}>
		  <ReferenceLine y={0} stroke="#ff8c00" strokeDasharray="3 3" />
		  <XAxis dataKey="date" tickFormatter={this.formatDate} stroke="#fff" label={{value: "Date", fill:"#fff", position:"insideBottom", offset:-5 }} />
		  <YAxis dataKey="amount" label={{value: amountLabel, angle: -90, fill:"#fff" }} stroke="#fff"/>
		  <Tooltip content={<ChartCustomToolTip currency={this.props.currency}/>}/>
		  <Bar dataKey="amount" fill="#000" />
		</BarChart>
	</ResponsiveContainer>
	</div>
      </div>);
}

    return null;
  }
}

export default SummaryChart;
