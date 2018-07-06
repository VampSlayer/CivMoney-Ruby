import React, { Component } from 'react';

import Slider, { Range } from 'rc-slider';

import 'rc-slider/assets/index.css';

class HomeMonthSelectBar extends Component {

	render() {
		return (
			<div align="center" className="panel-black panel-default panel-heading panel-slider">
				<Slider className="sliderCustom"
					min={1}
					max={12}
					step={1}
					tooltip={false}
					marks={{ 1: "January", 2: "Febuary", 3: "March", 4: "April", 5: "May", 6: "June", 7: "July", 8: "August", 9: "September", 10: "October", 11: "November", 12: "December" }}
					value={this.props.month}
					orientation="horizontal"
					onChange={this.props.handleOnSliderChange}
					included={false} />
			</div>
		);
	}
}

export default HomeMonthSelectBar;
