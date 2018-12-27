// import app from './App'
import 'reflect-metadata';
import * as cheerio from 'cheerio'
import * as iconv from 'iconv-lite'
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { DBConnection } from './DBConnection'
import { MovieService } from './services/movie'
import { Movie } from './entities/movie'
import { getConnection } from 'typeorm'
import * as schedule from 'node-schedule'
import app from './App'

const port = 8089

const listPageConfig: fetchConfig = {
  url: 'https://www.dytt8.net/', 
  methods: 'get',
  responseType: 'arraybuffer'
}

interface fetchConfig extends AxiosRequestConfig {
  url: string,
  methods: 'get',
  responseType: 'arraybuffer'
}

interface axiosResponseFunc {
  (res: AxiosResponse): void;
}

const handleListPageResponse = (response: AxiosResponse) => {
  const str = iconv.decode(response.data, 'gb2312')
  const $ = cheerio.load(str, { decodeEntities: false })
  const $list = $('.co_area2').eq(2).find('tr')
  const length: number = $list.length
  for (var i = 1; i < length; i++) {
    const url: string = $list.eq(i).find('a').eq(1).attr('href')
    const time: string = $list.eq(i).find('td font').html()
    // movieList.push({ url, time })
    // console.log(url)
    const now = new Date()
    // 网站在当天发布前一天视频
    const nowStr = `${now.getFullYear()}-${now.getMonth()+1 < 10 ? '0' + now.getMonth()+1 : now.getMonth()+1}-${now.getDate() - 1}`
    if (nowStr === time) {
      fetch({ url: `https://www.dytt8.net${url}`, methods: 'get', responseType: 'arraybuffer'}, handleDetailPageResponse)
    }
  }
}

const handleDetailPageResponse = (response: AxiosResponse) => {
  const str = iconv.decode(response.data, 'gb2312');
  const $ = cheerio.load(str, { decodeEntities: false })
  const $movie = $('#Zoom')
  const cover: string = $movie.find('img').eq(0).attr('src')
  const downLoadUrl: string = $movie.find('a').eq(0).attr('href')
  let tempList = $movie.find('p').eq(0).html().trim().split('<br>')
  tempList = tempList.filter(item => item);
  // console.log(tempList)
  const intro: string = tempList[tempList.findIndex(item => item.includes('简　　介')) + 1]
  const publishDate: string = tempList.find(item => item.includes('上映日期'))
  const title: string = tempList.find(item => item.includes('片　　名'))
  const country: string = tempList.find(item => item.includes('产　　地'))
  const actor: string = tempList[tempList.findIndex(item => item.includes('主　　演')) + 1].trim() + '/' + tempList[tempList.findIndex(item => item.includes('主　　演')) + 2].trim()
  const rate: string = tempList.find(item => item.includes('豆瓣评分')) || '无'

  const mv: Movie = new Movie()
  mv.actor = actor.trim()
  mv.cover = cover.trim()
  mv.download_url = downLoadUrl.trim()
  // console.log(downLoadUrl.trim().length)
  mv.intro = intro.trim()
  mv.country = country.replace('◎产　　地', '').trim()
  mv.title = title.replace('◎片　　名', '').trim()
  mv.rate = rate.replace('◎豆瓣评分', '').trim()
  mv.publish_time = publishDate.replace('◎上映日期', '').trim()

  const now = new Date();
  const nowStr = `${now.getFullYear()}-${now.getMonth()+1 < 10 ? '0' + now.getMonth()+1 : now.getMonth()+1}-${now.getDate()}`;
  mv.create_time = nowStr;

  MovieService.newMovie(mv)
}

const fetch = (config: fetchConfig, handleResponse: axiosResponseFunc) => {
  axios(config)
    .then(handleResponse)
}

DBConnection.createConnection()
  .then(() => {
    console.log('数据库连接成功')
    fetch(listPageConfig, handleListPageResponse);
    schedule.scheduleJob('1 1 18 * * *', function() {
      fetch(listPageConfig, handleListPageResponse);
    })    
  })
  .catch(e => {
    console.log('数据库报错')
    console.log(e)
  })



app.listen(port, err => {
  if (err) {
    return console.log(err)
  }

  return console.log(`server is listening on ${port}`)
})
