$(function() {

  const searchText = $("#SearchText");
  const searchBtn = $("#SearchBtn");
  const gallery = $("#Gallery");
  const pager = $(".Pager");

  // flickerAPI
  const flickrServer = "https://api.flickr.com/services/rest";
  const api_key = "&api_key=ec560fe4b5414933f7dd557ed0ec7a78";
  const flickerMethod = "?method=flickr.photos.search";
  const flickrFrormat = "&format=json&nojsoncallback=1&extras=url_sq,date_taken"
  let searchValue = "";
  const per_page = "&per_page=50";
  const page = "&page=";
  let pageNum = 1

  // 検索
  searchBtn.on("click", function() {
    // 検索文字が同じ時は処理をしない
    if (searchValue === searchText[0].value) {return}
    searchValue = searchText[0].value;
    // Gallery/Pagerの中を空にする
    resetGallery()
    // 画像を取得
    const searchURI = flickrServer + flickerMethod + api_key + flickrFrormat + "&text=" + searchValue + per_page + page + pageNum;
    getData(searchURI);
  })

  // ページ

  // APIから画像を取得
  function getData(uri) {
    $.ajax({
      type: 'GET',
      url: uri,
      dataType: 'json'
    })
    .then(function(data) {
      // 写真の枚数
      const viewPhotoNum = data.photos.perpage;
      // 枚数分取得
      for (let imageNum = 0; imageNum < viewPhotoNum; imageNum++) {
        const photo = data.photos.photo[imageNum];
        const farmId = photo.farm;
        const server = photo.server;
        const id = photo.id;
        const secret = photo.secret;
        const imageWidth = photo.width_sq;
        const imageHeight = photo.height_sq;
        const srcUrl = "http://farm" + farmId + ".staticflickr.com/"+ server +"/" + id + "_"+ secret +".jpg";
        const image = new Image(imageHeight, imageWidth);
        image.src = srcUrl;
        gallery.append(image);
      }
    })
    .then(function() {
      $(".Pager__anchor:first").addClass("is-active");
      $(".Pager__anchor").each(function() {
        // イベントリスナーがすでに登録されていいた場合はスルー
        if (jQuery._data($(this).get(0)).events) {
          return
        }
        pageNum = $(this)[0].getAttribute("id")
        $(this).on("click", function(e) {
          e.preventDefault();
          const targetPageNum = $(this)[0].getAttribute("id");
          if (pageNum !== targetPageNum) {
            pageNum = targetPageNum;
            resetGallery()
            $(this).addClass("is-active");
            const search = flickrServer + flickerMethod + api_key + flickrFrormat + "&text=" + searchValue + per_page + page + pageNum;
            getData(search);
          }
        })
      })
    })
  }
  function resetGallery() {
    gallery.empty();
    $(".is-active").removeClass("is-active");
  }
})
