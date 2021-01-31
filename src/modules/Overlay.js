import { createElement, destroyElement } from "./Operations";

export default class Overlay {
  constructor() {
    this.overlay = document.querySelector(".overlay") || this._createOverlay();
    this.appendTo();
  }

  _createOverlay() {
    return createElement({
      tagName: "div",
      attributes: {
        classes: ["overlay"]
      }
    });
  }

  appendTo(parent = document.body) {
    parent.appendChild(this.overlay);
  }

  destroy(element) {
    element.classList.add("hidden");
    setTimeout(() => {
      element.classList.remove("hidden");
      destroyElement(element);
    }, 1000);
  }
}