const puppeteer = require('puppeteer')

const startBrowser = async () => {
    let browser
    try {
        browser = puppeteer.launch({
            // Có hiện ui của Chromium hay không, false là có
            headless: true,
            // Chrome sử sử dụng multiple layers của sandbox để tránh những nội dung web k đáng tin cậy,
            // nếu tin tưởng content dung thì set như vầy
            args: ["--disable-setuid-sandbox"],
            // truy cập website bỏ qua lỗi liên quan http secure
            'ignoreHTTPSErrors': true
        })

    } catch (error) {
        console.log('Khởi động trình duyệt thất bại. ' + error);
    }

    return browser
}

module.exports = startBrowser