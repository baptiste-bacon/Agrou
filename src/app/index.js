import Preloader from "components/Preloader";

import Home from "pages/Home";

class App {
  constructor() {
    this.createPreloader();
    this.createContent();
    this.createPages();

    this.addEventListeners();

    this.update();
  }

  createPreloader() {
    this.preloader = new Preloader();
    this.preloader.once("completed", this.onPreloaded.bind(this));
  }

  createContent() {
    this.content = document.querySelector("#content");
    this.template = this.content.getAttribute("data-template");
  }

  createPages() {
    this.pages = {
      home: new Home(),
    };
    this.page = this.pages[this.template];
    this.page.create();
  }

  /**
   * Events
   */
  async onPreloaded() {
    await this.preloader.hide();

    this.preloader.destroy();

    this.onResize();
    this.page.show();
  }

  onResize() {
    if (this.page && this.page.onResize) {
      this.page.onResize();
    }
  }

  /**
   * Loop
   */
  update() {
    if (this.page && this.page.update) {
      this.page.update();
    }
    this.frame = window.requestAnimationFrame(this.update.bind(this));
  }

  /**
   * Listeners
   */
  addEventListeners() {
    window.addEventListener("resize", this.onResize.bind(this));
  }
}
new App();
