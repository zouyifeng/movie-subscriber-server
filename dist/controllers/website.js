"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const iconv = require("iconv-lite");
const cheerio = require("cheerio");
const movie_1 = require("../entities/movie");
const movie_2 = require("../services/movie");
const logger = require('../log').logger('index.ts', 'warn');
const listPageConfig = {
    url: 'https://www.dytt8.net/',
    methods: 'get',
    responseType: 'arraybuffer'
};
// 获取列表页信息
const handleListPageResponse = (response) => {
    const str = iconv.decode(response.data, 'gb2312');
    const $ = cheerio.load(str, { decodeEntities: false });
    const $list = $('.co_area2').eq(2).find('tr');
    const length = $list.length;
    const now = new Date();
    // 网站在当天发布前一天视频
    const preDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const preDateStr = `${preDate.getFullYear()}-${preDate.getMonth() + 1 < 10 ? '0' + (preDate.getMonth() + 1) : preDate.getMonth() + 1}-${preDate.getDate() < 10 ? '0' + preDate.getDate() : preDate.getDate()}`;
    for (var i = 1; i < length; i++) {
        const url = $list.eq(i).find('a').eq(1).attr('href');
        const time = $list.eq(i).find('td font').html();
        if (preDateStr === time) {
            fetch({ url: `https://www.dytt8.net${url}`, methods: 'get', responseType: 'arraybuffer' }, handleDetailPageResponse);
        }
    }
};
// 获取详情页信息
const handleDetailPageResponse = (response) => {
    const str = iconv.decode(response.data, 'gb2312');
    const $ = cheerio.load(str, { decodeEntities: false });
    const $movie = $('#Zoom');
    const cover = $movie.find('img').eq(0).attr('src');
    const downLoadUrl = $movie.find('a').eq(0).attr('href');
    let tempList = $movie.find('p').eq(0).html().trim().split('<br>');
    tempList = tempList.filter(item => item);
    // console.log(tempList)
    const intro = tempList[tempList.findIndex(item => item.includes('简　　介')) + 1];
    const publishDate = tempList.find(item => item.includes('上映日期'));
    const title = tempList.find(item => item.includes('片　　名'));
    const translatedName = tempList.find(item => item.includes('译　　名'));
    const country = tempList.find(item => item.includes('产　　地'));
    const actor = tempList[tempList.findIndex(item => item.includes('主　　演')) + 1].trim() + '/' + tempList[tempList.findIndex(item => item.includes('主　　演')) + 2].trim();
    const rate = tempList.find(item => item.includes('豆瓣评分')) || '无';
    const type = tempList.find(item => item.includes('类　　别')) || '无';
    const mv = new movie_1.Movie();
    mv.actor = actor.trim();
    mv.cover = cover.trim();
    mv.download_url = downLoadUrl.trim();
    // console.log(downLoadUrl.trim().length)
    mv.intro = intro.trim();
    mv.country = country.replace('◎产　　地', '').trim();
    mv.title = title.replace('◎片　　名', '').trim() + '（' + translatedName.replace('◎译　　名', '').trim() + '）';
    mv.rate = rate.replace('◎豆瓣评分', '').trim();
    mv.publish_time = publishDate.replace('◎上映日期', '').trim();
    mv.type = type.replace('◎类　　别', '').trim();
    const now = new Date();
    const nowStr = `${now.getFullYear()}-${now.getMonth() + 1 < 10 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1}-${now.getDate() - 1}`;
    mv.create_time = nowStr;
    movie_2.MovieService.newMovie(mv);
    logger.info(`上架电影 ${mv.title}`);
    logger.info(`上架日期 ${mv.publish_time}`);
};
const fetch = (config, handleResponse) => {
    axios_1.default(config)
        .then(handleResponse);
};
exports.fetchMovie = function () {
    fetch(listPageConfig, handleListPageResponse);
};
//# sourceMappingURL=website.js.map