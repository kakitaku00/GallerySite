import Key from '../config/key.js';

const $searchText = $("#SearchText");
const $searchBtn = $("#SearchBtn");
const $gallery = $("#Gallery");
const $pager = $(".Pager");
const $keywords = $("#Keywords");
const $loading = $(".loading");

// flicker
const FLICKER_SERVER = "https://api.flickr.com/services/rest";
const API_KEY = Key;

let pageData = {
  pageNum: 0,
  searchValue: "",
  photoItem: [],
  maxPage: 0,
  currentPage: 1,
  hystoryKeywords: [],
  maxOption: 5,
  cookieData: []
}

function main() {
  initCookie();
  bindEvent();
}

// Cookieが登録されている場合Dataに登録
function initCookie() {
  console.log("cooke: " + document.cookie)
  if (!document.cookie) {return}
  // cookie文字列を配列に変換
  pageData.cookieData = document.cookie.split(";");
  // cookie配列のkeyを削除し、サジェスト用配列に置換
  pageData.cookieData.forEach(function(data){
    pageData.hystoryKeywords.unshift(data.replace(/\s+key\d+=|key\d+=/, ""))
  })
  // optionに格納
  createOption(pageData.hystoryKeywords)
}

// Cookieに保存
function setCookie(data) {
  pageData.cookieData = formatCookieData(data);
  pageData.cookieData.forEach(function(data) {
    // 1分だけCookieに保存
    document.cookie = `${data};max-age=60`
  })
}

// Cookieに保存できる形式に変換
function formatCookieData(data) {
  let arr = []
  for (let i = data.length -1; i >= 0; i--) {
    arr.push(`key${i}=${data[i]}`)
  }
  return arr;
}

// optionタグを生成
function createOption(keywords) {
  const option = keywords.map((keyword) => {
    return `<option value="${keyword}"></option>`
  })
  $keywords.html(option.join(''))
}

// 検索したkeywordをデータに格納
function addKeyword(keyword) {
  // maxOption数以上補完は溜めない
  if (pageData.hystoryKeywords.length >= pageData.maxOption) {
    pageData.hystoryKeywords.pop()
  }
  pageData.hystoryKeywords.unshift(keyword)
}

// イベント登録
function bindEvent() {
  // Search Event
  $searchBtn.on("click", function() {
    if (pageData.searchValue === $searchText.val()) {return}
    // 検索テキスト
    pageData.searchValue = $searchText.val();
    // 1ページ目
    pageData.pageNum = 1
    // Gallery/Pagerの中を空に
    resetGallery()
    // 検索テキストを配列に格納
    addKeyword(pageData.searchValue)
    // 補完作成
    createOption(pageData.hystoryKeywords)
    // 画像を取得
    handleSearch(pageData.searchValue, pageData.pageNum)
    // cookieに格納
    setCookie(pageData.hystoryKeywords)
  });
  // Enterキーで実行
  $searchText.keypress(function(e) {
    if(e.which == 13){
      $searchBtn.click()
      // フォーカスを外す
      $(this).blur()
    }
  })
}

function handleSearch(searchValue, pageNum) {
  getData(searchValue, pageNum);
}

// APIから画像を取得
function getData(searchValue, pageNum) {
  $.ajax({
    type: 'GET',
    url: FLICKER_SERVER,
    data: {
      'method': 'flickr.photos.search',
      'api_key': API_KEY,
      'text':searchValue,
      'page':pageNum,
      'per_page': '25',
      'format': 'json',
      'nojsoncallback': '1',
      'extras':'url_q'
    },
    dataType: 'json',
    beforeSend: function(){
      $loading.removeClass('is-hide');
    },
    success: function(){
      setTimeout(() => {
        $loading.addClass("is-hide");
      }, 1000);
    }
  })
  .then(function(data) {
    console.log(data)
    pageData.photoItem = data.photos.photo
    pageData.currentPage = data.photos.page
    pageData.maxPage = data.photos.pages
  })
  .then(function(){
    // 画像・ページャー描画
    viewPhoto(pageData.photoItem);
    viewPager(pageData.currentPage, pageData.maxPage);
  })
  .then(function(){
    $(".Pager__anchor").each(function() {
      setPagerEvent($(this))
    })
  })
}

// 画像表示
function viewPhoto(data) {
  const imageLists = data.map(function(image) {
    return '<img src="' + image.url_q + '" alt="' + image.title + '">'
  })
  $gallery.html(imageLists.join(''))
}

// ページャー表示
function viewPager(currentPage, maxPages) {
  const firstPageNum = 1;
  const lastPageNum = maxPages;
  // ページャーを表示するブロックの最大数
  let viewPagerBlock = 3
  // 取得したmaxPagesがブロックの最大数以下の場合更新
  if (maxPages < viewPagerBlock) {
    viewPagerBlock = maxPages;
  }
  // 2ページを表示した際に[1,2,3]と表示させたい
  let currentMaxViewPager = currentPage + viewPagerBlock - 2;
  // 調整用
  let adjustNum = -1;
  // 最初のページ
  if (currentPage === 1) {
    adjustNum++
    currentMaxViewPager++
  }
  // 最後のページ
  if (currentPage === maxPages && maxPages !== 2) {
    adjustNum--
    currentMaxViewPager--
  }
  // 最初に戻るボタン
  for (let i = currentPage + adjustNum; i <= currentMaxViewPager; i++) {
    $pager.append('<li class="Pager__list"><a href="#' + i + '" data-page="' + i + '" class="Pager__anchor">' + i + '</a></li>')
    if (i === currentPage) {
      $('a[data-page="' + currentPage + '"').addClass("is-active");
    }
  }
  if (currentPage !== firstPageNum) {
    const prevPageNum = currentPage - 1
    $pager.prepend('<li class="Pager__list"><a href="#' + prevPageNum + '" data-page="' + prevPageNum + '" class="Pager__anchor"><</a></li>')
    $pager.prepend('<li class="Pager__list"><a href="#' + firstPageNum + '" data-page="' + firstPageNum + '" class="Pager__anchor"><<</a></li>')
  }
  if (currentPage !== lastPageNum) {
    const nextPageNum = currentPage + 1
    $pager.append('<li class="Pager__list"><a href="#' + nextPageNum + '" data-page="' + nextPageNum + '" class="Pager__anchor">></a></li>')
    $pager.append('<li class="Pager__list"><a href="#' + lastPageNum + '" data-page="' + lastPageNum + '" class="Pager__anchor">>></a></li>')
  }
}

// ページャーにイベント登録
function setPagerEvent (target) {
  target.on("click", function(e) {
    e.preventDefault();
    resetGallery();
    pageData.pageNum = target[0].getAttribute("data-page");
    handleSearch(pageData.searchValue, pageData.pageNum);
  })
}

// リセット
function resetGallery() {
  $gallery.empty();
  $pager.empty();
}

main();

