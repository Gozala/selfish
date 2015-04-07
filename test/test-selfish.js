(function() {
  "use strict";

  var selfish = require("../selfish");
  var should = require("should");
  var Base = selfish.Base;

  describe("#isPrototypeOf", function() {
    it("Base is a prototype of new Base()", function() {
      Base.prototype.isPrototypeOf(new Base()).should.be.true;
    });
    it("Base is a prototype of Base.extend()", function() {
      Base.prototype.isPrototypeOf(Base.extend().prototype).should.be.true;
    });
    it("Base is a prototype of new (Base.extend())", function() {
      Base.prototype.isPrototypeOf(new(Base.extend())()).should.be.true;
    });
    it("Base.extend() in not prototype of Base.extend()", function() {
      Base.extend().prototype.isPrototypeOf(Base.extend().prototype).should.be.false;
    });
    it("Base.extend() in not prototype of new (Base.extend())", function() {
      Base.extend().prototype.isPrototypeOf(new(Base.extend())()).should.be.false;
    });
    it("new Base() is not prototype of new Base()", function() {
      (new Base()).isPrototypeOf(new Base()).should.be.false;
    });
    it("new Base() is not prototype of Base.extend()", function() {
      (new Base()).isPrototypeOf(Base.extend().prototype).should.be.false;
    });
    it("Base.extend() is not prototype of new Base()", function() {
      Base.extend().prototype.isPrototypeOf(new Base()).should.be.false;
    });
  });

  describe("#Inheritance", function() {
    var Parent, Child;
    before(function() {
      Parent = Base.extend({
        name: "parent",
        method: function() {
          return "hello " + this.name;
        }
      });
      Child = Parent.extend({
        name: "child"
      });
    });

    describe("Parent prototype", function() {
      it("Parent.prototype name is parent", function() {
        Parent.prototype.name.should.be.eql("parent");
      });
      it("method works on prototype", function() {
        Parent.prototype.method().should.be.eql("hello parent");
      });
    });

    describe("Parent instances", function() {
      var p;
      before(function() {
        p = new Parent();
      });
      it("Parent instance inherits name", function() {
        var p = new Parent();
        p.name.should.be.eql(Parent.prototype.name);
      });
      it("method behaves same on the prototype", function() {
        p.method().should.be.eql(Parent.prototype.method());
      });
    });

    it("Parent decedent inherits name", function() {
      Parent.extend({}).prototype.name.should.be.eql(Parent.prototype.name);
    });

    describe("Child prototype", function() {
      it("Child overrides name", function() {
        Child.prototype.name.should.not.be.eql(Parent.prototype.name);
      });
      it("method refers to instance property", function() {
        Child.prototype.method().should.be.eql("hello child");
      });
      it("Child inherits method", function() {
        Child.prototype.method.should.be.eql(Parent.prototype.method);
      });
    });

    describe("Child instances", function() {
      var c;
      before(function() {
        c = new Child();
      });

      it("Child instances inherit name", function() {
        c.name.should.be.eql(Child.prototype.name);
      });
      it("Child instances inherit method", function() {
        c.method.should.be.eql(Parent.prototype.method);
      });
    });

    it("Child decedents inherit name", function() {
      Child.extend().prototype.name.should.be.eql(Child.prototype.name);
    });

    it("Child decedent inherit method", function() {
      Child.extend().prototype.method.should.be.eql(Parent.prototype.method);
    });

    it("method may be overridden", function() {
      var CC = Child.extend({
        name: "decedent"
      });
      var cc = new CC();
      cc.method().should.be.eql("hello decedent");
    });
  });

  describe("#prototype immutability", function() {
    it("Base is immutable", function() {
      (function() {
        Base.extend = null;
      }).should.throw();
    });
    it("Base prototype is immutable", function() {
      (function() {
        Base.prototype.foo = null;
      }).should.throw();
    });
    it("Base prototype is non-configurable", function() {
      (function() {
        Base.foo = null;
      }).should.throw();
    });
    it("Can't delete properties on Base", function() {
      (function() {
        delete Base.extend;
      }).should.throw();
    });
  });

  describe("#extended prototype immutability", function() {
    var Foo, Bar;
    before(function() {
      Foo = Base.extend({
        name: "hello",
        rename: function rename(name) {
          this.name = name;
        },
        nothing: function nothing() {}
      });
      Bar = Foo.extend({
        rename: function rename() {
          return this.name;
        }
      });
    });
    it("Can't change prototype properties", function() {
      (function() {
        Foo.extend = null;
      }).should.throw();
    });

    it("Can't add properties", function() {
      (function() {
        Foo.prototype.bar = null;
      }).should.throw();
      (function() {
        Foo.bar = null;
      }).should.throw();
    });

    it("Can't remove prototype properties", function() {
      (function() {
        delete Foo.prototype.name;
      }).should.throw();
    });

    it("Method's can't mutate prototypes", function() {
      (function() {
        Foo.prototype.rename("new name");
      }).should.throw();
    });

    it("properties may be overridden on decedents", function() {
      Bar.prototype.rename().should.be.eql(Foo.prototype.name);
      Bar.prototype.rename.should.not.be.eql(Foo.prototype.rename);
    });
  });

  describe("#instance mutability", function() {
    var Foo, f1;
    before(function() {
      Foo = Base.extend({
        name: "foo",
        init: function init(number) {
          this.number = number;
        }
      });
      f1 = new Foo();
    });
    it("instance is mutable", function() {
      should(f1.alias).be.ko;
      f1.alias = "f1";
      f1.alias.should.be.eql("f1");
    });
    it("own properties are deletable", function() {
      f1.alias = "f1";
      ("alias" in f1).should.be.true;
      delete f1.alias;
      ("alias" in f1).should.be.false;
    });
    it("methods can mutate instance's own properties", function() {
      f1.init(1);
      f1.number.should.be.eql(1);
      f1.init(3);
      f1.number.should.be.eql(3);
    });
    it("properties can be directly mutated", function() {
      f1.name.should.be.eql("foo");
      (function() {
        f1.name = "lol";
      }).should.not.throw();
      f1.name.should.be.eql("lol");
    });
    describe("#Deeper inheritance mutability", function() {
      var A, B, C;
      before(function() {
        A = Base.extend({
          name: "A",
          hello: function() {
            return this.name;
          }
        });
        B = A.extend({
          varB: "B"
        });
        C = B.extend({
          varC: "C"
        });
      });
      it("A instance can modify name", function() {
        var a = new A();
        a.name.should.be.eql("A");
        a.hello().should.be.eql("A");
        (function() {
          a.name = "Foo";
        }).should.not.throw();
        a.name.should.be.eql("Foo");
        a.hello().should.be.eql("Foo");
      });
      it("B instance inherits A.name", function() {
        var b = new B();
        b.name.should.be.eql("A");
        b.hello().should.be.eql("A");
      });
      it("B instance varB is mutable", function() {
        var b = new B();
        b.varB.should.be.eql("B");
        (function() {
          b.varB = "Foo";
        }).should.not.throw();
        b.varB.should.be.eql("Foo");
      });
      it("B instance can modify name", function() {
        var c = new C();
        (function() {
          c.name = "Foo";
        }).should.not.throw();
        c.name.should.be.eql("Foo");
        c.hello().should.be.eql("Foo");
      });
      it("C instance varC is mutable", function() {
        var c = new C();
        c.varC.should.be.eql("C");
        (function() {
          c.varC = "Foo";
        }).should.not.throw();
        c.varC.should.be.eql("Foo");
      });
      it("C instance can modify name", function() {
        var c = new C();
        (function() {
          c.name = "Foo";
        }).should.not.throw();
        c.name.should.be.eql("Foo");
        c.hello().should.be.eql("Foo");
      });
      it("C instance can modify varB", function() {
        var c = new C();
        (function() {
          c.varB = "Foo";
        }).should.not.throw();
        c.varB.should.be.eql("Foo");
      });
    });
  });

  describe("#Super", function() {
    var Foo, Bar, bar, C, c;
    before(function() {
      Foo = Base.extend({
        initialize: function Foo(options) {
          this.name = options.name;
        }
      });

      Bar = Foo.extend({
        initialize: function Bar(options) {
          Foo.prototype.initialize.call(this, options);
          this.type = "bar";
        }
      });

      C = Foo.extend({
        initialize: function C(options) {
          Foo.prototype.initialize.call(this, options);
          this.type = "C";
        }
      });

      bar = new Bar({
        name: "test"
      });

      c = new C({
        name: "not bar"
      });
    });

    it("Bar is prototype of new Bar()", function() {
      Bar.prototype.isPrototypeOf(bar).should.be.true;
    });
    it("Foo is prototype of new Bar()", function() {
      Foo.prototype.isPrototypeOf(bar).should.be.true;
    });
    it("Base is prototype of new Bar()", function() {
      Base.prototype.isPrototypeOf(bar).should.be.true;
    });
    it("C is not prototype of new Bar()", function() {
      C.prototype.isPrototypeOf(bar).should.be.false;
    });
    it("bar initializer was called", function() {
      bar.type.should.be.eql("bar");
    });
    it("bar initializer called Foo initializer", function() {
      bar.name.should.be.eql("test");
    });
  });

  describe("#Complex inheritance", function() {
    var HEX, RGB, CMYK, Color;
    before(function() {
      HEX = Base.extend({
        hex: function hex() {
          return "#" + this.color;
        }
      });

      RGB = Base.extend({
        red: function red() {
          return parseInt(this.color.substr(0, 2), 16);
        },
        green: function green() {
          return parseInt(this.color.substr(2, 2), 16);
        },
        blue: function blue() {
          return parseInt(this.color.substr(4, 2), 16);
        }
      });

      CMYK = Base.extend(RGB.prototype, {
        black: function black() {
          var color = Math.max(Math.max(this.red(), this.green()), this.blue());
          return (1 - color / 255).toFixed(4);
        },
        cyan: function cyan() {
          var K = this.black();
          return (((1 - this.red() / 255).toFixed(4) - K) / (1 - K)).toFixed(4);
        },
        magenta: function magenta() {
          var K = this.black();
          return (((1 - this.green() / 255).toFixed(4) - K) / (1 - K)).toFixed(4);
        },
        yellow: function yellow() {
          var K = this.black();
          return (((1 - this.blue() / 255).toFixed(4) - K) / (1 - K)).toFixed(4);
        }
      });

      Color = Base.extend(HEX.prototype, RGB.prototype, CMYK.prototype, {
        initialize: function Color(hex) {
          this.color = hex;
        }
      });
    });

    it("CMYK includes RGB but RGB is not his prototype", function() {
      RGB.prototype.isPrototypeOf(CMYK.prototype).should.be.false;
      var c = new CMYK();
      RGB.prototype.isPrototypeOf(c).should.be.false;
      CMYK.prototype.isPrototypeOf(c).should.be.true;
    });

    it("Color have hex, red and yellow", function() {
      should(Color.prototype.hex).be.a.Function;
      should(Color.prototype.red).be.a.Function;
      should(Color.prototype.yellow).be.a.Function;
    });

    it("Color instance have hex, red and yellow", function() {
      var c = new Color("#ff0000");
      should(c.hex).be.a.Function;
      should(c.red).be.a.Function;
      should(c.yellow).be.a.Function;
    });
  });
})();
