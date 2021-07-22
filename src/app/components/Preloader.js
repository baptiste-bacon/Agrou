import each from "lodash/each";
import GSAP from "gsap";

import Component from "classes/Components";
import { split } from "utils/text";

export default class Preloader extends Component {
  constructor() {
    super({
      element: ".preloader",
      elements: {
        title: ".preloader__text",
        number: ".preloader__number",
        images: document.querySelectorAll("img"),
      },
    });
    this.elements.titleSpans = split({
      element: this.elements.title,
      expression: "<br>",
    });

    this.length = 0;
    this.createLoader();
  }

  createLoader() {
    each(this.elements.images, (element) => {
      element.onload = (_) => this.onAssetLoaded(element);
      element.src = element.getAttribute("data-src");
    });
  }

  onAssetLoaded(image) {
    this.length += 1;
    console.log(this.length, this.elements.images.length);
    const percent = this.length / this.elements.images.length;

    this.elements.number.innerHTML = `${Math.round(percent * 100)}%`;

    if (percent === 1) {
      this.onLoaded();
    }
  }

  onLoaded() {
    this.emit("completed");
  }

  hide() {
    return new Promise((resolve) => {
      this.animateOut = GSAP.timeline({ delay: 2 });

      this.animateOut.to(this.element, {
        duration: 1.25,
        yPercent: -100,
        ease: "power3",
        onComplete: resolve,
      });
    });
  }

  destroy() {
    this.element.parentNode.removeChild(this.element);
    console.log("destroyed");
  }
}
