/*jslint node: true */

'use strict';

var spawn = require('child_process').spawn;
var SoxWaveformStreamer = require('./SoxWaveformStreamer');
var util = require('util');

var split = require('split');

function identity(v){ return v; }

function sortWavePoints(a, b){
  return (a&&a.time) - (b&&b.time);
}

function SoxWaveform(opts){
  if(!(this instanceof SoxWaveform)){
    return new SoxWaveform(opts);
  }

  this.init(opts);

  return this;
};

util.inherits(SoxWaveform, SoxWaveformStreamer);

SoxWaveform.prototype.init = function(opts){
  opts = opts || {};
  this.file = opts.file || null;
  this.store = !!opts.store;
  this.buildFlag = !!opts.build;

  console.log('buildFlag', this.buildFlag);
  if(this.buildFlag){
    process.nextTick(this.build.bind(this));
  }
};

SoxWaveform.prototype.build = function(){
  var selfWaveForm = this;

  if(selfWaveForm.ps){
    return selfWaveForm;
  }

  var filePath = selfWaveForm.file;
  if(!filePath){
    selfWaveForm.emit('error', 'no file specified');
    return selfWaveForm;
  }
  
  var points;
  if(selfWaveForm.store){
    points = selfWaveForm.points = [];
  }

  var ps = selfWaveForm.ps = spawn('sox', [filePath, '-t', 'dat', '-']);

  selfWaveForm.emit('start', filePath);

  ps.on('error', function(err){
    selfWaveForm.emit('error', err);
  });

  ps.stdout
    .pipe(split())
    .on('data', function(line){
      if(!line){
        return;
      }
      var parts = line.split(/\s+/).filter(identity).map(parseFloat);

      var wavePoint = {
        time: parts.shift(),
        channels: parts
      };

      if(points){
        points.push(wavePoint);
      }

      selfWaveForm.emit('data', wavePoint);
    });

  ps.on('close', function(){
    if(points){
      points.sort(sortWavePoints);
    }
    selfWaveForm.emit('close', points);
  });

  return selfWaveForm;
};


module.exports = SoxWaveform;