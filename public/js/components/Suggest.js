import Utils from "../util/Utils.js"

const Suggest = {
  render : async() => {
    let view = `
      <datalist id="Keywords"></datalist>
    `
    return view
  },
  after_render : async () => {
    const app = {
      init: async function() {
        await this.bindEvent()
      },
      bindEvent: async function() {
        await this.createOption();
      },
      createOption: async function() {
        const option = Utils.data.keywords.map((keyword) => {
          return `<option value="${keyword}"></option>`
        })
        $("#Keywords").html(option.join(''))
      }
    }
    app.init()
  }
}

export default Suggest