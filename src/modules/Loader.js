import { createElement } from "./Operations";

export default class Loader {
  constructor(parent = document.body) {
    this.parent = parent;
    
    this.loader = createElement({
      // creating loader container 
      tagName: "div",
      attributes: {
        classes: ["loader_container"]
      },
      children: [
        // creating spinner
        createElement({
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
        })
      ]
    });

    this.parent.appendChild(this.loader);
  }

  start() {
    if(this.loader.classList.contains("hidden")) {
      this.loader.classList.remove("hidden");
    }
  }

  destroy() {
    this.loader.classList.add("hidden");
  }

}

