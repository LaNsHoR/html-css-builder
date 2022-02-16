# HTML-Builder

Ultra lightweight helper to build HTML elements components and compositions.

The goal of this builder is provide a tiny, light and fast util focused in small size and performance.

## Usage
```javascript
const { HTML } = require('html-builder')

HTML( html_tag, properties, parent, content, attributes )
```

## Basic Examples

Create a div:
```javascript
HTML('div')
```

Create an image:
```javascript
const src = '/path/to/my_image.png'
HTML('img', { src } )
```

Create a div and append it into the DOM:
```javascript
HTML('div', { className:'myDiv' }, document.body )
```

Create a link into a div:
```javascript
HTML('a', { href:url }, HTML('div'), 'Link Text' )
```

Using attributes:
```javascript
HTML('div', {}, null, 'my content', { 'data-test-id':'something' })
```

## Complex Example

You can replace this vanilla piece of code

```javascript
// create a button programmatically
const button = document.createElement('button')
button.classList.add('myClass')
button.innerHTML = 'click'
button.onClick = doSomething
document.body.appendChild(button)

// create an image for the button above programmatically
const image = document.createElement('img')
image.src = imgURL
button.appendChild(image)
```

by this

```javascript
// build the button
const button = HTML('button', { className:'myClass', onClick:doSomething }, document.body, 'click')

// build the image
HTML('img', { src:imgURL }, button )
```

## CSS injector

A method to inject css files programmatically is also supplied

```javascript
const { CSS_Link } = require('html-builder')

CSS_Link( 'https://www.domain.com/my_style.css' )
```

It will generate a new link tag containing the stylesheet as part of head section of your document.

## CSS Builder

You can also build CSS within javascript. This is useful to distribute small components in node packages without forcing the consumer to use a loader.

Example:

```javascript
const { CSS } = require('html-builder')

const background= 'red';
const zoom = 2;

const style = {
    '.myClass': {
        color: 'red',
        size: `${10*zoom}px`,
        fontSize: '10px'
    },

    '.myComplex > selector': {
        background,
        'font-size': '10px'
    }
}

CSS( style )

// so now I can use myClass in my components
HTML( 'div', { className:'myClass' } )
```

That will "compile" the style object into standard CSS and will inject a new style html tag in the head with the result. Note that standard CSS property names like `font-size` and DOM notation versions (camel case) like `fontSize` are both supported.

**IMPORTANT:** Please, keep in mind that the generated CSS will be global, so any component using _myClass_ will be affected by the example above. This approach is not intended to be used as util for CSS Modules. Also, <ins>don't confuse JSS with the style object we use in this builder</ins>, this builder maps directly an object with format

```javascript
{
    selector_1 : {
        property_1 : value_1,
        property_2 : value_2,
    },
    selector_2 : {
        property_1 : value_1
    }
}
```

into CSS. JSS syntax and functionality is not supported and it's not intended to.

**TIP:** Because the style will be available globally as vanilla CSS does, ensure you use a prefix as part of your class names to avoid collisions with your consumer and third party styles. The use of prefixes has several advantages over hashing, like allowing the consumer to expand the style without new classes injection.
