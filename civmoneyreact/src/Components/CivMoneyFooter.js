import React, {Component} from 'react';

import * as dates from './Dates.js';

class CivMoneyFooter extends Component {
    render() {
        return (
            <div className="footer fixed-bottom">
                <a
                    href="https://github.com/VampSlayer/CivMoney"
                    style={{
                    color: 'white'
                }}>CivMoney
                </a>&nbsp;&copy;&nbsp;{dates.getTodaysYear()}
            </div>
        );
    }
}

export default CivMoneyFooter;
