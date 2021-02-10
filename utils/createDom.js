const dom = require('xmldom').DOMParser

module.exports = (data) => {
    return new dom({
        locator: {},
        errorHandler: { warning: () => { }, error: () => { }, fatalError: () => { } }
    }).parseFromString(data)
}