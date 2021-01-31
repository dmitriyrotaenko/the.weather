import { createElement, destroyElement } from './Operations';

export default class Tooltip {
	constructor(element, text) {
		this.element = element;
		this.text = text;
		this.tooltip = this.createTooltip(this.text);


		this.element.addEventListener("mouseover", () => {
			this.showTooltip(this.tooltip);
		});

		this.element.addEventListener("mouseleave", () => {
			this.destroyTooltip(this.tooltip);
		});
	}

	createTooltip(text) {
		return createElement({
			tagName: "div",
			attributes: {
				classes: ["tooltip"]
			},
			children: [
				createElement({
					tagName: "text",
					content:  text
				})
			]
		})
	}

	showTooltip(tooltip, parent = document.body) {
		parent.appendChild(tooltip);
		const { x:elementX, width:elementW, y:elementY } = this.element.getBoundingClientRect();
		const { height:tooltipH, width:tooltipW } = this.tooltip.getBoundingClientRect();

		// center tooltip above the target element
		const yPos = elementY - tooltipH * 1.5;
		const xPos = Math.abs(elementX - Math.abs(elementW - tooltipW) / 2);
		
		this.tooltip.style.cssText = `transform: translate(${xPos}px, ${yPos}px); visibility: visible;`;
	}

	destroyTooltip(tooltip) {
		destroyElement(tooltip);
	}

}

