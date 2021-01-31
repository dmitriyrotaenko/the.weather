import Overlay from "./Overlay";
import { 
  createElement,
  removeChildren
 } from "./Operations";

export default class Modal extends Overlay {
  constructor(text, {onSubmit, onCancel}) {
    super();
    this.text = text;
    this.onSubmit = onSubmit;
    this.onCancel = onCancel;

    this.okButton = createElement({
      tagName: "button",
      attributes: {
        classes: ["button", "button_primary"]
      },
      children: [
        createElement({
          tagName: "text",
          content: "Ok"
        })
      ]
    });

    this.cancelButton = createElement({
      tagName: "button",
      attributes: {
        classes: ["button", "button_cancel"]
      },
      children: [
        createElement({
          tagName: "text",
          content: "Cancel"
        })
      ]
    });

    this.modal = this.createModal(this.text, this.okButton, this.cancelButton);
    this.listeners();
    this.init();
  }

  createModal(text, ok, cancel) {
    return createElement({
      tagName: "div",
      attributes: {
        classes: ["modal"]
      },
      children: [
        // modal text 
        createElement({
          tagName: "div",
          attributes: {
            classes: ["modal_text"]
          },
          children: [
            createElement({
              tagName: "text",
              content: text
            })
          ]
        }),
        // modal controls
        createElement({
          tagName: "div",
          attributes: {
            classes: ["modal_controls"]
          },
          children: [
            // "cancel" button
            cancel,
            // "OK" button
            ok
          ]
        })
      ]
    });
  }

  listeners() {
    this.okButton.addEventListener("click", this.onSubmit.bind(this));
    this.cancelButton.addEventListener("click", this.onCancel.bind(this));
  }

  init() {
    if(!document.body.contains(this.overlay)) super.appendTo();
    if(this.overlay.children) removeChildren(this.overlay);

    this.overlay.appendChild(this.modal);
  }

  destroy(destroyOverlay = true) {
    if(destroyOverlay) super.destroy(this.overlay);
    super.destroy(this.modal);
  }
}
