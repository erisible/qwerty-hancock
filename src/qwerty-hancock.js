/*
 * Qwerty Hancock keyboard library v0.5.1
 * The web keyboard for now people.
 * Copyright 2012-15, Stuart Memo
 *
 * Licensed under the MIT License
 * http://opensource.org/licenses/mit-license.php
 *
 * http://stuartmemo.com/qwerty-hancock
 */

(function () {
  var root = this
  /* In <script> context, `this` is the window.
   * In node context (browserify), `this` is the node global.
   */
  var globalWindow = typeof global === 'undefined' ? root : root.window
  var version = '0.5.1'
  var settings = {}
  var mouseIsDown = false
  var keysDown = {}
  var keyMap = {
    65: 'Cl',
    87: 'C#l',
    83: 'Dl',
    69: 'D#l',
    68: 'El',
    70: 'Fl',
    84: 'F#l',
    71: 'Gl',
    89: 'G#l',
    90: 'G#l',
    72: 'Al',
    85: 'A#l',
    74: 'Bl',
    75: 'Cu',
    79: 'C#u',
    76: 'Du',
    80: 'D#u',
    59: 'Eu',
    186: 'Eu',
    222: 'Fu',
    221: 'F#u',
    220: 'Gu'
  }
  var handlerKeyboardDown
  var handlerKeyboardUp
  var handlerMouseEvent

  /**
   * Calculate width of white key.
   * @return {number} Width of a single white key in pixels.
   */
  var getWhiteKeyWidth = function (numberOfWhiteKeys) {
    return Math.floor((settings.width - numberOfWhiteKeys) / numberOfWhiteKeys)
  }

  /**
   * Merge user settings with defaults.
   * @param  {object} userSettings
   */
  var init = function (us) {
    var userSettings = us || {}

    settings = {
      id: userSettings.id || 'keyboard',
      octaves: userSettings.octaves || 3,
      width: userSettings.width,
      height: userSettings.height,
      startNote: userSettings.startNote || 'A3',
      whiteKeyColour: userSettings.whiteKeyColour || '#fff',
      blackKeyColour: userSettings.blackKeyColour || '#000',
      activeColour: userSettings.activeColour || 'yellow',
      borderColour: userSettings.borderColour || '#000',
      keyboardLayout: userSettings.keyboardLayout || 'en'
    }

    var container = document.getElementById(settings.id)

    if (typeof settings.width === 'undefined') {
      settings.width = container.offsetWidth
    }

    if (typeof settings.height === 'undefined') {
      settings.height = container.offsetHeight
    }

    settings.startOctave = parseInt(settings.startNote.charAt(1), 10)

    createKeyboard()
    addListeners.call(this, container)
  }

  /**
   * Rebuild keyboard with new settings
   * @param {object} us 
   * @param {string} key
   * @param {number|string} value 
   */
  var change = function (us, key, value) {
    this.destroy()
    us[key] = value
    init.call(this, us)
  }

  /**
   * Get frequency of a given note.
   * @param  {string} note Musical note to convert into hertz.
   * @return {number} Frequency of note in hertz.
   */
  var getFrequencyOfNote = function (note) {
    var notes = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#']
    var keyNumber
    var octave

    if (note.length === 3) {
      octave = note.charAt(2)
    } else {
      octave = note.charAt(1)
    }

    keyNumber = notes.indexOf(note.slice(0, -1))

    if (keyNumber < 3) {
      keyNumber = keyNumber + 12 + ((octave - 1) * 12) + 1
    } else {
      keyNumber = keyNumber + ((octave - 1) * 12) + 1
    }

    return 440 * Math.pow(2, (keyNumber - 49) / 12)
  }

  /**
   * Lighten up man. Change the colour of a key.
   * @param  {element} el DOM element to change colour of.
   */
  var lightenUp = function (el) {
    if (el !== null || typeof el === 'undefined') {
      el.style.backgroundColor = settings.activeColour
    }
  }

  /**
   * Revert key to original colour.
   * @param  {element} el DOM element to change colour of.
   */
  var darkenDown = function (el) {
    if (el !== null) {
      if (el.getAttribute('data-note-type') === 'white') {
        el.style.backgroundColor = settings.whiteKeyColour
      } else {
        el.style.backgroundColor = settings.blackKeyColour
      }
    }
  }

  /**
   * Order notes into order defined by starting key in settings.
   * @param {array} notesToOrder Notes to be ordered.
   * @return {array{ orderedNotes Ordered notes.
   */
  var orderNotes = function (notesToOrder) {
    var i
    var keyOffset = 0
    var numberOfNotesToOrder = notesToOrder.length
    var orderedNotes = []

    for (i = 0; i < numberOfNotesToOrder; i++) {
      if (settings.startNote.charAt(0) === notesToOrder[i]) {
        keyOffset = i
        break
      }
    }

    for (i = 0; i < numberOfNotesToOrder; i++) {
      if (i + keyOffset > numberOfNotesToOrder - 1) {
        orderedNotes[i] = notesToOrder[i + keyOffset - numberOfNotesToOrder]
      } else {
        orderedNotes[i] = notesToOrder[i + keyOffset]
      }
    }

    return orderedNotes
  }

  /**
   * Add styling to individual white key.
   * @param  {element} el White key DOM element.
   */
  var styleWhiteKey = function (key) {
    key.el.style.backgroundColor = settings.whiteKeyColour
    key.el.style.border = '1px solid ' + settings.borderColour
    key.el.style.borderRight = 0
    key.el.style.height = settings.height + 'px'
    key.el.style.width = key.width + 'px'
    key.el.style.borderRadius = '0 0 5px 5px'

    if (key.noteNumber === getTotalWhiteKeys() - 1) {
      key.el.style.border = '1px solid ' + settings.borderColour
    }
  }

  /**
   * Add styling to individual black key.
   * @param  {element} el Black key DOM element.
   */
  var styleBlackKey = function (key) {
    var whiteKeyWidth = getWhiteKeyWidth(getTotalWhiteKeys())
    var blackKeyWidth = Math.floor(whiteKeyWidth / 2)

    key.el.style.backgroundColor = settings.blackKeyColour
    key.el.style.border = '1px solid ' + settings.borderColour
    key.el.style.position = 'absolute'
    key.el.style.left = Math.floor(((whiteKeyWidth + 1) * (key.noteNumber + 1)) - (blackKeyWidth / 2)) + 'px'
    key.el.style.width = blackKeyWidth + 'px'
    key.el.style.height = (settings.height / 1.5) + 'px'
    key.el.style.borderRadius = '0 0 3px 3px'
  }

  /**
   * Add styling to individual key on keyboard.
   * @param  {object} key Element of key.
   */
  var styleKey = function (key) {
    key.el.style.display = 'inline-block'
    key.el.style['-webkit-user-select'] = 'none'

    if (key.colour === 'white') {
      styleWhiteKey(key)
    } else {
      styleBlackKey(key)
    }
  }

  /**
   * Reset styles on keyboard container and list element.
   * @param {element} keyboard Keyboard container DOM element.
   */
  var styleKeyboard = function (keyboard) {
    var styleElement = function (el) {
      el.style.cursor = 'default'
      el.style.fontSize = '0px'
      el.style.height = settings.height + 'px'
      el.style.padding = 0
      el.style.position = 'relative'
      el.style.listStyle = 'none'
      el.style.margin = 0
      el.style.width = settings.width + 'px'
      el.style['-webkit-user-select'] = 'none'
    }

    styleElement(keyboard.container)
    styleElement(keyboard.el)
  }

  /**
   * Call user's mouseDown event.
   */
  var mouseDown = function (element, callback) {
    if (element.tagName.toLowerCase() === 'li') {
      mouseIsDown = true
      lightenUp(element)
      callback(element.title, getFrequencyOfNote(element.title))
    }
  }

  /**
   * Call user's mouseUp event.
   */
  var mouseUp = function (element, callback) {
    if (element.tagName.toLowerCase() === 'li') {
      mouseIsDown = false
      darkenDown(element)
      callback(element.title, getFrequencyOfNote(element.title))
    }
  }

  /**
   * Call user's mouseDown if required.
   */
  var mouseOver = function (element, callback) {
    if (mouseIsDown) {
      lightenUp(element)
      callback(element.title, getFrequencyOfNote(element.title))
    }
  }

  /**
   * Call user's mouseUp if required.
   */
  var mouseOut = function (element, callback) {
    if (mouseIsDown) {
      darkenDown(element)
      callback(element.title, getFrequencyOfNote(element.title))
    }
  }

  /**
   * Create key DOM element.
   * @return {object} Key DOM element.
   */
  var createKey = function (key) {
    key.el = document.createElement('li')
    key.el.id = key.id
    key.el.title = key.id
    key.el.setAttribute('data-note-type', key.colour)

    styleKey(key)

    return key
  }

  var getTotalWhiteKeys = function () {
    return settings.octaves * 7
  }

  var createKeys = function () {
    var that = this
    var i
    var key
    var keys = []
    var noteCounter = 0
    var octaveCounter = settings.startOctave
    var totalWhiteKeys = getTotalWhiteKeys()

    for (i = 0; i < totalWhiteKeys; i++) {
      if (i % this.whiteNotes.length === 0) {
        noteCounter = 0
      }

      var bizarreNoteCounter = this.whiteNotes[noteCounter]

      if ((bizarreNoteCounter === 'C') && (i !== 0)) {
        octaveCounter++
      }

      key = createKey({
        colour: 'white',
        octave: octaveCounter,
        width: getWhiteKeyWidth(totalWhiteKeys),
        id: this.whiteNotes[noteCounter] + octaveCounter,
        noteNumber: i
      })

      keys.push(key.el)

      if (i !== totalWhiteKeys - 1) {
        this.notesWithSharps.forEach(function (note, index) {
          if (note === that.whiteNotes[noteCounter]) {
            key = createKey({
              colour: 'black',
              octave: octaveCounter,
              width: getWhiteKeyWidth(totalWhiteKeys) / 2,
              id: that.whiteNotes[noteCounter] + '#' + octaveCounter,
              noteNumber: i
            })

            keys.push(key.el)
          }
        })
      }
      noteCounter++
    }

    return keys
  }

  var addKeysToKeyboard = function (keyboard) {
    keyboard.keys.forEach(function (key) {
      keyboard.el.appendChild(key)
    })
  }

  var setKeyPressOffset = function (sortedWhiteNotes) {
    settings.keyPressOffset = sortedWhiteNotes[0] === 'C' ? 0 : 1
  }

  var createKeyboard = function () {
    var keyboard = {
      container: document.getElementById(settings.id),
      el: document.createElement('ul'),
      whiteNotes: orderNotes(['C', 'D', 'E', 'F', 'G', 'A', 'B']),
      notesWithSharps: orderNotes(['C', 'D', 'F', 'G', 'A'])
    }

    keyboard.keys = createKeys.call(keyboard)

    setKeyPressOffset(keyboard.whiteNotes)
    styleKeyboard(keyboard)

    // Add keys to keyboard, and keyboard to container.
    addKeysToKeyboard(keyboard)

    keyboard.container.appendChild(keyboard.el)

    return keyboard
  }

  var destroyKeyboard = function () {
    var container = document.getElementById(settings.id)

    container.innerHTML = ''
    container.removeAttribute('style')
  }

  var getKeyPressed = function (keyCode) {
    return keyMap[keyCode]
      .replace('l', parseInt(settings.startOctave, 10) + settings.keyPressOffset)
      .replace('u', (parseInt(settings.startOctave, 10) + settings.keyPressOffset + 1)
        .toString())
  }

  /**
   * Handle a keyboard key being pressed.
   * @param {object} key The keyboard event of the currently pressed key.
   * @param {callback} callback The user's noteDown function.
   * @return {boolean} true if it was a key (combo) used by qwerty-hancock
   */
  var keyboardDown = function (key, callback) {
    var keyPressed

    if (key.keyCode in keysDown) {
      return false
    }

    keysDown[key.keyCode] = true

    if (typeof keyMap[key.keyCode] !== 'undefined') {
      keyPressed = getKeyPressed(key.keyCode)

      // Call user's noteDown function.
      callback(keyPressed, getFrequencyOfNote(keyPressed))
      lightenUp(document.getElementById(keyPressed))
      return true
    }
    return false
  }

  /**
   * Handle a keyboard key being released.
   * @param {element} key The DOM element of the key that was released.
   * @param {callback} callback The user's noteDown function.
   * @return {boolean} true if it was a key (combo) used by qwerty-hancock
   */
  var keyboardUp = function (key, callback) {
    var keyPressed

    delete keysDown[key.keyCode]

    if (typeof keyMap[key.keyCode] !== 'undefined') {
      keyPressed = getKeyPressed(key.keyCode)
      // Call user's noteDown function.
      callback(keyPressed, getFrequencyOfNote(keyPressed))
      darkenDown(document.getElementById(keyPressed))
      return true
    }
    return false
  }

  /**
   * Determine whether pressed key is a modifier key or not.
   * @param {KeyboardEvent} The keydown event of a pressed key
   */
  var isModifierKey = function (key) {
    return key.ctrlKey || key.metaKey || key.altKey
  }

  /**
   * Handler for the 'keydown' action
   * @param {object} event
   */
  var handleKeyboardDown = function (event) {
    if (isModifierKey(event)) {
      return
    }
    if (keyboardDown(event, this.keyDown)) {
      event.preventDefault()
    }
  }

  /**
   * Handle method for the 'keyup' action
   * @param {object} event
   */
  var handleKeyboardUp = function (event) {
    if (isModifierKey(event)) {
      return
    }
    if (keyboardUp(event, this.keyUp)) {
      event.preventDefault()
    }
  }

  /**
   * Generic handle method for mouse|touch events
   * @param {object} event
   */
  var handleMouseEvent = function (event) {
    switch (event.type) {
      case 'mousedown':
      case 'touchstart':
        mouseDown(event.target, this.keyDown)
        break
      case 'mouseup':
      case 'touchend':
        mouseUp(event.target, this.keyUp)
        break
      case 'mouseover':
        mouseOver(event.target, this.keyDown)
        break
      case 'mouseout':
      case 'touchleave':
      case 'touchcancel':
        mouseOut(event.target, this.keyUp)
        break
    }
  }

  /**
   * Add event listeners to keyboard.
   * @param {element} keyboardElement
   */
  var addListeners = function (keyboardElement) {
    // functions with bind() provide new references, saving them in variables makes the later events remove possible
    handlerKeyboardDown = handleKeyboardDown.bind(this)
    handlerKeyboardUp = handleKeyboardUp.bind(this)
    handlerMouseEvent = handleMouseEvent.bind(this)

    // Key is pressed down on keyboard.
    globalWindow.addEventListener('keydown', handlerKeyboardDown)

    // Key is released on keyboard.
    globalWindow.addEventListener('keyup', handlerKeyboardUp)

    // Mouse is clicked down on keyboard element.
    keyboardElement.addEventListener('mousedown', handlerMouseEvent)

    // Mouse is released from keyboard element.
    keyboardElement.addEventListener('mouseup', handlerMouseEvent)

    // Mouse is moved over keyboard element.
    keyboardElement.addEventListener('mouseover', handlerMouseEvent)

    // Mouse is moved out of keyvoard element.
    keyboardElement.addEventListener('mouseout', handlerMouseEvent)

    // Device supports touch events.
    if ('ontouchstart' in document.documentElement) {
      keyboardElement.addEventListener('touchstart', handlerMouseEvent)

      keyboardElement.addEventListener('touchend', handlerMouseEvent)

      keyboardElement.addEventListener('touchleave', handlerMouseEvent)

      keyboardElement.addEventListener('touchcancel', handlerMouseEvent)
    }
  }

  /**
   * Remove event listeners to keyboard.
   * @param {element} keyboardElement
   */
  var removeListeners = function (keyboardElement) {
    globalWindow.removeEventListener('keydown', handlerKeyboardDown)

    globalWindow.removeEventListener('keyup', handlerKeyboardUp)

    keyboardElement.removeEventListener('mousedown', handlerMouseEvent)

    keyboardElement.removeEventListener('mouseup', handlerMouseEvent)

    keyboardElement.removeEventListener('mouseover', handlerMouseEvent)

    keyboardElement.removeEventListener('mouseout', handlerMouseEvent)

    // Device supports touch events.
    if ('ontouchstart' in document.documentElement) {
      keyboardElement.removeEventListener('touchstart', handlerMouseEvent)

      keyboardElement.removeEventListener('touchend', handlerMouseEvent)

      keyboardElement.removeEventListener('touchleave', handlerMouseEvent)

      keyboardElement.removeEventListener('touchcancel', handlerMouseEvent)
    }
  }

  var isUndef = function (value) {
    return typeof settings[value] === 'undefined'
  }

  /**
   * Qwerty Hancock constructor.
   * @param {object} settings Optional user settings.
   */
  var QwertyHancock = function (settings) {
    this.version = version

    this.keyDown = function () {
      // Placeholder function.
    }

    this.keyUp = function () {
      // Placeholder function.
    }

    init.call(this, settings)
  }

  /**
   * Get user settings value
   * @param   {string} key
   * @returns {number|string} value
   */
  QwertyHancock.prototype.get = function (key) {
    if (!isUndef(key)) {
      return settings[key]
    } else {
      throw new Error('QwertyHancock.get: "' + key + '" doesn\'t exist.')
    }
  }

  /**
   * Set user settings value
   * @param {string} key
   * @param {number|string}
   */
  QwertyHancock.prototype.set = function (key, value) {
    if (!isUndef(key)) {
      change.call(this, settings, key, value)
    } else {
      throw new Error('QwertyHancock.set: "' + key + '" doesn\'t exist.')
    }
  }

  QwertyHancock.prototype.destroy = function () {
    var container = document.getElementById(settings.id)
    removeListeners.call(this, container)
    destroyKeyboard()
  }

  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = QwertyHancock
    }
    exports.QwertyHancock = QwertyHancock
  } else {
    root.QwertyHancock = QwertyHancock
  }
})(this)
