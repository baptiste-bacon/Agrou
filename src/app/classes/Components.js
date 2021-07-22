import each from "lodash/each";
import eventEmitter from "events";

export default class Components extends eventEmitter {
  constructor({ element, elements }) {
    super();

    this.selector = element;
    this.selectorChildren = { ...elements };

    this.create();

    this.addEventListeners();
  }

  create() {
    this.element = document.querySelector(this.selector);
    this.elements = {};

    each(this.selectorChildren, (entry, key) => {
      if (entry instanceof window.HTMLElement || entry instanceof NodeList) {
        this.elements[key] = entry;
      } else {
        this.elements[key] = document.querySelectorAll(entry);
        if (this.elements[key].lenght === 0) {
          this.elements[key] = null;
        } else {
          this.elements[key] = document.querySelector(entry);
        }
      }
    });
    console.log("Create", this.id, this.element, this.elements);
  }

  addEventListeners() {}

  removeEventListeners() {}
}
