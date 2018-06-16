import React, {Component} from 'react';

import Slider, { Range } from 'rc-slider';

import 'rc-slider/assets/index.css';

class HomeMonthSelectBar extends Component {

render() {
        return (
		<div className="panel-black panel-default panel-heading">
		    <label className="inline">Table
		      <input
		      type="radio"
		      value="Table"
                      checked={this.props.type === "Table"}
                      onChange={this.props.handleTypeChange}
		      name="type"/></label>
<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
		<Slider className="sliderCustom inline"
			min={1}
			max={12}
			step={1}
			tooltip={false}
			marks={{1:"January", 2:"Febuary", 3:"March", 4:"April", 5:"May", 6:"June", 7:"July", 8:"August", 9:"September", 10:"October", 11:"November", 12:"December"}}
			value={this.props.month}
			orientation="horizontal"
			onChange={this.props.handleOnSliderChange}
			included={false}
		      />
<span>&nbsp;&nbsp;</span>
		  <label className="inline">Graph
		      <input
		      type="radio"
		      name="type"
		      value="Graph"
		      checked={this.props.type === "Graph"}
		      onChange={this.props.handleTypeChange}/></label>
		</div>
        );
    }
}

export default HomeMonthSelectBar;
