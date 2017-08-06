import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { Text } from 'native-base';

const moment = require('moment');

class TimeSince extends Component {
    constructor(props) {
        super(props);
        this.state = {
            timeString: moment(props.timestamp).fromNow()
        };
    }

    componentDidMount() {
        this.timerUpdate = setInterval(() => {
            this.setState({ timeString: moment(this.props.timestamp).fromNow() });
        }, 1000 * 60);
    }

    componentWillUnmount() {
        if (this.timerUpdate) {
            clearInterval(this.timerUpdate);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.timeString == nextState.timeString) {
            return false;
        }
        return true;
    }

    render() {
        return <Text note>Last taken {this.state.timeString}</Text>;
    }
}

TimeSince.PropTypes = {
    timestamp: PropTypes.number.isRequired
};

export default TimeSince;
