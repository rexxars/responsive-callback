/* eslint-disable id-length */
const test = require('tape')
const rspcb = require('../')

test('can take a single callback as parameter', t => {
  const result = 'foo'
  setImmediate(rspcb(res => {
    t.equal(res, result)
    t.end()
  }), result)
})

test('does not call notifier if callback is called before timeout', t => {
  const result = 'foo'
  setImmediate(rspcb({
    notifier: () => t.fail('Notifier should not have been called')
  }, res => {
    t.equal(res, result)
    t.end()
  }), result)
})

test('can take a single message string as argument', t => {
  const result = 'foo'
  setImmediate(rspcb('Some message', res => {
    t.equal(res, result)
    t.end()
  }), result)
})

test('can provide message as option prop', t => {
  const result = 'foo'
  let iterations = 0

  setTimeout(rspcb({
    duration: 25,
    message: 'Some message',
    notifier: (msg, it) => {
      t.equal(msg, 'Some message', 'uses passed message')
      t.equal(it, ++iterations, 'iteration count correct')
    }
  }, res => {
    t.equal(res, result)
    t.equal(iterations, 3)
    t.end()
  }), 85, result)
})

test('can provide messages as option prop', t => {
  const messages = ['first', 'second', 'third']
  let iterations = 0

  setTimeout(rspcb({
    duration: 25,
    messages: messages,
    notifier: (msg, it) => {
      t.equal(msg, messages[it - 1] || messages[0], 'uses passed message')
      t.equal(it, ++iterations, 'iteration count correct')
    }
  }, t.end), 150)
})

test('passes on all arguments', t => {
  setImmediate(rspcb((a, b, c) => {
    t.equal(a, 'a')
    t.equal(b, 'b')
    t.equal(c, 'c')
    t.end()
  }), 'a', 'b', 'c')
})

test('console.logs by default', t => {
  setTimeout(rspcb({
    message: '# console.log!',
    duration: 30
  }, t.end), 40)
})

test('stops console.logging when out of messages', t => {
  setTimeout(rspcb({
    messages: ['# first message', '# second message'],
    duration: 10
  }, t.end), 50)
})
