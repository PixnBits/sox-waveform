/*jslint node: true */

'use strict';

var streamSoxWaveform = require('./lib/streamSoxWaveform');

var SoxWaveform = require('./lib/SoxWaveform');
var SoxWaveformAverage = require('./lib/SoxWaveformAverage');
var SoxWaveformEventEmitter = require('./lib/SoxWaveformEventEmitter');

module.exports = {
  stream: streamSoxWaveform,
  Waveform: SoxWaveform,
  WaveformAverage: SoxWaveformAverage,

  // for custom data manip
  SoxWaveformEventEmitter: SoxWaveformEventEmitter
};