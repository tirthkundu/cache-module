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
let getAllKeysStub
let deleteKeyStub

describe('#cache controller', function() {

    before(function(done) {
        randomStringStub = sinon
            .stub(utilities, 'createRandomString')
            .callsFake(function(keyName) {
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
                if(keyName == 'qazf'){
                    return Promise.reject(
                        'Error'
                    )
                }else {
                    return Promise.resolve(
                        true
                    )
                }
            })
        done()
    })
    after(function(done) {
        updateValueStub.restore()
        done()
    })

    before(function(done) {
        deleteKeyStub = sinon
            .stub(cacheModel, 'deleteKey')
            .callsFake(function(keyName,value) {
                if(keyName == 'qazf'){
                    return Promise.reject(
                        'Error'
                    )
                }else {
                    return Promise.resolve(
                        true
                    )
                }
            })
        done()
    })
    after(function(done) {
        deleteKeyStub.restore()
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

    before(function(done) {
        getAllKeysStub = sinon
            .stub(cacheModel, 'getAllKeys')
            .callsFake(function(keyName) {
                return Promise.resolve([{ _id: '5e89e1908b10813e1ed02c5a',
                    key: 'abcd',
                    value: 'BK1586094483554',
                    createdAt: '2020-04-05T13:48:00.062Z' },
                    { _id: '5e89e26dd100c13fc8f4f774',
                        key: 'xyz',
                        value: 'BK1586096867628',
                        createdAt: '2020-04-05T14:27:52.868Z' } ]
                )

            })
        done()
    })
    after(function(done) {
        getAllKeysStub.restore()
        done()
    })

    // cache test cases
    describe('#getKeyValue', function() {


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

    describe('#getKeyValue', function() {


        it('should return keys available in cache', async function() {
            const resp =  await cache.getAllKeys()
            resp.allKeys[0].should.eql('abcd')
            resp.allKeys[1].should.eql('xyz')

        })

    })

    describe('#updateKey', function() {

        it('should return success if key is updated', async function() {
            const resp =  await cache.updateKey({keyName:'xyz'})
            resp.success.should.eql(true)

        })

        it('should return error if key is not updated', async function() {
            try {
                await cache.updateKey({keyName: 'qazf'})
            } catch (e) {
                e.should.containEql('Error')
            }
        })

    })

    describe('#deleteKey', function() {

        it('should return success if key is deleted', async function() {
            const resp =  await cache.deleteKey({keyName:'xyz'})
            resp.success.should.eql(true)

        })

        it('should return error if key is not deleted', async function() {
            try {
                await cache.deleteKey({keyName: 'qazf'})
            } catch (e) {
                e.should.containEql('Error')
            }
        })

    })
})
