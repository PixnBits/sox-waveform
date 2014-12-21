/*jslint node: true */

'use strict';

var SoxWaveformStreamer = require('./SoxWaveformStreamer');
var util = require('util');


function SoxWaveformAverage(opts){
  if(!(this instanceof SoxWaveformAverage)){
    return new SoxWaveformAverage(opts);
  }

  this.init(opts);

  return this;
};

util.inherits(SoxWaveformAverage, SoxWaveformStreamer);

function average(numbers){
  return numbers.reduce(function(p,c){
    return p+c;
  }, 0) / numbers.length;
}

SoxWaveformAverage.prototype.init = function(opts){
  opts = opts || {};
  var self = this;
  var count = self.count = opts.count || 10;
  var points = self.points = [];
};

SoxWaveformAverage.prototype.write = function(wavePoint){
  var self = this,
      points = self.points,
      count = self.count;

  points.push(wavePoint);
  while(points.length >= count){
    var samplePoints = points.splice(0, count);
    
    self.averageSamplePoints(samplePoints);
  }
};

SoxWaveformAverage.prototype.averageSamplePoints = function(samplePoints){
  var self = this,
      times = [],
      channels = [];

  samplePoints.forEach(function(wavePoint){
      times.push(wavePoint.time);
      wavePoint.channels.forEach(function(channel, ind){
        channels[ind] = channels[ind] || [];
        channels[ind].push(channel);
      });
    });
    var dataOut = {
      time: average(times),
      channels: []
    };
    channels.forEach(function(channel, ind){
      dataOut.channels[ind] = average(channel);
    });
    self.emit('data', dataOut);
};

SoxWaveformAverage.prototype.close = function(){
  var points = this.points;
  if(points && points.length){
    this.averageSamplePoints(points.splice(0, points.length));
  }
};

module.exports = SoxWaveformAverage;