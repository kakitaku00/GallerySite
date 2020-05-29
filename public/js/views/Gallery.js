import Utils from "../util/Utils.js"
import Pager from "../components/Pager.js"
import Suggest from "../components/Suggest.js"
import Cookie from "../components/Cookie.js"

import router from "../router.js"

const $Contents = $("#Contents")[0]

let Gallery = {
  render : async () => {
    let view = `
      <div class="Gallery__search">
        <input type="text" class="Gallery__search__text" name="" id="SearchText" placeholder="text" list="Keywords" autocomplete="on">
        <input type="button"  class="Gallery__search__submit" value="Search" id="SearchBtn">
      </div>
      <div id="Gallery" class="Gallery__contents"></div>
    `
    return view
  },
  after_render : async () => {
    const app = {
      init: async function() {
        await this.initGallery()
        await this.bindEvent()
        await this.bindCookieData()
      },
      initGallery: async function() {
        const request = await Utils.parseRequestUrl()
        if (request.page || request.text) {
          Utils.data.page = request.page
          Utils.data.val = request.val
          $("#SearchText").val(Utils.data.val)
          this.handleSearch()
        } else {
          Utils.data.val = ""
          $("#Gallery").empty()
        }
      },
      bindEvent: async function() {
        $("#SearchText").val(Utils.data.val)
        $("#SearchBtn").click(this.handleSearch.bind(this))
        if (Utils.data.val) {
          await this.renderImage()
        }
      },
      bindCookieData: async function() {
        await Cookie.initCookie()
        await this.renderSuggest()
      },
      handleSearch: async function() {
        const request = await Utils.parseRequestUrl()
        if (!$("#SearchText").val()) { return }
        if (Utils.data.val !== $("#SearchText").val()) { Utils.data.page = 1 }
        Utils.data.val = $("#SearchText").val()
        if (!request.val) {
          const url = `?page=${Utils.data.page}&val=${Utils.data.val}`
          await window.history.pushState(null, null, url)
        }
        if (!Utils.data.keywords.includes(Utils.data.val)) { await this.setSuggest() }
        await Utils.getImageList(Utils.data.val, Utils.data.page).done((response) => {
          console.log(response)
          Utils.data.images = response.photos.photo
          Utils.data.page = response.photos.page
          Utils.data.maxPages = response.photos.pages
        })
        await this.resetGallery()
        await this.renderImage()
      },
      setSuggest: async function() {
        Utils.data.keywords.unshift(Utils.data.val)
        await Cookie.saveCookie()
        await Suggest.after_render()
      },
      renderImage: async function() {
        $("#Gallery").html(Utils.data.images.map(photo => `<a class="flickerImage" href="/detail.html?id=${photo.id}"><img src="${photo.url_q}" alt="${photo.title}"></a>`).join(''))
        await this.renderPager(Utils.data.page, Utils.data.maxPages)
        await this.handleImageClick()
      },
      handleImageClick: async function() {
        $(".flickerImage").each(function() {
          $(this).on("click", function(e) {
            e.preventDefault()
            const url = e.currentTarget.getAttribute("href")
            window.history.pushState(null, null, url);
            router()
          })
        })
      },
      renderSuggest: async function() {
        $Contents.insertAdjacentHTML('beforeend', await Suggest.render())
        await Suggest.after_render()
      },
      renderPager: async function(page, maxPages) {
        $Contents.insertAdjacentHTML('beforeend', await Pager.render())
        await Pager.after_render()
        // ページャーを表示するブロックの最大数
        let viewPagerBlock = 3
        // 取得したmaxPagesがブロックの最大数以下の場合更新
        if (maxPages < viewPagerBlock) {
          viewPagerBlock = maxPages;
        }
        // 2ページを表示した際に[1,2,3]と表示させたい
        let currentMaxViewPager = page + viewPagerBlock - 2;
        // 調整用
        let adjustNum = -1;
        // 最初のページ
        if (page === 1) {
          adjustNum++
          currentMaxViewPager++
        }
        // 最後のページ
        if (page === maxPages && maxPages !== 2) {
          adjustNum--
          currentMaxViewPager--
        }
        // 最初に戻るボタン
        for (let i = page + adjustNum; i <= currentMaxViewPager; i++) {
          $("#Pager").append('<li class="Pager__list"><a href="?page=' + i + '&val=' + Utils.data.val + '" data-page="' + i + '" class="Pager__anchor">' + i + '</a></li>')
          if (i === page) {
            $('a[data-page="' + page + '"').addClass("is-active");
          }
        }
        if (page !== 1) {
          const prevPageNum = page - 1
          $("#Pager").prepend('<li class="Pager__list"><a href="?page=' + prevPageNum + '&val=' + Utils.data.val + '" data-page="' + prevPageNum + '" class="Pager__anchor"><</a></li>')
          $("#Pager").prepend('<li class="Pager__list"><a href="?page=' + 1 + '&val=' + Utils.data.val + '" data-page="' + 1 + '" class="Pager__anchor"><<</a></li>')
        }
        if (page !== maxPages) {
          const nextPageNum = page + 1
          $("#Pager").append('<li class="Pager__list"><a href="?page=' + nextPageNum + '&val=' + Utils.data.val + '" data-page="' + nextPageNum + '" class="Pager__anchor">></a></li>')
          $("#Pager").append('<li class="Pager__list"><a href="?page=' + maxPages + '&val=' + Utils.data.val + '" data-page="' + maxPages + '" class="Pager__anchor">>></a></li>')
        }
        this.bindPagerEvent()
      },
      bindPagerEvent: async function() {
        $(".Pager__anchor").on("click", async (e) => {
          e.preventDefault();
          this.resetGallery();
          Utils.data.page = e.currentTarget.getAttribute("data-page");
          const url = `?page=${Utils.data.page}&val=${Utils.data.val}`
          await window.history.pushState(null, null, url)
          await this.initGallery()
        })
      },
      resetGallery: async function() {
        $("#Gallery").empty();
        $("#Gallery__pager").remove();
      }
    }
    app.init()
  }
}

export default Gallery;