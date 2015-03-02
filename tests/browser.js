describe('#isPrototypeOf', function() {
  it('Base is a prototype of Base.new()', function() {
    expect(Base.isPrototypeOf(Base.new())).toBe(true);
  });
  it('Base is a prototype of Base.extend()', function() {
    expect(Base.isPrototypeOf(Base.extend())).toBe(true);
  });
  it('Base is a prototoype of Base.extend().new()', function() {
    expect(Base.isPrototypeOf(Base.extend().new())).toBe(true);
  });
  it('Base.extend() in not prototype of Base.extend()', function() {
    expect(Base.extend().isPrototypeOf(Base.extend())).toBe(false);
  });
  it('Base.extend() in not prototype of Base.extend().new()', function() {
    expect(Base.extend().isPrototypeOf(Base.extend().new())).toBe(false);
  });
  it('Base.new() is not prototype of Base.new()', function() {
    expect(Base.new().isPrototypeOf(Base.new())).toBe(false);
  });
  it('Base.new() is not prototype of Base.extend()', function() {
    expect(Base.new().isPrototypeOf(Base.extend())).toBe(false);
  });
  it('Base.extend() is not prototype of Base.new()', function() {
    expect(Base.extend().isPrototypeOf(Base.new())).toBe(false);
  });
});

describe('#inheritance', function() {
  var Parent, Child;
  beforeEach(function() {
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
  it('Parent name is parent', function() {
    expect(Parent.name).toBe("parent");
  });
  it('method works on prototype', function() {
    expect(Parent.method()).toBe("hello parent");
  });
  it('Parent instance inherits name', function() {
    expect(Parent.new().name).toBe(Parent.name);
  });
  it('method behaves same on the prototype', function() {
    expect(Parent.new().method()).toBe(Parent.method());
  });
  it('Parent decedent inherits name', function() {
    expect(Parent.extend({}).name).toBe(Parent.name);
  });
  it('Child overides name', function() {
    expect(Child.name).not.toBe(Parent.name);
  });
  it('Child intsances inherit name', function() {
    expect(Child.new().name).toBe(Child.name);
  });
  it('Child decedents inherit name', function() {
    expect(Child.extend().name).toBe(Child.name);
  });

  it('Child inherits method', function() {
    expect(Child.method).toBe(Parent.method);
  });
  it('Child decedent inherit method', function() {
    expect(Child.extend().method).toBe(Parent.method);
  });
  it('Child instances inherit method', function() {
    expect(Child.new().method).toBe(Parent.method);
  });

  it('method refers to instance proprety', function() {
    expect(Child.method()).toBe("hello child");
  });
  it('method may be overrided', function() {
    expect(Child.extend({
      name: "decedent"
    }).new().method()).toBe("hello decedent");
  });
});

describe('#prototype immutability', function() {
  it('Base prototype is imutable', function() {
    var tmp = Base.extend;
    var foo = function() {};
    Base.extend = foo;
    expect(Base.extend).toBe(tmp);
  });
  it('Base prototype is non-configurable', function() {
    var tmp = Base.foo;
    Base.foo = "bar";
    expect(Base.foo).toBe(tmp);
  });
  it('Can\'t delete properties on prototype', function() {
    var tmp = Base.new;
    delete Base.new;
    expect(Base.new).toBe(tmp);
  });
});
