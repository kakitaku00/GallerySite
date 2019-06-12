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
  const per_page = "&per_page=90";
  const page = "&page=1";
  const searchURI = flickrServer + flickerMethod + api_key + flickrFrormat + per_page + page + "&text=";

  // 検索
  searchBtn.on("click", function() {
    // 検索文字が同じ時は処理をしない
    if (searchValue === searchText[0].value) {return}
    searchValue = searchText[0].value;
    // Galleryの中を空にする
    gallery.empty();
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
      gallery.html(`
        <div id="Gallery__1"></div>
        <div id="Gallery__2"></div>
        <div id="Gallery__3"></div>
      `);
      return data
    }).then(function(data) {
      const photosLength = data.photos.photo.length;
      let pageNum = 0;
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

        // ページ振り分け
        if (0 <= imageNum && imageNum < 30) {
          pageNum = 1;
          const targetContent = $(`#Gallery__${pageNum}`);
          targetContent.append(image);
        } else if (30 <= imageNum && imageNum < 60) {
          pageNum = 2;
          const targetContent = $(`#Gallery__${pageNum}`);
          targetContent.append(image);
        } else if (60 <= imageNum && imageNum < 90) {
          pageNum = 3;
          const targetContent = $(`#Gallery__${pageNum}`);
          targetContent.append(image);
        }
      }
    }).then(function() {
      pager.show();
    })
  }

  // ページネーション
  function pageChange(targetId) {
    gallery.children().hide()
    $(targetId).show();
  }

  $(".Pager__anchur").each(function() {
    $(this).on("click", function(e) {
      e.preventDefault();
      const targetId = $(this).attr("href");
      pageChange(targetId)
    })
  })
})
