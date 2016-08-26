const responsive = require('./')

const duration = 500
const messages = [
  'Waiting...',
  'Ever so patiently',
  'For this thing',
  'To complete',
  'Should be done right about now.'
]

const callback = responsive(
  {duration, messages, stream: true},
  res => console.log(res) // eslint-disable-line no-console
)

setTimeout(callback, duration * (messages.length + 1), 'Super done, now!')
