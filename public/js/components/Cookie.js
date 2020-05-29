import Utils from "../util/Utils.js"

const Cookie = {
  initCookie: async function() {
    if (!document.cookie) {return}
    Utils.data.keywords = []
    const cookieData = document.cookie.split(";");
    await cookieData.forEach(function(data){
      Utils.data.keywords.push(data.replace(/\s+text\d+=|text\d+=/, ""))
    })
  },
  saveCookie: async function() {
    await Utils.data.keywords.forEach(function(keyword, idx){
      document.cookie = `text${idx}=${keyword};max-age=60`
    })
  },
}

export default Cookie