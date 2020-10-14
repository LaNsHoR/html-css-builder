# html-builder
A basic helper to build HTML elements quicker.

It helps building components without using libraries like React.

## Usage
```javascript
const builder = require('html-builder')

// only html_tag is mandatory
builder.HTML( html_tag, props, parent, content)
```

## Basic Examples

Create a div
```javascript
builder.HTML('div')
```

Create an image
```javascript
builder.HTML('img', { src:imgUrl } )
```

Create a div and append it into the DOM
```javascript
builder.HTML('div', {}, document.body )
```

Create a link into a div

```javascript
builder.HTML('a', { href:url }, builder.HTML('div'), 'Link Text' )
```

## Complex Example

You can replace this vanilla piece of code

```javascript
// create a button programatically
const button = document.createElement('button')
button.classList.add('myButton')
button.innerHTML = 'click'
document.body.appendChild(button)

// create an image for the button above programatically
const image = document.createElement('img')
image.src = imgURL
button.appendChild(image)
```

by this

```javascript
// build the button
const button = builder.HTML('button', { className:'myClass', onClick:doSomething }, document.body, 'click' )

// build the image
builder.HTML('img', { src:imgURL }, button )
```

## CSS injector

A method to inject css files programatically is also supplied

```javascript
builder.CSS( 'https://www.domain.com/my_style.css' )
```

It will generate a new link tag containing the stylesheet as part of head section of your document.