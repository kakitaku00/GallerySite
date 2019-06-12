$(function() {

  const searchText = $("#SearchText");
  const searchBtn = $("#SearchBtn");
  const gallery = $("#Gallery");
  const pager = $(".Pager");
  let searchValue = "";

  // flickerAPI
  const flickrServer = "https://api.flickr.com/services/rest";
  const api_key = "&api_key=ec560fe4b5414933f7dd557ed0ec7a78";
  const flickerMethod = "?method=flickr.photos.search";
  const flickrFrormat = "&format=json&nojsoncallback=1&extras=url_sq,date_taken"
  const per_page = "&per_page=500";
  const page = "&page=1";
  const searchURI = flickrServer + flickerMethod + api_key + flickrFrormat + per_page + page + "&text=";

  // 検索
  searchBtn.on("click", function() {
    // 検索文字が同じ時は処理をしない
    if (searchValue === searchText[0].value) {return}
    searchValue = searchText[0].value;
    // Gallery/Pagerの中を空にする
    gallery.empty();
    pager.empty();
    // 画像を取得
    getData(searchURI + searchValue);
  })

  // APIから画像を取得
  function getData(uri) {
    $.ajax({
      type: 'GET',
      url: uri,
      dataType: 'json'
    }).then(function(data) {
      console.log(data)
      // const pageTotal = data.photos.pages;
      // 10個divを作る
      for (let i = 1; i <= 10; i++) {
        gallery.append(`<div class="Gallery__block" id="Gallery__${i}"></div>`);
      }
      return data
    })
    .then(function(data) {
      const photosLength = data.photos.photo.length;
      // ページ振り分け
      let pageNum = 1;
      const viewPhotoNum = 50;
      let changePhotoNum = viewPhotoNum;
      for (let imageNum = 0; imageNum < photosLength; imageNum++) {
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

        if (imageNum === changePhotoNum) {
          pager.append(`<li class="Pager__list"><a href="#Gallery__${pageNum}" class="Pager__anchur">${pageNum}</a></li>`)
          pageNum++;
          changePhotoNum = viewPhotoNum * pageNum;
        }
        const targetContent = $(`#Gallery__${pageNum}`);
        targetContent.append(image);
      }
    })
    .then(function() {
      $(".Pager__anchur:first").addClass("is-active")
      $(".Pager__anchur").each(function() {
        $(this).on("click", function(e) {
          e.preventDefault();
          $(".Pager__anchur").removeClass("is-active");
          $(this).addClass("is-active");
          const targetId = $(this).attr("href");
          pageChange(targetId)
        })
      })
    })
    .then(function() {
      // 最初のコンテンツを表示
      $("#Gallery div:first").css("display","flex")
      // ページャーを表示
      pager.show();
    })
  }

  // ページネーション
  function pageChange(targetId) {
    gallery.children().css("display","none");
    $(targetId).css("display","flex");
  }
})
