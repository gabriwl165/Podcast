const puppeteer = require('puppeteer')

async function scrapeProduct(url){
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    const [el] = await page.$x('//*[@id="video-title"]')
    const src = await el.getProperty('title');
    const titulo = await src.jsonValue();

    const [el2] = await page.$x('//*[@id="video-title"]')
    const src2 = await el.getProperty('href');
    const link_live = await src2.jsonValue();

    const link_thumb = await page.evaluate(() => {
        const imgs = []
        document.querySelectorAll('ytd-video-renderer.ytd-channel-featured-content-renderer > div:nth-child(1) > ytd-thumbnail:nth-child(1) > a:nth-child(1) > yt-img-shadow:nth-child(1) > img:nth-child(1)')
            .forEach((img) => imgs.push(img.getAttribute('src')))
        return imgs;
    });


    const ao_vivo = await page.evaluate(() => {
        var valor = document.getElementsByClassName('style-scope ytd-thumbnail-overlay-time-status-renderer');

        for (let item of valor) {
            if(item.innerText == "AO VIVO"){
                return true
            } else {
                return false
            }
        }
    })

    const [el5] = await page.$x('//*[@id="text"]')
    const src5 = await el5.getProperty('textContent');
    const titulo_area =  await src5.jsonValue();
    
    console.log({titulo, link_live, link_thumb, ao_vivo, titulo_area});
    console.log(link_thumb[0])
    browser.close();
}

let val = scrapeProduct("https://www.youtube.com/channel/UCgWiuB2PQIUhJgEN9No281g")
