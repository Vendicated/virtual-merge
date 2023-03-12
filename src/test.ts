import assert from "assert/strict";
import virtualMerge from ".";

const obj1 = {
    foo: "foo"
};
const obj2 = {
    bar: "bar"
};
const obj3 = {
    baz: "baz"
};

const merged = virtualMerge(obj1, obj2, obj3);
const mergedAny = merged as any;

assert.equal(Object.keys(merged).length, 3);

assert(Object.prototype.hasOwnProperty.call(merged, "foo"));
assert(!Object.prototype.hasOwnProperty.call(merged, "foreign"));

obj1.foo = "foobar";
assert.equal(obj1.foo, merged.foo);

merged.foo = "foobaz";
assert.equal(obj1.foo, merged.foo);

mergedAny.foreign = "Hi";
assert.equal(mergedAny.foreign, "Hi");
assert(Object.prototype.hasOwnProperty.call(merged, "foreign"));
assert.equal(Object.keys(merged).length, 4);

assert.deepEqual(Object.getOwnPropertyDescriptor(merged, "baz"), Object.getOwnPropertyDescriptor(merged, "baz"));

[obj1, obj2, obj3].forEach(obj => assert.equal(Object.keys(obj).length, 1));
