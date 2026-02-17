export class FeedController {
  constructor(container, fetcher, VideoItemClass) {
    this.container = container;
    this.items = [];
    this.fetcher = fetcher;
    this.createLoader();
    this.createError();
    this.VideoItemClass = VideoItemClass;
  }

  createLoader() {
    this.loader = document.createElement("div");
    this.loader.classList.add("loader");
    this.loader.innerHTML = "loading. . .";
  }

  createError() {
    this.error = document.createElement("div");
    this.error.classList.add("error");
    this.error.innerHTML = "Oops. . . ";
  }

  async init() {
    this.container.classList.add("feed");

    this.container.appendChild(this.loader);

    await this.fetcher.get("list/");

    this.container.removeChild(this.loader);

    if (this.fetcher.error) {
      this.container.appendChild(this.error);

      return;
    }

    this.fetcher.links.forEach((url) => this.addVideo(url));
  }

  addVideo(url) {
    const item = new this.VideoItemClass(url);
    this.items.push(item);
    this.container.appendChild(item.create());
  }

  async checkEnd() {
    const scrollBottom = this.container.scrollTop + window.innerHeight;
    const totalHeight = this.container.scrollHeight;
    const threshold = 3 * window.innerHeight;

    console.log("scrollBottom", scrollBottom);
    console.log("totalHeight", totalHeight);
    console.log("threshold", threshold);
    console.log("this.fetcher", this.fetcher);

    if (scrollBottom + threshold >= totalHeight) {
      if (this.fetcher.loading) return;

      await this.fetcher.get("list/");

      if (!this.fetcher.error && this.fetcher.links.length) {
        this.fetcher.links.forEach((url) => this.addVideo(url));
      }
    }
  }
}
