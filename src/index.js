const HTML = (tag, props = {}, parent = null, content = null, attrs = {} ) => {
    const element = document.createElement(tag)
    Object.keys(props).forEach( prop => element[prop] = props[prop] )
    parent && parent.appendChild(element)
    content && (element.innerHTML = content)
    Object.keys(attrs).forEach( attribute => element.setAttribute(attribute, attrs[attribute]) )
    return element
}

const CSS = styles => {
    let content = '';
    for(const selector in styles) {
        const block = new Map( Object.entries(styles[selector] ))
        content += `\n${selector} {\n`
        block.forEach( (value, property) => {
            // convert camel case property names to CSS
            property = property.charAt(0).toLowerCase()+property.slice(1).replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)
            content += `   ${property}:${value};\n`
        })
        content += '}\n'
    }
    HTML('style', {}, document.querySelector('head'), content)
}

const CSS_Link = path => HTML('link', { href:path, type:'text/css', rel:'stylesheet' }, document.querySelector('head'))

exports.HTML = HTML
exports.CSS = CSS
exports.CSS_Link = CSS_Link
