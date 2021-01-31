/**
 * @param {string } tagName - e.g. "div" or span;
 * @param {Object } attributes - May contain css classes and other attributes
 * @param {string } content - Content for text nodes
 * @param {array<HTMLElement> } children - Child elements  
 * 
 * @returns { HTMLElement } - Specified tag with attributes and child elements
 */
export const createElement = ({tagName, attributes, content, children}) => {
  if(tagName === "text") {
    return document.createTextNode(content);
  } else {
    if(arguments instanceof Object) {
      const parent = document.createElement(tagName);
      if(attributes && attributes instanceof Object) {
        // add classes and other attributes to element
        for(let attribute in attributes) {
          const itsValue = attributes[attribute];
          if(attribute === "classes" && itsValue instanceof Array) {
            parent.classList.add(...itsValue);
          } else {
            parent.setAttribute(attribute, itsValue);
          }
        }
        
        // add child elements if any
        if(children && children instanceof Array) parent.append(...children);
      }
      
      return parent;
    } else {
      throw new Error("Config must be an object!")
    }
  }
}

export const destroyElement = element => {
  const parent = element.parentNode;
  if(parent && parent.contains(element)) parent.removeChild(element);
  else return;
}


export const removeChildren = parent => {
  while(parent.lastChild) parent.removeChild(parent.lastChild);
}

/**
 * @param { array<object> } elements 
*/
export const renderData = elements => {
  if(elements instanceof Array) {
    for(let pair of elements) {
      const {target, content} = pair;
      /* 
        nodeType === 1 means that node is an HTML element (e.g. div, p, etc.).
        Just for comparison nodeType === 3 signifies about a text node.
      */
      content.nodeType === 1 ? target.appendChild(content) : target.textContent = content;
    }
  } else {
    throw new Error("Parameter must be an array");
  }
}

export const  buildPrecipHTML = day => {
  return createElement({
    tagName: "li",
    attributes: {
      classes: ["details_item", "precips"]
    },
    children: [
      createElement({
        tagName: "span",
        attributes: {
          classes: ["details_name"]
        },
        children: [
          // precipitation type (rain, snow, etc.)
          createElement({
            tagName: "text",
            content: `${day.PrecipitationType}`
          })
        ]
      }),
      createElement({
        tagName: "span",
        attributes: {
          classes: ["details_value", "precip_value"]
        },
        children: [
          // precipitation value in mm
          createElement({
            tagName: "text",
            content: `${day.Precip1hr.Metric.Value}mm`
          })
        ]
      })
    ]
  });
}


export const buildNextDayHTML = ({weekDay, icon, maxTemp, minTemp}) => {
  return createElement({
    tagName: "li",
    attributes: {
      classes: ["nextDays_item"]
    },
    children: [
      // building week day HTML
      createElement({
        tagName: "div",
        attributes: {
          classes: ["nextDays_item-box"]
        },
        children: [
          createElement({
            tagName: "span",
            attributes: {
              classes: ["nextDays_day"]
            },
            children: [
              createElement({
                tagName: "text",
                content: weekDay
              })
            ]
          })
        ]
      }),

      // building icon HTML
      createElement({
        tagName: "div",
        attributes: {
          classes: ["nextDays_item-box", "nextDays_item-centered"]
        },
        children: [
          createElement({
            tagName: "span",
            attributes: {
              classes: ["nextDays_state"]
            },
            children: [
              icon
            ]
          })
        ]
      }),

      // building min/max temperature HTML
      createElement({
        tagName: "div",
        attributes: {
          classes: ["nextDays_item-box"]
        },
        children: [
          createElement({
            tagName: "div",
            attributes: {
              classes: ["nextDays_temps"]
            },
            children: [
              // max temp
              createElement({
                tagName: "span",
                attributes: {
                  classes: ["nextDays_max"]
                }, 
                children: [
                  createElement({
                    tagName: "text",
                    content: `${Math.ceil(minTemp)}\u00b0`
                  })
                ]
              }),
              // min temp
              createElement({
                tagName: "span",
                attributes: {
                  classes: ["nextDays_min"]
                }, 
                children: [
                  createElement({
                    tagName: "text",
                    content: `${Math.ceil(maxTemp)}\u00b0`
                  })
                ]
              }),
            ]
          })
        ]
      })
    ]
  });
}