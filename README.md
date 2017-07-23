# Qwerty Hancock

This is a fork based on the original [qwerty-hancock](https://github.com/stuartmemo/qwerty-hancock) from [@stuartmemo](https://github.com/stuartmemo).

Need an instant musical keyboard for your web audio project? Qwerty Hancock is just the thing.

Specify the number of octaves you want, give it a height and a width, then you're ready to use your mouse or keyboard to have the time of your life.

## Usage

Add the minified version of the code to your html by adding the following script tag.
```html
<script src="scripts/qwerty-hancock.min.js"></script>
```

## Keyboard

Qwerty Hancock has no dependencies whatsoever. All you need to do is include qwerty-hancock.js near the end of your page and create a keyboard by calling the function below whilst passing an object containing some fairly self-explanitory attributes.

- `id`: The id of the `<div>` that is going to "hold" your keyboard
- `width`: The width in pixels of your keyboard
- `height`: The height in pixels of your keyboard
- `octaves`: The number of octaves your keyboard should span
- `startNote`: The first note of your keyboard with octave
- `whiteNotesColour`: The colour of the white "natural" keys
- `blackNotesColour`: The colour of the black "accidental" keys
- `activeColour`: The keyOn active colour
- `keyboardLayout`: Currently supports `en` and `de`

A real-world example might look like this:

```javascript
var keyboard = new QwertyHancock({
   id: 'keyboard',
   width: 600,
   height: 150,
   octaves: 2,
   startNote: 'A3',
   whiteNotesColour: 'white',
   blackNotesColour: 'black',
   activeColour: 'yellow',
   borderColour: '#000',
   keyboardLayout: 'en'
})
```

This will show us a lovely keyboard, but how do we get it to make some noise? Qwerty Hancock provides two handy hooks into which you can add your own functions.

```javascript
keyboard.keyDown = function (note, frequency) {
  // Your code here
}

keyboard.keyUp = function (note, frequency) {
  // Your code here
}
```
*Source: [Qwerty Hancock homepage](http://stuartmemo.com/qwerty-hancock)*

You can get any avaible option after initialization of the keyboard.
After initialization of a keyboard, you can get or set any available option.

```javascript
keyboard.get('id') // return 'keyboard'
```

You can also set a single parameter by passing in a string and a value or set settings at once by passing in an object.

```javascript
// rebuild keyboard with 3 octaves
keyboard.set('octaves', 3)

// rebuild keyboard inside element with id="new-keyboard" and 3 octaves
keyboard.set({
  'id': 'new-keyboard',
  'octaves': 3
})
```

Furthermore, Qwerty Hancock provides a destructor method which removes all the attached events and deletes the keyboard.

```javascript
keyboard.destroy()
```