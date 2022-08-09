
const scraperCategory = async (browser, url) => {
    let page = await browser.newPage()
    console.log('>> Đang mở trình duyệt...')
    await page.goto(url)
    console.log('>> Đang truy cập đến URL: ' + url)
    await page.waitForSelector('#webpage')
    console.log('>> Website đã load xong ...');

    let categories = await page.$$eval('#navbar-menu > ul > li', els => {
        categories = els.map(el => {
            return {
                title: el.querySelector('a').innerText,
                link: el.querySelector('a').href
            }
        })
        return categories
    })
    console.log('>> Đã lấy xong category ...');
    await page.close()
    return categories
}

const scraperData = async (browser, url, category) => {
    let page = await browser.newPage()
    console.log('>> Mở tab mới ...')
    await page.goto(url)
    console.log('>> Truy cập url ' + url);
    await page.waitForSelector('#main')
    console.log('>> Đã load xong main ...')

    const scrapedObject = {}
    scrapedObject.header = await page.$eval('header > h1', el => el.innerText)
    scrapedObject.description = await page.$eval('header > p', el => el.innerText)
    const links = await page.$$eval('.post-listing > li', els => {
        links = els.map(el => {
            return el.querySelector('.post-thumb > a')?.href
        })
        return links.filter(i => !i === false)
    })
    const dataItem = []
    // trả về 1 object data
    const scraperItem = (path) => new Promise(async (resolve, reject) => {
        try {
            let dataDetailPage = {}
            let newPage = await browser.newPage()
            await newPage.goto(path)
            console.log('>. Đang truy cập: ' + path);
            await newPage.waitForSelector('#main')
            console.log('>> Đã load xong trang chi tiết...');

            // lấy ảnh đầu trang
            let dataImages = await newPage.$$eval('#left-col .post-images > div > .swiper-wrapper > .swiper-slide', (els) => {
                let images = els.map(el => el.querySelector('img')?.src)
                return images.filter(i => !i === false)
            })
            dataDetailPage.dataImages = dataImages

            // lấy thông tin giới thiệu
            let dataHeaderPage = await newPage.$eval('header.page-header', (el) => {
                let data = {}
                data.title = el.querySelector('h1 > a')?.title
                data.star = el.querySelector('h1 > span')?.className.replace(/^\D+/g, '')
                data.class = {
                    text: el.querySelector('p')?.innerText,
                    type: el.querySelector('p > a > strong')?.innerText
                }
                data.address = el.querySelector('address').innerText
                data.postAttributes = {
                    price: el.querySelector('.post-attributes > .price > span')?.innerText,
                    acreage: el.querySelector('.post-attributes > .acreage > span')?.innerText,
                    hashtag: el.querySelector('.post-attributes > .hashtag > span')?.innerText,
                    published: el.querySelector('.post-attributes > .published > span').title,
                }

                return data
            })
            dataDetailPage.headerPage = dataHeaderPage
            // thông tin mô tả
            let headerDiscription = await newPage
                .$eval('section.post-main-content > .section-header > h2', (el) => el.innerText)
            let contentsDescription = await newPage
                .$$eval('section.post-main-content > .section-content > p', (els) => els.map(p => p.innerText).filter(i => !i === false))

            dataDetailPage.description = {
                header: headerDiscription,
                contents: contentsDescription
            }

            // đặc điểm bài đăng
            let titleOverview = await newPage
                .$eval('section.post-overview > .section-header > h3', (el) => el.innerText)
            let contentOverview = await newPage
                .$$eval('section.post-overview > .section-content > .table > tbody > tr', (els) => els.map(tr => {
                    const data = {}
                    data.name = tr.querySelector('td:first-child').innerText
                    data.value = tr.querySelector('td:last-child').innerText
                    return data
                }).filter(i => !i === false))

            dataDetailPage.overview = {
                titte: titleOverview,
                contents: contentOverview
            }

            // thông tin liên hệ
            let titleContract = await newPage
                .$eval('section.post-contact > .section-header > h3', (el) => el.innerText)
            let contentContact = await newPage
                .$$eval('section.post-contact > .section-content > .table > tbody > tr', (els) => els.map(tr => {
                    const data = {}
                    data.name = tr.querySelector('td:first-child').innerText
                    data.value = tr.querySelector('td:last-child').innerText
                    return data
                }).filter(i => !i === false))

            dataDetailPage.contact = {
                titte: titleContract,
                contents: contentContact
            }
            resolve(dataDetailPage)
            await newPage.close()

        } catch (error) {
            reject(error)
        }
    })
    for (let path of links) {
        let result = await scraperItem(path)
        dataItem.push(result)
    }
    scrapedObject.body = dataItem
    return scrapedObject
}

module.exports = {
    scraperCategory,
    scraperData
}