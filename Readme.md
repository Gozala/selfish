# selfish #

[![Build Status](https://secure.travis-ci.org/Gozala/selfish.png)](http://travis-ci.org/Gozala/selfish)

Class-free, pure prototypal inheritance that lets write expressive,
well-structured code, without ever touching special `prototype` properties
or `new`, `instanceof` operators.

## Install ##

    npm install selfish

## Require ##

    var Base = require('!raw.github.com/Gozala/selfish/v0.3.0/selfish').Base

## Examples ##

### Basics ###

```js
// Instead of creating classes, you create prototype objects. Let's look
// at the simle example first:
var Dog = Base.extend({
  bark: function() {
    return 'Ruff! Ruff!'
  }
})

// Forget about classes, javascript is prototypal language:
typeof Dog                // object

// Forget about special `new` operator, just use a maker function:
var dog = Dog.new()
dog.bark()                // 'Ruff! Ruff!'

// Forget about special `instanceof` operator, use JS native method instead:
Dog.isPrototypeOf(dog)    // true

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

// All arguments passed to `new` are forwarded to the `initialize` method
// of instance. If you want do something different just override `new` :)

var pet = Pet.new('Labrador', 'Benzy')
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

var CMYK = Base.extend(RGB, {
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
var Color = Base.extend(HEX, RGB, CMYK, {
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
var Pixel = Color.extend({
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
Pixel.isPrototypeOf(pixel)

// Pixel instances inhertis from `Color`
Color.isPrototypeOf(pixel)    // true

// In fact `Pixel` itself inherits from `Color`, remember just simple and
// pure prototypal inheritance where object inherit from objects.
Color.isPrototypeOf(Pixel)
```
