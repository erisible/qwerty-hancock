/* eslint-env jasmine */
/* global QwertyHancock, pressKey */
/* eslint no-unused-vars: "off" */
describe('Qwerty Hancock tests', function () {
  'use strict'

  var element
  var qh

  beforeEach(function () {
    element = document.createElement('div')
    element.id = 'keyboard'
    document.body.appendChild(element)
  })

  it('Can create keyboard without any user settings', function () {
    qh = new QwertyHancock()

    expect(element.id).toBe('keyboard')
    expect(element.querySelectorAll('li').length).toBeGreaterThan(0)
  })

  it('Can create keyboard with user specified dimensions', function () {
    qh = new QwertyHancock({
      width: 500,
      height: 300
    })

    expect(element.offsetWidth).toBe(500)
    expect(element.offsetHeight).toBe(300)
  })

  it('Keyboard without specified dimensions uses element dimensions', function () {
    element.style.width = '200px'
    element.style.height = '100px'

    qh = new QwertyHancock()
    expect(element.querySelector('ul').style.width).toBe(element.style.width)
    expect(element.querySelector('ul').style.height).toBe(element.style.height)
  })

  it('White keys should be white by default', function () {
    qh = new QwertyHancock()
    var whiteKeys = element.querySelectorAll('li[data-note-type="white"]')

    for (var i = 0; i < whiteKeys.length; i++) {
      expect(whiteKeys[i].style.backgroundColor).toBe('rgb(255, 255, 255)')
    }
  })

  it('Black keys should be black by default', function () {
    qh = new QwertyHancock()
    var blackKeys = element.querySelectorAll('li[data-note-type="black"]')

    for (var i = 0; i < blackKeys.length; i++) {
      expect(blackKeys[i].style.backgroundColor).toBe('rgb(0, 0, 0)')
    }
  })

  it('White keys should be user defined colour', function () {
    qh = new QwertyHancock({
      whiteKeyColour: '#333'
    })
    var whiteKeys = element.querySelectorAll('li[data-note-type="white"]')

    for (var i = 0; i < whiteKeys.length; i++) {
      expect(whiteKeys[i].style.backgroundColor).toBe('rgb(51, 51, 51)')
    }
  })

  it('Black keys should be user defined colour', function () {
    qh = new QwertyHancock({
      blackKeyColour: 'red'
    })
    var blackKeys = element.querySelectorAll('li[data-note-type="black"]')

    for (var i = 0; i < blackKeys.length; i++) {
      expect(blackKeys[i].style.backgroundColor).toBe('red')
    }
  })

  it('First key on keyboard should be user defined note', function () {
    qh = new QwertyHancock({
      startNote: 'C4'
    })
    var firstWhiteKey = element.querySelector('li[data-note-type="white"]')

    expect(firstWhiteKey.id).toBe('C4')
  })

  it('When user presses key on computer keyboard, related keyboard key should change colour', function () {
    qh = new QwertyHancock()
    var c4Key = document.querySelector('#C4')

    pressKey('KeyA')

    expect(c4Key.style.backgroundColor).toBe('yellow')
  })

  it('When user presses modifier key on computer keyboard, related keyboard key should not change colour', function () {
    qh = new QwertyHancock()
    var d4Key = document.querySelector('#D4')

    pressKey('KeyS', {
      metaKey: true
    })

    expect(d4Key.style.backgroundColor).not.toBe('yellow')
    expect(d4Key.style.backgroundColor).toBe('rgb(255, 255, 255)')
  })

  describe('After pause event', function () {
    'use strict'

    beforeEach(function () {
      qh = new QwertyHancock()
      qh.pauseListener()
    })

    it('And resume it, when user presses key on computer keyboard, related keyboard key should change colour', function () {
      qh.resumeListener()
      var e4Key = document.querySelector('#E4')

      pressKey('KeyD')

      expect(e4Key.style.backgroundColor).toBe('yellow')
    })

    it('When user presses key on computer keyboard, related keyboard key should not change colour', function () {
      var g4Key = document.querySelector('#G4')

      pressKey('KeyG')

      expect(g4Key.style.backgroundColor).not.toBe('yellow')
      expect(g4Key.style.backgroundColor).toBe('rgb(255, 255, 255)')
    })
  })

  it('Can get a setting value', function () {
    qh = new QwertyHancock()

    expect(qh.get('id')).toBe('keyboard')
  })

  it('Can destroy keyboard', function () {
    qh = new QwertyHancock()
    qh.destroy()

    expect(element.querySelectorAll('li').length).toEqual(0)

    qh = new QwertyHancock()
  })

  describe('With new element container', function () {
    'use strict'

    var newElement

    beforeEach(function () {
      newElement = document.createElement('div')
      newElement.id = 'new-keyboard'
      document.body.appendChild(newElement)
    })

    it('Can set a single parameter after initialization', function () {
      qh = new QwertyHancock()
      qh.set('id', 'new-keyboard')

      expect(qh.get('id')).toBe('new-keyboard')
      expect(newElement.querySelectorAll('li').length).toBeGreaterThan(0)
      expect(element.querySelectorAll('li').length).toEqual(0)
    })

    it('Can set multiple parameters at once after initialization', function () {
      qh = new QwertyHancock()
      qh.set({
        'id': 'new-keyboard',
        'octaves': 3
      })

      expect(qh.get('id')).toBe('new-keyboard')
      expect(newElement.querySelectorAll('li').length).toBeGreaterThan(0)
      expect(element.querySelectorAll('li').length).toEqual(0)
      expect(qh.get('octaves')).toBe(3)
    })

    afterEach(function () {
      qh.destroy()
      qh = 'undefined'
      document.body.removeChild(newElement)
    })
  })

  afterEach(function () {
    if (qh !== 'undefined') {
      qh.destroy()
    }
    document.body.removeChild(element)
  })
})
