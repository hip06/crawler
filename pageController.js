const scraper = require('./pageScrape')
const fs = require('fs')
const pageController = async (browserInstance) => {
    const url = 'https://phongtro123.com/'
    const selectedIndex = [1, 2, 3, 4]
    try {
        let browser = await browserInstance
        const categories = await scraper.scraperCategory(browser, url)
        const selectedCategories = categories.filter((item, index) => selectedIndex.some(i => i === index))

        const scrapedData = await scraper.scraperData(browser, selectedCategories[0].link, selectedCategories[0].title)
        await browser.close()
        fs.writeFile('chothuephongtro.json', JSON.stringify(scrapedData), (err) => {
            if (err) {
                console.log(err)
            } else {
                console.log('Scrape data is successfully !')
            }
        })


    } catch (error) {
        console.log('Không thể trả về instance browser: ' + error)
    }
}

module.exports = pageController