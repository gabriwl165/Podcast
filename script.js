const puppeteer = require('puppeteer')

class Podcast{

    constructor(url, nome){
        this.nome = nome
        this.link = scrapLink(url)
        this.titulo = scrapTitulo(url)
        this.thumb = scrapThumb(url)
        this.ao_vivo = isOnLive(url)
    }

    async scrapLink(url) {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url);

        const [el2] = await page.$x('//*[@id="video-title"]')
        const src2 = await el.getProperty('href');
        return await src2.jsonValue();
    }

    async scrapTitulo(url) {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url);
    
        const [el] = await page.$x('//*[@id="video-title"]')
        const src = await el.getProperty('title');
        return await src.jsonValue();
    }

    async scrapThumb(url){
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url);

        const link_thumb = await page.evaluate(() => {
            const imgs = []
            document.querySelectorAll('ytd-video-renderer.ytd-channel-featured-content-renderer > div:nth-child(1) > ytd-thumbnail:nth-child(1) > a:nth-child(1) > yt-img-shadow:nth-child(1) > img:nth-child(1)')
                .forEach((img) => imgs.push(img.getAttribute('src')))
            return imgs;
        });

        return link_thumb[0]
    }

    async isOnLive(url){
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url);

        return await page.evaluate(() => {
            var valor = document.getElementsByClassName('style-scope ytd-thumbnail-overlay-time-status-renderer');
    
            for (let item of valor) {
                if(item.innerText == "AO VIVO"){
                    return true
                } else {
                    return false
                }
            }
        })

    }

}

function getData(url, nomePodcast){
    let podcast = new Podcast(url, nome);
    if(podcast.ao_vivo == false){
        return "Canal Offline"
    } else {
        return podcast
    }
}

