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
const button = builder.HTML('button', { className:'myClass', onClick:doSomething }, document.body, 'click')

// build the image
builder.HTML('img', { src:imgURL }, button )
```

## CSS injector

A method to inject css files programmatically is also supplied

```javascript
builder.CSS_Link( 'https://www.domain.com/my_style.css' )
```

It will generate a new link tag containing the stylesheet as part of head section of your document.

## CSS Builder

You can also build CSS within javascript. This is useful to distribute small components in node packages without forcing the consumer to use a loader.

Example:

```javascript
const background= 'red';
const zoom = 2;

const style = {
    '.myClass': {
        color: 'red',
        size: `${10*zoom}px`
    },

    '.myComplex > selector': {
        background
    }
}

builder.CSS( style )

// so now I can use myClass in my components
builder.HTML( 'div', { className:'myClass' } )
```

That will "compile" the style object into standard CSS and will inject a new style html tag in the head with the result.

**IMPORTANT:** Please, keep in mind that the generated CSS will be global, so any component using _myClass_ will be affected by the example above. This approach is not intended to be used for CSS Modules. Also, don't confuse JSS with the style object we use in this builder, this style object maps directly the object with format

```javascript
{
    selector_1 : {
        property_1 : value_1,
        property_2 : value_2,
        property_3 : value_3,
    },
    selector_2 : {
        property_1 : value_1,
        property_2 : value_2,
        property_3 : value_3,
    },
}
```

to CSS, without nesting or other syntax accepted by JSS.

**TIP:** Because the style will be available globally as vanilla CSS does, ensure you use a prefix as part of your class names to avoid collisions with your consumer and third party styles.