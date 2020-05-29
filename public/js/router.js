import Gallery from "./views/Gallery.js"
import Detail from "./views/Detail.js"

import Utils from "./util/Utils.js"

const router = async () => {
  const routes = {
    "/"               : Gallery,
    "/detail.html"    : Detail
  };

  const $Contents = $("#Contents")

  const request = Utils.parseRequestUrl()
  const page = routes[request.resource]

  $Contents.html(await page.render())
  await page.after_render()
}

export default router