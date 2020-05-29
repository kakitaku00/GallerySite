let Pager = {
  render : async() => {
    let view = `
      <div id="Gallery__pager" class="Gallery__pager">
        <ul id="Pager" class="Pager">
        </ul>
      </div>
    `
    return view
  },
  after_render : async () => {
  }
}

export default Pager;