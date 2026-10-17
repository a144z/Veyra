import {test} from 'node:test';import assert from 'node:assert/strict';
import {merchantUrl,getPack,demoCard} from '../plugin/src/domain';
test('plugin atomic pack caps are exact',()=>{assert.equal(getPack('holo').maxAmount,'5000000');assert.equal(getPack('chase').maxAmount,'10000000')});
test('missing merchant cannot create a paid request',()=>assert.throws(()=>merchantUrl(undefined,'holo'),/unavailable/));
test('merchant endpoint binds the pack and rejects unsafe URLs',()=>{assert.equal(merchantUrl('https://merchant.example/rip','holo'),'https://merchant.example/rip?pack=holo');for(const s of ['http://merchant.example/rip','https://merchant.example:8443/rip','https://u:p@merchant.example/rip','https://merchant.example/rip?secret=x','https://localhost/rip','https://127.0.0.1/rip'])assert.throws(()=>merchantUrl(s,'base'))});
test('demo is deterministic, bounded and chase targets Charizard',()=>{assert.deepEqual(demoCard('holo',2),demoCard('holo',2));assert.equal(demoCard('chase',42).name,'Charizard');assert.equal(demoCard('base',2147483647).id,'base1-2')});
