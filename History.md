# Changes #

## 1.0.2 / 2015-04-07
  - Fixed #16: instances properties defined through objects are not mutable

## 1.0.1 / 2015-04-03
  - Updated bower.json authors
  - I messed up publishing with npm so I need to create this version

## 1.0.0 / 2015-03-02

  - Mocha + should for testing
  - We now mess with the prototypes so we can call `new Foo()` instead of
      `Foo.new()`. This means that most of the calls that were made with `Foo`
      are now made with `Foo.prototype` except `extend` which is still made on
      the object and not on its prototype.
  - `instanceof` should now be working but this feature is not tested

## 0.3.3 / 2014-11-02

  - Updated requirejs compatibility

## 0.3.2 / 2011-12-29

  - Fix `package.json` so that npm no longer complains.

## 0.3.1 / 2011-12-29

  - Enable compatibility with latest nodes.
  - Enable travis tests.

## 0.3.0 / 2011-08-14

  - Introduce `megre` method.

## 0.2.2 / 2011-07-03 ##

  - Quote method `new` for pre ES5 JS engines so that library can be loaded and
    method can be aliased with `create` for example.

## 0.2.1 / 2011-06-28 ##

 - Removed obsolete package dependency.

## 0.2.0 / 2011-06-28 ##

 - Adding `initialize` method for that is called by `new` on each instance
   initialization.
 - Documentation!

## 0.1.0 / 2011-06-27 ##

 - Reducing API complexity by removing experimental `Base` as function form.
 - Change meaning of `.new` that returning new instance of the class instead
   of direct decedent of a target.
 - Change `extend` so that it may take multiple property maps.

## 0.0.3 / 2011-06-21 ##

 - Fixing delegation to `Base.new`.

## 0.0.2 / 2011-06-15 ##

  - Improve readme.
  - Bug fix.

## 0.0.1 / 2011-06-15 ##

  - Initial release
