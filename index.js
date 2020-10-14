const HTML = (tag, props = {}, parent = null, content = null) => {
    const element = document.createElement(tag)
    Object.keys(props).forEach( prop => element[prop] = props[prop] )
    parent && parent.appendChild(element)
    content && (element.innerHTML = content)
    return element
}

const CSS = path => {
    const head = document.getElementsByTagName('head')[0]
    HTML('link', { href:path, type:'text/css', rel:'stylesheet' }, head)
}

exports.HTML = HTML
exports.CSS = CSS
