/*
 This file includes test case for cache controller
 We'll stub all I/O calls to remove side-effects
 */
const should = require('should')
const sinon = require('sinon')

const cache = require('../../controllers/cache')
const cacheModel = require('../../models/cache')
const utilities = require('../../services/utilities')

let getKeyStub
let setKeyStub
let updateValueStub
let updateTTLStub
let randomStringStub

describe('#cache controller', function() {
    // cache test cases
    describe('#getKeyValue', function() {

        before(function(done) {
            randomStringStub = sinon
                .stub(utilities, 'createRandomString')
                .callsFake(function(keyName) {
                    console.log('keyName',keyName)
                   if (keyName == 'xyz') {
                        return  'BK15860968673321'

                    } else{
                        return  'BK1586096224322'
                    }
                })
            done()
        })
        after(function(done) {
            randomStringStub.restore()
            done()
        })

        before(function(done) {
            getKeyStub = sinon
                .stub(cacheModel, 'getKeyData')
                .callsFake(function(keyName) {
                    if (keyName == 'abc') {
                        return Promise.resolve('BK1586096867628')
                    } else if(keyName == 'xyz'){
                        return Promise.resolve(0)
                    }else{
                        return Promise.resolve(-1)
                    }
                })
            done()
        })
        after(function(done) {
            getKeyStub.restore()
            done()
        })

        before(function(done) {
            setKeyStub = sinon
                .stub(cacheModel, 'setKeyData')
                .callsFake(function(keyName,value) {
                        return Promise.resolve(
                            true
                        )
                })
            done()
        })
        after(function(done) {
            setKeyStub.restore()
            done()
        })

        before(function(done) {
            updateValueStub = sinon
                .stub(cacheModel, 'updateValue')
                .callsFake(function(keyName,value) {
                    return Promise.resolve(
                        true
                    )
                })
            done()
        })
        after(function(done) {
            updateValueStub.restore()
            done()
        })

        before(function(done) {
            updateTTLStub = sinon
                .stub(cacheModel, 'updateTTL')
                .callsFake(function(keyName) {
                    return Promise.resolve(
                        true
                    )
                })
            done()
        })
        after(function(done) {
            updateTTLStub.restore()
            done()
        })

        // Cache hit
        it('should return value from cache', async function() {

               const resp =  await cache.getKeyValue({keyName:'abc'})
                resp.should.eql({ value: 'BK1586096867628' })

        })

        // cache miss
        it('should generate new string and return the value', async function() {

            const resp = await cache.getKeyValue({keyName:'xyz'})
            resp.should.eql({ value: 'BK15860968673321' })

        })

        // cache expiry
        it('should update expired key with new generated value and return', async function() {

                const resp =  await cache.getKeyValue({keyName:'qaz'})
                resp.should.eql({ value: 'BK1586096224322' })

        })

    })
})
