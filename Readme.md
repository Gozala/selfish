# selfish #

Pure Prototypal Inheritance

## Install ##

    npm install selfish

## Require ##

    var Base = require('https!raw.github.com/Gozala/selfish/v0.0.3/selfish.js').Base

## Examples ##

    var Base = require('https!raw.github.com/Gozala/selfish/v0.0.3/selfish.js').Base
    var Prototype = Base.extend({
      inherited: function inherited() {
        return "inherited property"
      },
      overridden: function overridden() {
        return "property to override"
      }
    })

    typeof Prototype // 'object'
    // No need to simulate classes via constructor functions!

    var o1 = Prototype.new()                     // Create instanece of Prototype
    console.log(Base.isPrototypeOf(o1))          // -> true
    console.log(Prototype.isPrototypeOf(o1))     // -> true
    console.log(o1.inherited())                  // -> "inherited property"

    var Decedent = Prototype.extend({
      new: function Decedent(options) {
        // Delegate to the base prototype method.
        var self = Base(this).new.apply(this, arguments)
        self.name = options.name;
        return self;
      },
      overridden: function override() {
        // Delegate to the base prototype method.
        return "No longer " + Base(this).overridden.call(this)
      },
      bye: function bye() {
        return "Buy my dear " + this.name
      }
    })

    typeof Decedent // 'object'
    console.log(Prototype.isPrototypeOf(Decedent))     // -> true

    // Prototypes can not be mutated.
    Decedent.foo = 'foo'
    // TypeError: Can't add property foo, object is not extensible
    Decedent.overridden = 'bar'
    // TypeError: Cannot assign to read only property 'overridden'


    var d1 = Decedent.new({ name: "foo" })
    console.log(Decedent.isPrototypeOf(d1))       // -> true
    console.log(Prototype.isPrototypeOf(d1))      // -> true
    console.log(Base.isPrototypeOf(d1))           // -> true
    console.log(d1.inherited())                   // -> "inherited property"
    console.log(d1.overridden())                  // -> No longer a property to override
    console.log(d1.name)                          // -> "foo"

    // Instance's own properties may be mutated.
    d1.name = "dear friend
    console.log(d1.bye())                         // -> "Bye my dear friend"

