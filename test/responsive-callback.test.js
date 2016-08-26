/* eslint-disable id-length, no-empty-function */
const PassThroughStream = require('stream').PassThrough
const test = require('tape')
const rspcb = require('../')

const noop = () => {}
const getStream = ({isTTY} = {}) => {
  const stream = new PassThroughStream()
  stream.isTTY = isTTY || false
  stream.clearLine = noop
  stream.cursorTo = noop
  return stream
}

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
    notifier: msg => {
      iterations++
      t.equal(msg, 'Some message', 'uses passed message')
    }
  }, res => {
    t.equal(res, result)
    t.equal(iterations, 1)
    t.end()
  }), 85, result)
})

test('can provide messages as option prop', t => {
  const messages = ['first', 'second', 'third']
  let iterations = 0

  setTimeout(rspcb({
    duration: 25,
    messages: messages,
    notifier: msg => {
      iterations++
      t.equal(msg, messages[iterations - 1], 'uses passed message')
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

test('can stream', t => {
  setTimeout(rspcb({
    messages: ['foo', 'bar', 'baz'],
    duration: 150,
    stream: true
  }, t.end), 200)
})

test('does not log when passed a non-TTY stream', t => {
  setTimeout(rspcb({
    messages: ['foo', 'bar', 'baz'],
    duration: 150,
    stream: getStream({isTTY: false})
  }, t.end), 200)
})
