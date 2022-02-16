const { HTML, CSS, CSS_Link } = require('./index.js')

const window = global

test('build basic elements', () => {
    const elements = ['div', 'a', 'button', 'h1', 'custom-tag']
    elements.forEach(tag => {
        const element = HTML(tag)
        expect(element.tagName.toLowerCase()).toBe(tag)
        expect(element.parentElement).toBe(null)
    })
})

test('build with properties', () => {
    const className = 'big blue deep'
    const onclick = () => 'say hello'
    const innerText = 'This is a div'
    const element = HTML('div', { className, onclick, innerText } )
    expect(element.className).toBe(className)
    expect(element.onclick).toBe(onclick)
    expect(element.innerText).toBe(innerText)
    expect(element.parentElement).toBe(null)
})

test('build with parent', () => {
    const href = 'http://localhost/something.html'
    const parent = HTML('div')
    const element = HTML('a', { href }, parent )
    expect(element.href).toBe(href)
    expect(element.parentElement).toBe(parent)
})

test('build with parent content', () => {
    const href = 'http://localhost/something.html'
    const content = 'click here'
    const parent = HTML('div')
    const element = HTML('a', { href }, parent, content )
    expect(element.href).toBe(href)
    expect(element.innerHTML).toBe(content)
    expect(element.parentElement).toBe(parent)
})

test('build CSS block', () => {
    const style = {}
    expect(document.querySelector('style')).toBe(null)
    CSS(style)
    expect(document.querySelector('style')).toBeTruthy()
})

test('build CSS with a selector', () => {
    const selector = '.myClass'
    const style = {}
    style[selector] = {}
    CSS(style)
    const stylesheets = window.document.styleSheets
    const stylesheet = stylesheets[stylesheets.length-1]
    expect(stylesheet.cssRules[0].selectorText).toBe(selector)
})

test('build CSS with several selectors', () => {
    const selectors = [ '.myClass', 'a', 'div.Big > a img' ]
    const style = {}
    selectors.forEach(selector => style[selector] = {})
    CSS(style)
    const stylesheets = window.document.styleSheets
    const stylesheet = stylesheets[stylesheets.length-1]
    selectors.forEach( (selector, index) => {
        expect(stylesheet.cssRules[index].selectorText).toBe(selector)
    })
})

test('build CSS with several selectors and properties', () => {
    const style = {
        '.myClass': {
            background: 'red'
        },
        'a': {
            fontSize: '10px',
            background: 'blue'
        },
        'div.Big > a img': {
            'max-width': '400px'
        }
    }

    CSS(style)

    const stylesheets = window.document.styleSheets
    const stylesheet = stylesheets[stylesheets.length-1]
    // .myClass
    const class_selector = stylesheet.cssRules[0]
    expect(class_selector.style.background).toBe('red')
    // a
    const a_selector = stylesheet.cssRules[1]
    expect(a_selector.style['font-size']).toBe('10px')
    expect(a_selector.style.background).toBe('blue')
    // div.Big > a img
    const complex_selector = stylesheet.cssRules[2]
    expect(complex_selector.style['max-width']).toBe('400px')
})

test('create link for css file', () => {
    const uri = 'http://localhost/style.css'
    CSS_Link(uri)
    const link = window.document.querySelector('link')
    expect(link.href).toBe(uri)
})

test('using attributes', () => {
    const element = HTML('div', { className:'something' }, null, 'content', { 'data-test':'it works', 'custom':'yes' } )
    expect(element.getAttribute('data-test')).toBe('it works')
    expect(element.getAttribute('custom')).toBe('yes')
})
