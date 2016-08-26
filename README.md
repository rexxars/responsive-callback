# responsive-callback

Logs a message to users if callback has not been called within given time

## Installation

```shell
npm install --save responsive-callback
```

## Usage

Basically: `responsiveCallback(options, callbackToMakeResponsive)`

### Example

```js
const responsiveCallback = require('responsive-callback')
const needle = require('needle')

const onResponse = function(error, response) {
  console.log('Got HTTP response:')
  console.log(response.body)
}

const callback = responsiveCallback({
  message: 'Waiting for slow site to respond...'
}, onResponse)

needle.get('http://slow.site/', callback)
```

If `slow.site` takes more than 1500ms to respond, the `Waiting for slow site to respond...` message is logged to console. If the HTTP request responds before this, the message is never displayed.

## Options

* `duration` - Duration in milliseconds to wait before showing message (default: `1500`)
* `message` - A single message to display (default: `Waiting...`)
* `messages` - An array of messages to display. If the user has waited for than `duration`, the first message in the array is displayed. After 2x `duration`, the second message is displayed, and so forth. Stops logging messages when it reachs the last message.
* `notifier` - Function to call instead of logging with `console.log`. The function receives the message as the first argument. Note that when there are no more messages to log, the notifier won't be called anymore.
* `stream` - If set to `true` (or a valid TTY-stream), will write to the stream and clear old messages

## License

MIT-licensed. See LICENSE.
