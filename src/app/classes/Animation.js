import Components from "classes/Components";

export default class Animation extends Components {
  constructor({ element, elements }) {
    super({
      element,
      elements,
    });

    this.createObserver();
  }

  createObserver() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.animateIn();
          console.log("in");
        } else {
          this.animateOut();
          console.log("out");
        }
      });
      this.observer.observe(this.element);
    });
  }

  animateIn() {}
  animateOut() {}
}
