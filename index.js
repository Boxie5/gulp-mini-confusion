"use strict";

var through = require('through2');

module.exports = function(condition) {
  return through.obj(function(file, enc, callback){
    if (file.isNull()) {
      this.push(file);
      return callback();
    }

    if (file.isStream()) {
      this.emit('error', new gutil.PluginError('gulp-mini-confusion', 'Stream content is not supported'));
      return callback();
    }

    if (file.isBuffer()) {
      var contents = file.contents.toString();
      file.contents = new Buffer(confuse(contents));
      this.push(file);
      return callback();
    }

    function confuse(str) {
      var lens = str.split("").map(function(c,i) {
        return (str.charCodeAt(i)+"").length;
      });

      return lens.map(function(len,i) {
        return ""+len+str.charCodeAt(i);
      }).join("");
    }

    function recover(str) {
      var codeArr = [], count=0, len=0, step=0, obj = String, name=["from","Code"];
      while (count<str.length) {
        len = parseInt(str[count]);
        if (!len) throw "invalid str";
        codeArr[step++] = parseInt(str.substr(count+1, len));
        count += len+1;
      }

      return codeArr.map(function(item,index) {
        var fun = obj[name.join("Char")];
        return fun(item);
      }).join("");
    }
  });
}
