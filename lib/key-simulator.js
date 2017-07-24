/* global KeyboardEvent */
/* eslint no-unused-vars: "off" */
// via http://stackoverflow.com/questions/10455626/keydown-simulation-in-chrome-fires-normally-but-not-the-correct-key/10520017#10520017
var root = this
/* In <script> context, `this` is the window.
 * In node context (browserify), `this` is the node global.
 */
var globalWindow = typeof global === 'undefined' ? root : root.window

var pressKey = function (k, options) {
  options = options || {}

  var oEvent = new KeyboardEvent('keydown', {
    'code': k,
    'metaKey': !!options.metaKey
  })

  globalWindow.dispatchEvent(oEvent)
}
