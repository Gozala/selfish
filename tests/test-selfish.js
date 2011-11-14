/* vim:set ts=2 sw=2 sts=2 expandtab */
/*jshint asi: true newcap: true undef: true es5: true node: true devel: true
         forin: true */
/*global define: true */

(typeof define === "undefined" ? function ($) { $(require, exports, module) } : define)(function (require, exports, module, undefined) {

"use strict";

var Base = require("../selfish").Base;

exports["test .isPrototypeOf"] = function(assert) {
  assert.ok(Base.isPrototypeOf(Base.new()),
            "Base is a prototype of Base.new()");
  assert.ok(Base.isPrototypeOf(Base.extend()),
            "Base is a prototype of Base.extned()");
  assert.ok(Base.isPrototypeOf(Base.extend().new()),
            "Base is a prototoype of Base.extend().new()");
  assert.ok(!Base.extend().isPrototypeOf(Base.extend()),
            "Base.extend() in not prototype of Base.extend()");
  assert.ok(!Base.extend().isPrototypeOf(Base.new()),
            "Base.extend() is not prototype of Base.new()");
  assert.ok(!Base.new().isPrototypeOf(Base.extend()),
            "Base.new() is not prototype of Base.extend()");
  assert.ok(!Base.new().isPrototypeOf(Base.new()),
            "Base.new() is not prototype of Base.new()");
};

exports["test inheritance"] = function(assert) {
  var Parent = Base.extend({
    name: "parent",
    method: function () {
      return "hello " + this.name;
    }
  });

  assert.equal(Parent.name, "parent", "Parent name is parent");
  assert.equal(Parent.method(), "hello parent", "method works on prototype");
  assert.equal(Parent.new().name, Parent.name, "Parent instance inherits name");
  assert.equal(Parent.new().method(), Parent.method(),
               "method behaves same on the prototype");
  assert.equal(Parent.extend({}).name, Parent.name,
               "Parent decedent inherits name");

  var Child = Parent.extend({ name: "child" });
  assert.notEqual(Child.name, Parent.name, "Child overides name");
  assert.equal(Child.new().name, Child.name, "Child intsances inherit name");
  assert.equal(Child.extend().name, Child.name,
               "Child decedents inherit name");

  assert.equal(Child.method, Parent.method, "Child inherits method");
  assert.equal(Child.extend().method, Parent.method,
               "Child decedent inherit method");
  assert.equal(Child.new().method, Parent.method,
               "Child instances inherit method");

  assert.equal(Child.method(), "hello child",
               "method refers to instance proprety");
  assert.equal(Child.extend({ name: "decedent" }).new().method(),
               "hello decedent", "method may be overrided");
};

exports["test prototype immutability"] = function(assert) {
  assert.throws(function() {
    Base.extend = function() {};
  }, "Base prototype is imutable");
  assert.throws(function() {
    Base.foo = "bar";
  }, "Base prototype is non-configurabel");
  assert.throws(function() {
    delete Base.new;
  }, "Can't delete properties on prototype");

  var Foo = Base.extend({
    name: 'hello',
    rename: function rename(name) {
      this.name = name;
    }
  });

  assert.throws(function() {
    Foo.extend = function() {}
  }, "Can't change prototype properties");
  assert.throws(function() {
    Foo.foo = "bar";
  }, "Can't add prototype properties");
  assert.throws(function() {
    delete Foo.name;
  }, "Can't remove prototype properties");
  assert.throws(function() {
    Foo.rename("new name");
  }, "Method's can't mutate prototypes");

  var Bar = Foo.extend({
    rename: function rename() {
      return this.name;
    }
  });

  assert.equal(Bar.rename(), Foo.name,
               "properties may be overided on decedents");
};

exports['test instance mutability'] = function(assert) {
  var Foo = Base.extend({
    name: "foo",
    init: function init(number) {
      this.number = number;
    }
  });
  var f1 = Foo.new();
  /* V8 does not supports this yet!
  assert.throws(function() {
    f1.name = "f1";
  }, "can't change prototype properties");
  */
  f1.alias = "f1";
  assert.equal(f1.alias, "f1", "instance is mutable");
  delete f1.alias;
  assert.ok(!('alias' in f1), "own properties are deletable");
  f1.init(1);
  assert.equal(f1.number, 1, "method can mutate instance's own properties");
};

exports['test super'] = function(assert) {
  var Foo = Base.extend({
    initialize: function Foo(options) {
      this.name = options.name;
    }
  });

  var Bar = Foo.extend({
    initialize: function Bar(options) {
      Foo.initialize.call(this, options);
      this.type = 'bar';
    }
  });

  var bar = Bar.new({ name: 'test' });

  assert.ok(Bar.isPrototypeOf(bar), 'Bar is prototype of Bar.new');
  assert.ok(Foo.isPrototypeOf(bar), 'Foo is prototype of Bar.new');
  assert.ok(Base.isPrototypeOf(bar), 'Base is prototype of Bar.new');
  assert.equal(bar.type, 'bar', 'bar initializer was called');
  assert.equal(bar.name, 'test', 'bar initializer called Foo initializer');
};

exports['test array copy depth'] = function(assert) {

  var A = Base.extend({
    array: [
      1, { p: 'val', a: [1] }
    ]
  });

  var B = Base.extend( A, {});

  var b = B.new();


  // Base object checks
  assert.equal(A.array[0], 1, 'A.array[0] equals 1');
  assert.equal(B.array[0], 1, 'B.array[0] equals 1');

  assert.equal(A.array[1].p, 'val', 'A.array[1].p equals "val"');
  assert.equal(B.array[1].p, 'val', 'B.array[1].p equals "val"');

  assert.equal(A.array[1].a[0], 1, 'A.array[1].a[0] equals 1');
  assert.equal(B.array[1].a[0], 1, 'B.array[1].a[0] equals 1');


  // Modify values of the new instance's array at varying depths
  b.array[0] = 2;
  b.array[1].p = 'qux';
  b.array[1].a[0] = 2;

  //console.log( b.array[0] === A.array[0] );
  //console.log( A.array[0] );

  assert.notEqual(b.array[0], A.array[0], 'Modifying property value primitives of a new instance should not affect Base object');
  assert.notEqual(b.array[1].p, A.array[1].p, 'Modifying property value objects (object) of a new instance should not affect Base object');
  assert.notEqual(b.array[1].a[0], A.array[1].a[0], 'Modifying property value objects (array) of a new instance should not affect Base object');
};


if (module == require.main)
  require('test').run(exports);

})
