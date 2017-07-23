/* eslint-env jasmine */
/* eslint no-unused-vars: "off" */
'use strict'

var testDom = require('./helpers/test-dom')

describe('QwertyHancock', function () {
  var element, QwertyHancock

  beforeEach(function () {
    testDom('<html><body></body></html>')
    element = document.createElement('div')
    element.id = 'keyboard'
    document.body.appendChild(element)
    QwertyHancock = require('../src/qwerty-hancock')
  })

  it('is node requirable', function () {
    expect(QwertyHancock).toExist()
  })

  it('Can create keyboard without any user settings', function () {
    var qh = new QwertyHancock()

    expect(element.id).toBe('keyboard')
    expect(element.querySelectorAll('li').length).toBeGreaterThan(0)
  })

  it('Can create keyboard with user specified dimensions', function () {
    var qh = new QwertyHancock({
      width: 500,
      height: 300
    })

    expect(element.style.width).toBe('500px')
    expect(element.style.height).toBe('300px')
  })

  it('White keys should be white by default', function () {
    var qh = new QwertyHancock()
    var whiteKeys = element.querySelectorAll('li[data-note-type="white"]')

    for (var i = 0; i < whiteKeys.length; i++) {
      expect(whiteKeys[i].style.backgroundColor).toBe('rgb(255, 255, 255)')
    }
  })

  it('Black keys should be black by default', function () {
    var qh = new QwertyHancock()
    var blackKeys = element.querySelectorAll('li[data-note-type="black"]')

    for (var i = 0; i < blackKeys.length; i++) {
      expect(blackKeys[i].style.backgroundColor).toBe('rgb(0, 0, 0)')
    }
  })

  it('White keys should be user defined colour', function () {
    var qh = new QwertyHancock({
      whiteKeyColour: '#333'
    })
    var whiteKeys = element.querySelectorAll('li[data-note-type="white"]')

    for (var i = 0; i < whiteKeys.length; i++) {
      expect(whiteKeys[i].style.backgroundColor).toBe('rgb(51, 51, 51)')
    }
  })

  it('Black keys should be user defined colour', function () {
    var qh = new QwertyHancock({
      blackKeyColour: 'red'
    })
    var blackKeys = element.querySelectorAll('li[data-note-type="black"]')

    for (var i = 0; i < blackKeys.length; i++) {
      expect(blackKeys[i].style.backgroundColor).toBe('red')
    }
  })

  it('First key on keyboard should be user defined note', function () {
    var qh = new QwertyHancock({
      startNote: 'C4'
    })
    var firstWhiteKey = element.querySelector('li[data-note-type="white"]')

    expect(firstWhiteKey.id).toBe('C4')
  })

  it('Can get a setting value', function () {
    var qh = new QwertyHancock()

    expect(qh.get('id')).toBe('keyboard')
  })

  it('Can destroy keyboard', function () {
    var qh = new QwertyHancock()
    qh.destroy()

    expect(element.querySelectorAll('li').length).toEqual(0)
  })

  describe('Tests with new element container', function () {
    'use strict'

    var newElement

    beforeEach(function () {
      newElement = document.createElement('div')
      newElement.id = 'new-keyboard'
      document.body.appendChild(newElement)
    })

    it('Can set a single parameter after initialization', function () {
      var qh = new QwertyHancock()
      qh.set('id', 'new-keyboard')

      expect(qh.get('id')).toBe('new-keyboard')
      expect(newElement.querySelectorAll('li').length).toBeGreaterThan(0)
      expect(element.querySelectorAll('li').length).toEqual(0)
    })

    it('Can set multiple parameters at once after initialization', function () {
      var qh = new QwertyHancock()
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
      document.body.removeChild(newElement)
    })
  })

  afterEach(function () {
    document.body.removeChild(element)
    delete global.document
    delete global.window
  })
})
