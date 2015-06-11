# selfish #

[![Build Status](https://secure.travis-ci.org/Gozala/selfish.png)](http://travis-ci.org/Gozala/selfish)

Class-free, pure prototypal multiple inheritance that lets you write expressive,
well-structured code.

## Install ##

### server-side ###

    npm install selfish

### client-side ###

    bower install selfish


## Require ##

### server-side ###

    var Base = require('!raw.github.com/Gozala/selfish/v1.0.0/selfish').Base

### client-side RequireJS ###

    define(['path/to/selfish'], function(selfish) {
       var Base = selfish.Base;
    }

## Examples ##

### Basics ###

```js
// Instead of creating classes, you create prototype objects. Let's look
// at this simple example first:
var Dog = Base.extend({
  bark: function() {
    return 'Ruff! Ruff!'
  }
})

// Forget about classes, javascript is a prototypal language:
typeof Dog                // object

// Use the new operator to create an instance:
var dog = new Dog()
dog.bark()                // 'Ruff! Ruff!'

// Alternatively you can use the legacy new() function but keep in mind that
// the new operator is faster in most browsers
var dog = Dog.new()
dog.bark()                // 'Ruff! Ruff!'

// Forget about special `instanceof` operator, use JS native method instead:
Dog.prototype.isPrototypeOf(dog)    // true

// Objects inherit from objects, what could be more object oriented than
// that ?
var Pet = Dog.extend({
  initialize: function(breed, name) {
    this.breed = breed
    this.name = name
  },
  call: function(name) {
    return this.name === name ? this.bark() : ''
  },
  toString: function() {
    return this.breed + ' ' + this.name
  }
})

// All arguments passed to the constructor are forwarded to the `initialize`
// method of instance.

var pet = new Pet('Labrador', 'Benzy')
pet.toString()          // 'Labrador Benzy'
pet.call('doggy')       // ''
pet.call('Benzy')       // 'Ruff! Ruff!'
```


### Object composition ###

```js
// In some programs recombining reusable pieces of code is a better option:

var HEX = Base.extend({
  hex: function hex() {
    return '#' + this.color
  }
})

var RGB = Base.extend({
  red: function red() {
    return parseInt(this.color.substr(0, 2), 16)
  },
  green: function green() {
    return parseInt(this.color.substr(2, 2), 16)
  },
  blue: function blue() {
    return parseInt(this.color.substr(4, 2), 16)
  }
})

var CMYK = Base.extend(RGB.prototype, {
  black: function black() {
    var color = Math.max(Math.max(this.red(), this.green()), this.blue())
    return (1 - color / 255).toFixed(4)
  },
  magenta: function magenta() {
    var K = this.black();
    return (((1 - this.green() / 255).toFixed(4) - K) / (1 - K)).toFixed(4)
  },
  yellow: function yellow() {
    var K = this.black();
    return (((1 - this.blue() / 255).toFixed(4) - K) / (1 - K)).toFixed(4)
  },
  cyan: function cyan() {
    var K = this.black();
    return (((1 - this.red() / 255).toFixed(4) - K) / (1 - K)).toFixed(4)
  }
})

// Composing `Color` prototype out of reusable components:
var Color = Base.extend(HEX.prototype, RGB.prototype, CMYK.prototype, {
  initialize: function initialize(color) {
    this.color = color
  }
})

var pink = Color.new('FFC0CB')
// RGB
pink.red()        // 255
pink.green()      // 192
pink.blue()       // 203

// CMYK
pink.magenta()    // 0.2471
pink.yellow()     // 0.2039
pink.cyan()       // 0.0000
```

### Combining composition & inheritance ###

```js
var pixel = new Pixel(11, 23, 'CC3399')
  initialize: function initialize(x, y, color) {
    Color.initialize.call(this, color)
    this.x = x
    this.y = y
  },
  toString: function toString() {
    return this.x + ':' + this.y + '@' + this.hex()
  }
})

var pixel = Pixel.new(11, 23, 'CC3399')
pixel.toString()              // 11:23@#CC3399
Pixel.prototype.isPrototypeOf(pixel)    // true

// Pixel instances inhertis from `Color`
Color.prototype.isPrototypeOf(pixel)    // true

// In fact `Pixel.prototype` itself inherits from `Color.prototype`, remember just simple and
// pure prototypal inheritance where objects inherit from objects.
Color.prototype.isPrototypeOf(Pixel.prototype)    // true
```

### TODO ###

This is a list of things I may introduce in newer versions.

* Add `testling` badge
* Add examples about private variables (closures)
* Add guidelines on how to use the lib for common cases
* Add `requirejs` test
* Better merge? in-depth merge (like lodash). Two different `extend` methods ?
* Do a full prototype chaining ?
```js
var Extra = Base.extend(Foo, Bar, {toto: true});
var instance = new Extra();
Base.prototype.isPrototypeOf(instance); // true :D
Extra.prototype.isPrototypeOf(instance); // true :D
Foo.prototype.isPrototypeOf(instance); // false :(
Bar.prototype.isPrototypeOf(instance); // false :(
```
* Clone inner objects:
```js
var someBase = {
  outer: {
    inner: 1
  }
}
var Extra = Base.extend(Foo, Bar, someBase);
var e = new Extra();
e.outer.inner = 3;
someBase.outer.inner === 1; // should be true
```
