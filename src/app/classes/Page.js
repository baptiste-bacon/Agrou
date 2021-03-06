import GSAP from "gsap";

import map from "lodash/map";
import each from "lodash/each";

import Prefix from "prefix";

import normalizeWheel from "normalize-wheel";

import Description from "animations/Descriptions";

export default class Page {
  constructor({ element, elements, id }) {
    this.selector = element;
    this.selectorChildren = {
      ...elements,
      animationsDescriptions: '[data-animation="description"]',
    };
    this.id = id;

    this.transformPrefix = Prefix("transform");

    this.onMouseEvent = this.onMouseWheel.bind(this);
  }

  create() {
    this.element = document.querySelector(this.selector);
    this.elements = {};

    this.scroll = {
      current: 0,
      target: 0,
      last: 0,
      limit: 0,
    };

    each(this.selectorChildren, (entry, key) => {
      if (
        entry instanceof window.HTMLElement ||
        entry instanceof NodeList ||
        Array.isArray(entry)
      ) {
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

    this.createAnimation();
  }

  createAnimation() {
    this.animationsDescriptions = map(
      this.elements.animationsDescriptions,
      (element) => {
        return new Description({
          element,
        });
      }
    );
    console.log(this.elements.animationsDescriptions);
  }

  show() {
    return new Promise((resolve) => {
      this.animationIn = GSAP.timeline();
      this.animationIn.fromTo(
        this.element,
        {
          autoAlpha: 0,
        },
        {
          autoAlpha: 1,
        }
      );
      this.animationIn.call((_) => {
        this.addEventListeners();
        resolve();
      });
    });
  }

  hide() {
    return new Promise((resolve) => {
      this.removeEventListeners();
      this.animationOut = GSAP.timeline();
      this.animationOut.to(this.element, {
        autoAlpha: 0,
        onComplete: resolve,
      });
    });
  }

  onMouseWheel(event) {
    const { pixelY } = normalizeWheel(event);
    this.scroll.target += pixelY;
  }

  onResize() {
    this.scroll.limit = this.elements.wrapper.clientHeight - window.innerHeight;
  }

  update() {
    this.scroll.target = GSAP.utils.clamp(
      0,
      this.scroll.limit,
      this.scroll.target
    );

    this.scroll.current = GSAP.utils.interpolate(
      this.scroll.current,
      this.scroll.target,
      0.1
    );

    if (this.scroll.current < 0.01) {
      this.scroll.current = 0;
    }

    if (this.elements.wrapper.style) {
      this.elements.wrapper.style[
        this.transformPrefix
      ] = `translateY(-${this.scroll.current}px)`;
    }
  }

  addEventListeners() {
    window.addEventListener("mousewheel", this.onMouseEvent);
  }

  removeEventListeners() {
    window.removeEventListener("mousewheel", this.onMouseEvent);
  }
}
