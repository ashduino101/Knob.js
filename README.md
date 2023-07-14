# Knob.js

A simple library for adding flashy knobs to your JavaScript pages.

## Usage
Simple example:

```html
<!-- Add these to the head of your document -->
<script src="knob.js"></script>
<link rel="stylesheet" href="knob.css">
```

```js
// Parameters:
//  - element
//  - diameter (px)
//  - accent color
//  - base color
//  - minimum value
//  - maximum value
//  - initial value
let k = new Knob(document.getElementById('knob'), 48, '#d86bff', '#767680', 0, 100, 0);
// Add a handler for changes
k.onChange = value => console.log(value);
// Set a value between `min` and `max`
k.set(75);
```

## Dependencies
None - this runs entirely within vanilla JS.
