/*jslint node: true */

'use strict';

var spawn = require('child_process').spawn;
var util = require('util');

var split = require('split');

function identity(v){ return v; }

function sortWavePoints(a, b){
  return (a&&a.time) - (b&&b.time);
}

var Transform = require('stream').Transform;
function SoxWaveformStream(opts){
  Transform.call(this, opts);
}
util.inherits(SoxWaveformStream, Transform);
SoxWaveformStream.prototype._transform = function(data, encoding, callback){
  var line = ''+data;

  if(line){
    var parts = line.split(/\s+/).filter(identity).map(parseFloat);

    var wavePoint = {
      time: parts.shift(),
      channels: parts
    };

    this.push(JSON.stringify(wavePoint));
  }
  callback();
}

function streamSoxWaveform(filePath){

  if(!filePath){
    throw new Error('no file specified');
  }

  var ps = spawn('sox', [filePath, '-t', 'dat', '-']);

  return ps.stdout
    .pipe(split())
    .pipe(new SoxWaveformStream);
}

module.exports = streamSoxWaveform;