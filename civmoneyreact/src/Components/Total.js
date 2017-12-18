import React, { Component } from 'react';

class Total extends Component {
  render() {
    return (
      <span>
		{this.props.period}
		&nbsp;:&nbsp;
		<span className={this.props.total === '0.0' || this.props.total === '0' ? "text-orange" : this.props.total > 0 ? "text-green" : "text-red"}>
			{this.props.total}
		</span>
		&nbsp;{this.props.currency}&nbsp;
      </span>
    );
  }
}

export default Total;
