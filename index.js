$(function() {

  const searchText = $("#SearchText");
  const searchBtn = $("#SearchBtn");
  const gallery = $("#Gallery");
  const pager = $(".Pager");

  // flickerAPI
  const flickrServer = "https://api.flickr.com/services/rest";
  const api_key = "&api_key=ec560fe4b5414933f7dd557ed0ec7a78";
  const flickerMethod = "?method=flickr.photos.search";
  const flickrFrormat = "&format=json&nojsoncallback=1&extras=url_q,date_taken"
  const textFormat = "&text="
  let searchValue = "";
  const per_page = "&per_page=25"; // 1ページ25枚表示
  const page = "&page=";
  let pageNum = 0

  // 検索
  searchBtn.on("click", function() {
    // 検索文字が同じ時は処理をしない
    if (searchValue === searchText[0].value) {return}
    // 検索テキスト
    searchValue = searchText[0].value;
    // 1ページ目
    pageNum = 1
    // Gallery/Pagerの中を空にする
    resetGallery()
    // 画像を取得
    const searchURI = flickrServer + flickerMethod + api_key + flickrFrormat + textFormat + searchValue + per_page + page + pageNum;
    getData(searchURI);
  })

  // APIから画像を取得
  function getData(uri) {
    $.ajax({
      type: 'GET',
      url: uri,
      dataType: 'json'
    })
    .then(function(data) {
      console.log(data)
      // 写真の枚数
      const viewPhotoNum = data.photos.photo.length;
      const pages = data.photos.pages
      const currentPages = data.photos.page
      // 枚数分描画
      viewPhoto(data, viewPhotoNum);
      viewPager(currentPages, pages);
    })
    .then(function() {
      $(".Pager__anchor").each(function() {
        // イベントリスナーがすでに登録されていいた場合はスルー
        if (jQuery._data($(this).get(0)).events) {return}
        // clickイベント
        $(this).on("click", function(e) {
          e.preventDefault();
          resetGallery();
          pageNum = $(this)[0].getAttribute("data-page");
          $(this).addClass("is-active");
          const search = flickrServer + flickerMethod + api_key + flickrFrormat + textFormat + searchValue + per_page + page + pageNum;
          getData(search);
        })
      })
    })
  }
  // リセット
  function resetGallery() {
    gallery.empty();
    pager.empty();
  }
  // 画像表示
  function viewPhoto(data, viewPhotoNum) {
    for (let imageNum = 0; imageNum < viewPhotoNum; imageNum++) {
      const photo = data.photos.photo[imageNum];
      const farmId = photo.farm;
      const server = photo.server;
      const id = photo.id;
      const secret = photo.secret;
      const imageWidth = photo.width_q;
      const imageHeight = photo.height_q;
      const srcUrl = "http://farm" + farmId + ".staticflickr.com/"+ server +"/" + id + "_"+ secret +".jpg";
      const image = new Image(imageHeight, imageWidth);
      image.src = srcUrl;
      gallery.append(image);
    }
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
      pager.append('<li class="Pager__list"><a href="#' + i + '" data-page="' + i + '" class="Pager__anchor">' + i + '</a></li>')
      if (i === currentPage) {
        $('a[data-page="' + currentPage + '"').addClass("is-active");
      }
    }
    if (currentPage !== firstPageNum) {
      const prevPageNum = currentPage - 1
      pager.prepend('<li class="Pager__list"><a href="#' + prevPageNum + '" data-page="' + prevPageNum + '" class="Pager__anchor"><</a></li>')
      pager.prepend('<li class="Pager__list"><a href="#' + firstPageNum + '" data-page="' + firstPageNum + '" class="Pager__anchor"><<</a></li>')
    }
    if (currentPage !== lastPageNum) {
      const nextPageNum = currentPage + 1
      pager.append('<li class="Pager__list"><a href="#' + nextPageNum + '" data-page="' + nextPageNum + '" class="Pager__anchor">></a></li>')
      pager.append('<li class="Pager__list"><a href="#' + lastPageNum + '" data-page="' + lastPageNum + '" class="Pager__anchor">>></a></li>')
    }
  }
})
