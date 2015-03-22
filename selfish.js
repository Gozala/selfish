/* vim:set ts=2 sw=2 sts=2 expandtab */
/*jshint undef: true es5: true node: true devel: true evil: true
         forin: true latedef: false supernew: true */
/*global define: true */

!(typeof define !== "function" ? function(_, $) {
  $(null, typeof exports !== "undefined" ? exports : window);
} : define)("selfish", function(require, exports) {

  "use strict";

  /**
   * Merges all the properties of the passed objects into `this` instance (This
   * method can be used on instances only as prototype objects are frozen).
   *
   * If two or more argument objects have own properties with the same name,
   * the property is overridden, with precedence from right to left, implying,
   * that properties of the object on the left are overridden by a same named
   * property of the object on the right.
   *
   * @examples
   *
   *    var Pet = Dog.extend({
   *      initialize: function initialize(options) {
   *        this.name = options.name;
   *      },
   *      call: function(name) {
   *        return this.name === name ? this.bark() : '';
   *      },
   *      name: null
   *    });
   *    var pet = new Pet({ name: 'Benzy', breed: 'Labrador' });
   *    pet.call('Benzy');   // 'Ruff! Ruff!'
   */
  var merge = function selfishMerge() {
    var descriptor = {};
    Array.prototype.forEach.call(arguments, function(properties) {
      Object.getOwnPropertyNames(properties).forEach(function(name) {
        descriptor[name] = Object.getOwnPropertyDescriptor(properties, name);
      });
    });
    Object.defineProperties(this, descriptor);
    return this;
  };

  exports.merge = merge;

  /**
   * This is the main constructor. It should be used by any other object.
   * Always calling the `initialize` function makes it easier to keep
   * a coherent inheritance tree.
   */
  var Base = function BaseConstructor() {
    this.initialize.apply(this, arguments);
  };

  /**
   * When new instance of the this prototype is created its `initialize`
   * method is called with all the arguments passed to the `new`. You can
   * override `initialize` to set up an instance.
   */
  Base.prototype.initialize = function BaseInitialize() {};

  /**
   * Takes any number of argument objects and returns frozen, composite object
   * that inherits from `this` object and combines all of the own properties of
   * the argument objects. (Objects returned by this function are frozen as
   * they are intended to be used as types).
   *
   * If two or more argument objects have own properties with the same name,
   * the property is overridden, with precedence from right to left, implying,
   * that properties of the object on the left are overridden by a same named
   * property of the object on the right.
   *
   * When extending selfish prototypes remember to call it on their `prototype`
   * instead of the type itself.
   *
   * This is the only function that should not be placed in the prototype as it
   * is relative to the object.
   * @examples
   *
   *    // ## Object composition ##
   *
   *    var HEX = Base.extend({
   *      hex: function hex() {
   *        return '#' + this.color;
   *      }
   *    });
   *
   *    var RGB = Base.extend({
   *      red: function red() {
   *        return parseInt(this.color.substr(0, 2), 16);
   *      },
   *      green: function green() {
   *        return parseInt(this.color.substr(2, 2), 16);
   *      },
   *      blue: function blue() {
   *        return parseInt(this.color.substr(4, 2), 16);
   *      }
   *    });
   *
   *    var CMYK = Base.extend(RGB.prototype, {
   *      black: function black() {
   *        var color = Math.max(Math.max(this.red(), this.green()), this.blue());
   *        return (1 - color / 255).toFixed(4);
   *      },
   *      cyan: function cyan() {
   *        var K = this.black();
   *        return (((1 - this.red() / 255).toFixed(4) - K) / (1 - K)).toFixed(4);
   *      },
   *      magenta: function magenta() {
   *        var K = this.black();
   *        return (((1 - this.green() / 255).toFixed(4) - K) / (1 - K)).toFixed(4);
   *      },
   *      yellow: function yellow() {
   *        var K = this.black();
   *        return (((1 - this.blue() / 255).toFixed(4) - K) / (1 - K)).toFixed(4);
   *      }
   *    });
   *
   *    var Color = Base.extend(HEX.prototype, RGB.prototype, CMYK.prototype, {
   *      initialize: function Color(color) {
   *        this.color = color;
   *      }
   *    });
   *
   *    // ## Prototypal inheritance ##
   *
   *    var Pixel = Color.extend({
   *      initialize: function Pixel(x, y, hex) {
   *        Color.initialize.call(this, hex);
   *        this.x = x;
   *        this.y = y;
   *      },
   *      toString: function toString() {
   *        return this.x + ':' + this.y + '@' + this.hex();
   *      }
   *    });
   *
   *    var pixel = new Pixel(11, 23, 'CC3399');
   *    pixel.toString(); // 11:23@#CC3399
   *
   *    pixel.red();      // 204
   *    pixel.green();    // 51
   *    pixel.blue();     // 153
   *
   *    pixel.cyan();     // 0.0000
   *    pixel.magenta();  // 0.7500
   *    pixel.yellow();   // 0.2500
   *
   */
  Base.extend = function selfishExtend() {
    var dependencies = [];
    /*
     * It is actually important to redefine a constructor here. Even if
     * the body is always the same
     */
    var constructor = function() { // Call initialize by default if possible
      this.initialize.apply(this, arguments);
    };
    Array.prototype.forEach.call(arguments, function(dependency) {
      dependencies.push(dependency);
    });
    // Copy the prototype methods that allows us to do inheritance
    constructor.extend = this.extend;

    // Generate the prototype and extend it
    var descriptor = Object.create(this.prototype);
    merge.apply(descriptor, arguments);

    // Freeze the new created prototype
    constructor.prototype = Object.freeze(descriptor);
    return Object.freeze(constructor);
  };

  // Freeze the prototype as well as the constructor
  Base.prototype = Object.freeze(Base.prototype);
  exports.Base = Object.freeze(Base);

});
