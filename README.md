sox-waveform
========
node module to stream an audio file's waveform

You will need to install [sox](http://sox.sourceforge.net/) before use.

If you want to use MP3 files, you will also need [libsox-fmt-mp3](http://superuser.com/a/421168)

Usage
=====
Out to the console:
```javascript
var soxWaveform = require('sox-waveform');

soxWaveform.Waveform({file:'/home/pixnbits/Music/birds.ogg'})
  // can pipe to waveform transforms, such as averaging
  .pipe( new soxWaveform.WaveformAverage({count:100}) )
  .on('data', function(wavePoint){
    // wavePoint is an object of the form:
    // {"time":2.334410431,"channels":[-0.0004992675779,-0.0004992675779]}
    console.log('wavePoint avg!', wavePoint);
  })
  .build();
```

or, out to a file:
```javascript
var fs = require('fs');
var writable = fs.createWriteStream('file.txt');
// build option is to auto-start building, helpful when piping to node streams
soxWaveform.Waveform({file:'/home/pixnbits/Music/birds.ogg', build:true})
  .pipe( new soxWaveform.WaveformAverage({count:100}) )
  .pipe(writable);
```

Streaming Note
==============
In an effort to reduce GC events, `SoxWaveformStreamer` does *not* inherit from `stream` to avoid repeated serializing/deserializing `wavePoint`s.
