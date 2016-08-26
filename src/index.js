var noop = function () {} //eslint-disable-line no-empty-function
var defaultOpts = {
  duration: 1500,
  messages: ['Waiting...'],
  notifier: null
}

module.exports = function (options, callback) {
  var cb = callback ? callback : options
  var opts = Object.assign({}, defaultOpts, callback ? options : {})
  var stream = options.stream

  if (typeof options === 'string') {
    opts = Object.assign({}, defaultOpts, {messages: [opts]})
  } else if (opts.message) {
    opts.messages = [opts.message]
  }

  if (stream) {
    stream = stream === true ? process.stderr : stream
    stream = stream.isTTY ? stream : false
    opts.notifier = noop
  }

  var iterations = 0
  var numMessages = opts.messages.length
  var timer = setInterval(function () {
    // Don't try to log if we have no more messages to show
    if (++iterations > numMessages) {
      return
    }

    if (stream) {
      stream.clearLine()
      stream.cursorTo(0)
      stream.write(opts.messages[iterations - 1])
      return
    }

    // If we have a custom notifier, pass the message
    if (opts.notifier) {
      opts.notifier(opts.messages[iterations - 1])
      return
    }

    // Log the corresponding message
    var msg = opts.messages[iterations - 1]
    console.log(msg) // eslint-disable-line no-console
  }, opts.duration)

  return function () {
    if (stream) {
      stream.clearLine()
      stream.cursorTo(0)
    }

    clearInterval(timer)
    cb.apply(undefined, arguments)
  }
}
