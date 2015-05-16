'use strict';

import React from 'react/addons';

import Icon from './Icon.js';

import VolumeStore from '../stores/VolumeStore.js';
import VolumeActions from '../actions/VolumeActions.js';


function _getOffsetTop(elem) {
  var offsetTop = 0;
  do {
    if (!isNaN(elem.offsetTop)) {
        offsetTop += elem.offsetTop;
    }
  } while ((elem = elem.offsetParent));
  return offsetTop;
}


export default class Volume extends React.Component {
  constructor(props) {
    super(props);

    this.state = {barVisible: false, volume: VolumeStore.getVolume()};
    this._onChange = this._onChange.bind(this);
    this._onWheel = this._onWheel.bind(this);
    this._onMouseEnter = this._onMouseEnter.bind(this);
    this._onMouseLeave = this._onMouseLeave.bind(this);
  }

  componentDidMount() {
    VolumeStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    VolumeStore.removeChangeListener(this._onChange);
  }

  render() {
    var volume = this.state.volume;
    var classSuffix;
    if (volume === 0.00) {
      classSuffix = 'off';
    } else if (volume < 0.5) {
      classSuffix = 'down';
    } else {
      classSuffix = 'up';
    }

    var bar = null;
    if (this.state.barVisible) {
      var h = this.props.height - parseInt(volume * this.props.height);
      bar = (
        <div className="bar" onClick={this._onClick} style={{height: this.props.height}}>
          <div className="current" style={{height: h}} />
          <div className="marker" style={{height: this.props.markerHeight}} />
        </div>
      );
    }

    return (
      <div className="volume" onWheel={this._onWheel} onMouseEnter={this._onMouseEnter} onMouseLeave={this._onMouseLeave}>
        {bar}
        <Icon icon={'volume-' + classSuffix} onClick={this._toggleMute} />
      </div>
    );
  }

  _toggleMute(evt) {
    evt.stopPropagation();
    VolumeActions.toggleVolumeMute();
  }

  _onWheel(evt) {
    evt.stopPropagation();
    var v = this.state.volume + 0.05 * evt.deltaY;
    if (v > 1.0) {
      v = 1.0;
    } else if (v < 0.00) {
      v = 0.0;
    }
    VolumeActions.volume(v);
  }

  _onClick(evt) {
    var pos = evt.pageY - _getOffsetTop(evt.currentTarget);
    var height = evt.currentTarget.offsetHeight;
    VolumeActions.volume(1 - pos/height);
  }

  _onChange() {
    this.setState({volume: VolumeStore.getVolume()});
  }

  _onMouseEnter() {
    this.setState({barVisible: true});
  }

  _onMouseLeave() {
    this.setState({barVisible: false});
  }
}

Volume.propTypes = {
  height: React.PropTypes.number.isRequired,
  markerHeight: React.PropTypes.number.isRequired,
};
