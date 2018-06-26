# Unchained UI

## Contenteditable UI Component

### Usage

```js
import input from 'uc-input-contenteditable'

const elDisplay = get('#display')

const input = new Input({
  onChange: val => {
    console.log('val', val);
  }
}).appendTo(elDisplay);

```

This component follows **Unchained** UI guidelines.

Constructor options:

* el – HTLMElement that should become editable.
* limit — number, the text limit
* debounce – number, default 500ms. Debounce onChange calls
* onChange — function, callback will be called when value is changed
* slugify — boolean, slugify input
* trim — boolean, trim input

### Methods

#### value([val])

if `val` is undefined returns current value, otherwise sets the value.

#### focus()

Sets the focus.

#### blur()

Removes focus.

#### error()

Indicates an error by adding `error` class.

#### remove()

Removes the component.

#### pushTransform(fn)

Adds the transform function to the end of transformation chain.

#### unshiftTransform(fn)

Adds the transform function to the begining of transformation chain.

License MIT

© velocityzen

