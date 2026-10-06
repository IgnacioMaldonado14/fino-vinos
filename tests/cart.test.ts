import {test} from 'node:test';
import assert from 'node:assert/strict';
import {addCartLine,normalizeCart,cartTotal} from '../data/cart-model.ts';
const catalog=[{id:'malbec',price:10490,availability:'unconfirmed'},{id:'white',price:4790,availability:'available'},{id:'missing-price',price:null,availability:'unconfirmed'},{id:'sold-out',price:5000,availability:'out-of-stock'}];
test('restores only valid known products and merges duplicate persisted lines',()=>{
 assert.deepEqual(normalizeCart([{id:'malbec',quantity:1},{id:'malbec',quantity:2},{id:'unknown',quantity:3},{id:'white',quantity:2.5},{id:'white',quantity:-1},{id:'missing-price',quantity:1},{id:'sold-out',quantity:1},null],catalog),[{id:'malbec',quantity:3}]);
});
test('handles malformed persistence and bounds restored quantities',()=>{
 assert.deepEqual(normalizeCart({id:'malbec'},catalog),[]);
 assert.deepEqual(normalizeCart([{id:'malbec',quantity:999}],catalog),[{id:'malbec',quantity:99}]);
});
test('quick add increments one line without duplicating or mutating prior state',()=>{
 const original=[{id:'malbec',quantity:1}];
 const result=addCartLine(original,catalog[0],2);
 assert.deepEqual(original,[{id:'malbec',quantity:1}]);assert.deepEqual(result,[{id:'malbec',quantity:3}]);
});
test('rejects unavailable products, missing prices and invalid quantities',()=>{
 for(const quantity of [0,-1,1.5,100,NaN])assert.throws(()=>addCartLine([],catalog[0],quantity));
 assert.throws(()=>addCartLine([],catalog[2],1));assert.throws(()=>addCartLine([],catalog[3],1));
 assert.throws(()=>addCartLine([{id:'malbec',quantity:99}],catalog[0],1));
});
test('totals use catalog prices, not tampered persisted prices',()=>{
 const lines=normalizeCart([{id:'malbec',quantity:2,price:1},{id:'white',quantity:1,price:0}],catalog);
 assert.equal(cartTotal(lines,catalog),25770);assert.equal(cartTotal([],catalog),0);
});
