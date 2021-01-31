import Overlay from "./Overlay";
import { 
  createElement,
  removeChildren
} from "./Operations";

export default class Loader extends Overlay {
  constructor() {
    super();
    this.loader = this._createLoader();
    this.init();
  }

  _createLoader() {
    return createElement({
      tagName: "div",
      attributes: {
        classes: ["loader"]
      },
      children: [
        // loader placeholder
        createElement({
          tagName: "text",
          content: "Loading..."
        })
      ]
    });
  }

  init() {
    if(!document.body.contains(this.overlay)) super.appendTo();
    if(this.overlay.children) removeChildren(this.overlay);
      
    this.overlay.appendChild(this.loader);
  }

  destroy(destroyModal = true) {
    super.destroy(this.loader);
    if(destroyModal) super.destroy(this.overlay);
  }
}