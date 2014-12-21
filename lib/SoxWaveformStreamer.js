/*jslint node: true */

'use strict';

var stream = require('stream');
var EventEmitter = require('events').EventEmitter;
var util = require('util');

var BUILD_EVENT = 'SoxWaveformStreamer:build',
    ENCODING_UTF8 = 'utf-8';

function SoxWaveformStreamer(opts){
  EventEmitter.apply(this, arguments);
}

util.inherits(SoxWaveformStreamer, EventEmitter);

SoxWaveformStreamer.prototype.pipe = function(parser){

  if(parser instanceof stream){
    this.on('data', function(data){
      parser.write(JSON.stringify(data), ENCODING_UTF8);
    });
  }else if(parser instanceof EventEmitter){
    if('function' === typeof parser.write){
      this.on('data', function(data){
        parser.write(data);
      });
      this.on('close', function(){
        parser.close();
      });
    }
    
    parser.on(BUILD_EVENT, this.build.bind(this));
  }

  return parser;
}

SoxWaveformStreamer.prototype.build = function(){
  this.emit(BUILD_EVENT);
}

SoxWaveformStreamer.prototype.write = function(){};
SoxWaveformStreamer.prototype.close = function(){};

SoxWaveformStreamer.BUILD_EVENT = BUILD_EVENT;

module.exports = SoxWaveformStreamer;
