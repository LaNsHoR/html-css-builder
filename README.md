# html-css-builder

Ultra lightweight helper to build HTML elements, components and compositions.

The goal of this builder is to provide a tiny, light and fast util focused on small size and performance.

## Usage
```javascript
const { HTML } = require('html-css-builder')

HTML( html_tag, properties, parent, content, attributes )
```

- `properties` are assigned as DOM **properties** (`element[key] = value`), so use `className` (not `class`) and event handlers like `onclick`.
- `parent`, when provided, is the node the new element is appended to. Pass another `HTML(...)` call here to nest.
- `content` sets the element's `innerHTML`. Falsy-but-meaningful values such as `0` are rendered; `null`/`undefined` leave it empty.
- `attributes` are set via `setAttribute`, for things like `data-*` or any custom attribute.

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
button.onclick = doSomething
document.body.appendChild(button)

// create an image for the button above programmatically
const image = document.createElement('img')
image.src = imgURL
button.appendChild(image)
```

by this

```javascript
// build the button
const button = HTML('button', { className:'myClass', onclick:doSomething }, document.body, 'click')

// build the image
HTML('img', { src:imgURL }, button )
```

## CSS injector

A method to inject css files programmatically is also supplied

```javascript
const { CSS_Link } = require('html-css-builder')

CSS_Link( 'https://www.domain.com/my_style.css' )
```

It will generate a new link tag containing the stylesheet as part of the head section of your document.

## CSS Builder

You can also build CSS within JavaScript. This is useful to distribute small components in node packages without forcing the consumer to use a loader.

Example:

```javascript
const { CSS } = require('html-css-builder')

const background = 'red';
const zoom = 2;

const style = {
    '.myClass': {
        color: 'red',
        width: `${10*zoom}px`,
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

### Property name conversion

camelCase property names are converted to kebab-case automatically:

- `fontSize` → `font-size`
- `backgroundColor` → `background-color`
- Vendor prefixes work too: a leading capital becomes a leading dash, so `WebkitTransform` → `-webkit-transform` and `MozBoxShadow` → `-moz-box-shadow`.
- CSS custom properties (variables) are case-sensitive and left untouched, so `'--myVar'` stays `--myVar`.

You can always use the plain CSS string form (`'font-size'`, `'-webkit-transform'`) instead, which is passed through verbatim.

### Nested at-rules (media queries, @supports, keyframes…)

An at-rule whose body contains nested rules is compiled recursively, so you can express media queries, feature queries, container queries, `@starting-style`, keyframes and similar:

```javascript
CSS({
    '@media (max-width: 600px)': {
        '.myClass': { fontSize: '12px' },
        '.other':   { display: 'none' }
    },

    '@supports (display: grid)': {
        '@media (min-width: 800px)': {
            '.grid': { display: 'grid' }
        }
    }
})
```

Declaration-only at-rules (where the body is a flat map of properties, e.g. `@font-face`) are rendered as a single block, exactly as a normal selector:

```javascript
CSS({
    '@font-face': { fontFamily: 'MyFont', src: 'url(font.woff2)' }
})
```

**IMPORTANT:** Please, keep in mind that the generated CSS will be global, so any component using _myClass_ will be affected by the example above. This approach is not intended to be used as a util for CSS Modules. Also, <ins>don't confuse JSS with the style object we use in this builder</ins>, this builder maps directly an object with format

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

**TIP:** Because the style will be available globally as vanilla CSS does, ensure you use a prefix as part of your class names to avoid collisions with your consumer and third party styles. The use of prefixes has several advantages over hashing, like allowing the consumer to expand the style without injecting new classes.
