/* eslint-env jasmine */
/* global QwertyHancock, pressKey */
/* eslint no-unused-vars: "off" */
describe('Qwerty Hancock tests', function () {
  'use strict'

  var element

  beforeEach(function () {
    element = document.createElement('div')
    element.id = 'keyboard'
    document.body.appendChild(element)
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

    expect(element.offsetWidth).toBe(500)
    expect(element.offsetHeight).toBe(300)
  })

  it('Keyboard without specified dimensions uses element dimensions', function () {
    element.style.width = '200px'
    element.style.height = '100px'

    var qh = new QwertyHancock()
    expect(element.querySelector('ul').style.width).toBe(element.style.width)
    expect(element.querySelector('ul').style.height).toBe(element.style.height)
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

  it('When user presses key on computer keyboard, related keyboard key should change colour', function () {
    var qh = new QwertyHancock()
    var c4Key = document.querySelector('#C4')

    pressKey(65)

    expect(c4Key.style.backgroundColor).toBe('yellow')
  })

  it('When user presses modifier key on computer keyboard, related keyboard key should not change colour', function () {
    var qh = new QwertyHancock()
    var d4Key = document.querySelector('#D4')

    pressKey(83, {
      metaKey: true
    })

    expect(d4Key.style.backgroundColor).not.toBe('yellow')
    expect(d4Key.style.backgroundColor).toBe('rgb(255, 255, 255)')
  })

  afterEach(function () {
    document.body.removeChild(element)
  })
})
