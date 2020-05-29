import Key from '../../config/key.js';
import Detail from '../views/Detail.js';

const Utils = {
  FLICKER_SERVER:"https://api.flickr.com/services/rest",
  API_KEY: Key,
  data: {
    val: "",
    images: [],
    image: {},
    page: 1,
    maxPages: 1,
    keywords: []
  },
  getImageList: function(val, pages) {
    return $.ajax({
      type: 'GET',
      url: this.FLICKER_SERVER,
      data: {
        'method': 'flickr.photos.search',
        'api_key': Utils.API_KEY,
        'text': val,
        'page': pages,
        'per_page': '15',
        'format': 'json',
        'nojsoncallback': '1',
        'extras':'url_q'
      },
      dataType: 'json',
    })
  },
  getImage: function(id) {
    return $.ajax({
      type: 'GET',
      url: Utils.FLICKER_SERVER,
      data: {
        'method': 'flickr.photos.getInfo',
        'api_key': Utils.API_KEY,
        'photo_id': id,
        'format': 'json',
        'nojsoncallback': '1',
      },
      dataType: 'json',
    })
  },
  parseRequestUrl: function() {
    const request = {
      resource    : null,
      id          : null,
      page        : null,
      val         : null
    }
    request.resource = location.pathname
    // request.id = location.search.replace(/\?id=/,"")
    const params = location.search.slice(1).split("&")
    params.forEach(function(param) {
      const _param = param.split("=")
      request[_param[0]] = _param[1]
    })
    return request
  }
}

export default Utils