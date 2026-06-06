const HTML = (tag, props = {}, parent = null, content = null, attrs = {} ) => {
    const element = document.createElement(tag)
    Object.keys(props).forEach( prop => element[prop] = props[prop] )
    parent && parent.appendChild(element)
    content != null && (element.innerHTML = content)
    Object.keys(attrs).forEach( attribute => element.setAttribute(attribute, attrs[attribute]) )
    return element
}

// render a flat declaration block { property: value } as CSS lines, converting camelCase property names to kebab-case.
// CSS custom properties (--name) are case-sensitive and left untouched; for everything else each uppercase letter
// becomes a -lowercase, so a leading uppercase yields a leading dash and vendor prefixes work (WebkitTransform ->
// -webkit-transform). Plain camelCase (fontSize -> font-size) and already-kebab names render identically to before.
const declarations = block => Object.entries( block ).map( ([ property, value ]) => {
    if( ! property.startsWith('--') )
        property = property.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)
    return `   ${property}:${value};\n`
}).join('')

// render rules recursively. An at-rule (@media, @supports, @starting-style, @container...) whose body holds nested
// rules (its values are objects) gets its body recursed; plain selectors and prop-only at-rules (@font-face, whose
// values are strings) render as a flat declaration block. This keeps existing flat usage byte-for-byte identical.
const rules = styles => {
    let content = ''
    for(const selector of Object.keys( styles )) {
        const body = styles[selector]
        const nested = selector.startsWith('@') && Object.values( body ).some( value => typeof value === 'object' && value !== null )
        content += `\n${selector} {\n${ nested ? rules( body ) : declarations( body ) }}\n`
    }
    return content
}

const CSS = styles => HTML('style', {}, document.querySelector('head'), rules( styles ))

const CSS_Link = path => HTML('link', { href:path, type:'text/css', rel:'stylesheet' }, document.querySelector('head'))

exports.HTML = HTML
exports.CSS = CSS
exports.CSS_Link = CSS_Link
