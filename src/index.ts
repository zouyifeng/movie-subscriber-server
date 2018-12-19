// import app from './App'
import 'reflect-metadata';

import * as cheerio from 'cheerio'
import * as iconv from 'iconv-lite'
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

import { createConnection } from 'typeorm'
import { DBConfig } from './Config'
import { DBConnection } from './DBConnection'

import { MovieService } from './services/movie'

import { Movie } from './entities/movie'

const db: DBConnection = new DBConnection()
db.createConnection();
const movieService: MovieService = new MovieService()



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

interface movie {
  time: string,
  url: string
}


let movieList: Array<movie> = []

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
    fetch({ url: `https://www.dytt8.net${url}`, methods: 'get', responseType: 'arraybuffer'}, handleDetailPageResponse)
  }
}

const handleDetailPageResponse = async (response: AxiosResponse) => {
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
  const actor: string = tempList[tempList.findIndex(item => item.includes('主　　演')) + 1] + tempList[tempList.findIndex(item => item.includes('主　　演')) + 2] 
  const rate: string = tempList.find(item => item.includes('豆瓣评分')) || '无'
  // console.log()

  const mv: Movie = new Movie()
  mv.actor = actor
  mv.cover = cover
  mv.download_url = downLoadUrl
  mv.intro = intro
  mv.country = country
  mv.title = title
  mv.rate = rate
  mv.publish_time = publishDate

  movieService.newMovie(mv)

}

const fetch = (config: fetchConfig, handleResponse: axiosResponseFunc) => {
  axios(config)
    .then(handleResponse)
}

fetch(listPageConfig, handleListPageResponse)
