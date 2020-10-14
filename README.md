# html-builder
A basic helper to build HTML elements quicker.

It helps building components without using libraries like React.

For the ones who love keeping it vanilla :)

## Usage
```javascript
const builder = require('html-builder')

// only html_tag is mandatory
builder.HTML( html_tag, props, parent, content)
```

You can replace this
```javascript
const button = document.createElement('button')
button.classList.add('myButton')
button.innerHTML = 'Click me'
document.body.appendChild(button)
const image = document.createElement('img')
image.src = imgURL
button.appendChild(image)
```

by this

```javascript
const button = builder.HTML('button', { className:'myButton', onClick:doSomething }, document.body, 'Click me' )
builder.HTML('img', { src:imgURL }, button )
```
