var defaultOpts = {
  duration: 1500,
  messages: ['Waiting...'],
  notifier: null
}

module.exports = function (options, callback) {
  var cb = callback ? callback : options
  var opts = Object.assign({}, defaultOpts, callback ? options : {})

  if (typeof options === 'string') {
    opts = Object.assign({}, defaultOpts, {messages: [opts]})
  } else if (opts.message) {
    opts.messages = [opts.message]
  }

  var iterations = 0
  var lastMsgIndex = opts.messages.length - 1
  var timer = setInterval(function () {
    // If we have a custom notifier, pass the message and the number of iterations
    if (opts.notifier) {
      opts.notifier(opts.messages[iterations] || opts.messages[0], ++iterations)
      return
    }

    // Don't try to log if we have no more messages to show
    if (iterations > lastMsgIndex) {
      return
    }

    // Log the corresponding message
    var msg = opts.messages[iterations++]
    console.log(msg) // eslint-disable-line no-console
  }, opts.duration)

  return function () {
    clearInterval(timer)
    cb.apply(undefined, arguments)
  }
}
