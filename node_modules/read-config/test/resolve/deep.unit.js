'use strict';

const libmodule = 'resolve/deep',
    deep = requireLib(libmodule),
    expect = require('chai').expect;

describe(`${libmodule} test:`, () => {

    function shouldPick(obj, prop, result) {
        it(`should pick proprty: \'${prop}\' from ${JSON.stringify(obj)}`, () => {
            const picked = deep.pick(obj, prop);
            expect(picked).to.exist;
            expect(picked).to.be.eql({
                prop: result.prop,
                obj: result.obj,
                value: result.obj[result.prop]
            });
            expect(picked.obj).to.be.equal(result.obj);
        });
    }

    function shouldNotPick(obj, prop) {
        it(`should not pick proprty: \'${prop}\' from ${JSON.stringify(obj)}`, () => {
            const picked = deep.pick(obj, prop);
            expect(picked).to.not.exist;
        });
    }

    let obj = { a: 1 };
    shouldPick(obj, 'a', { prop: 'a', obj });
    obj = { a: { b: 2 } };
    shouldPick(obj, 'a.b', { prop: 'b', obj: obj.a });
    obj = ['a', 'b', 'c'];
    shouldPick(obj, '1', { prop: '1', obj });
    obj = { arr: ['a', 'b', 'c'] };
    shouldPick(obj, 'arr.1', { prop: '1', obj: obj.arr });

    shouldNotPick({ a: 1 }, 'b');
    shouldNotPick({ a: { c: 2 } }, 'a.b');
    shouldNotPick(['a', 'b', 'c'], '10');
    shouldNotPick({ arr: ['a', 'b', 'c'] }, 'arr.10');

    function shouldPut(obj, prop, value, result) {
        it(`should put proprty: \'${prop}\' from ${JSON.stringify(obj)}`, () => {
            let picked;
            deep.put(obj, prop, value);
            picked = deep.pick(obj, prop);
            expect(picked).to.exist;
            expect(picked).to.be.eql({
                prop: result.prop,
                obj: result.obj,
                value: result.obj[result.prop]
            });
        });
    }

    obj = { a: 1 };
    shouldPut(obj, 'b', 999, { prop: 'b', obj });
    obj = { a: 1 };
    shouldPut(obj, 'b.c', 999, { prop: 'c', obj: { c: 999 } });
    obj = { a: 1, b: { d: 1 } };
    shouldPut(obj, 'b.c', 999, { prop: 'c', obj: { c: 999, d: 1 } });

});
