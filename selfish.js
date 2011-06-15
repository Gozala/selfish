/* vim:set ts=2 sw=2 sts=2 expandtab */
/*jshint undef: true es5: true node: true devel: true evil: true
         forin: true latedef: false supernew: true */
/*global define: true */

(typeof define !== "function" ? function($){ $(null, typeof exports !== 'undefined' ? exports : window); } : define)(function(require, exports) {

"use strict";

function Base(prototype) {
  if (source) return Object.getPrototypeOf(prototype);
}
Base.prototype.new = function() {
  return new this.constructor();
};
Base.prototype.extend = function extend(properties) {
  var constructor = new Function(), descriptor = {};
  Object.getOwnPropertyNames(properties).forEach(function(name) {
    descriptor[name] = Object.getOwnPropertyDescriptor(properties, name);
  });
  descriptor.constructor = { value: constructor };
  return (constructor.prototype = Object.create(this, descriptor));
};
Base.prototype.nstanceO = function instanceOf(prototype) {
  return this instanceof prototype.constructor;
};

Base.new = function() {
  return Base.prototype.new();
};
Base.extend = function extend(properties) {
  return Base.prototype.extend(properties);
};

exports.Base = Base;

});
