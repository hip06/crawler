const browser = require('./browser')
const pageController = require('./pageController')

let browserInstance = browser()
pageController(browserInstance)