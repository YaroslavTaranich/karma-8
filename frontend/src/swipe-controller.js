export class SwipeController {
  constructor(feed) {
    this.feed = feed;
    this.container = feed.container;

    this.startY = 0;
    this.currentY = 0;
    this.dragging = false;
    this.threshold = 80;
    this.locked = false;
    this.lockDelay = 200;
    this.wheelTimeout = null;

    this.init();
  }

  lock() {
    this.locked = true;
    setTimeout(() => (this.locked = false), this.lockDelay);
  }

  init() {
    this.container.addEventListener("touchstart", (e) =>
      this.start(e.touches[0].clientY)
    );
    this.container.addEventListener("touchmove", (e) =>
      this.move(e.touches[0].clientY, e)
    );
    this.container.addEventListener("touchend", () => this.end());

    this.container.addEventListener("mousedown", (e) => this.start(e.clientY));
    this.container.addEventListener("mousemove", (e) =>
      this.move(e.clientY, e)
    );
    this.container.addEventListener("mouseup", () => this.end());
    this.container.addEventListener("mouseleave", () => this.end());

    window.addEventListener("keydown", (e) => {
      if (this.locked) return;
      if (e.key === "ArrowDown") this.next();
      else if (e.key === "ArrowUp") this.prev();
    });

    window.addEventListener(
      "wheel",
      (e) => {
        if (this.locked || this.wheelTimeout) return;
        if (e.deltaY > 50) this.next();
        else if (e.deltaY < -50) this.prev();

        this.wheelTimeout = setTimeout(
          () => (this.wheelTimeout = null),
          this.lockDelay
        );
      },
      { passive: true }
    );
  }

  start(y) {
    if (this.locked) return;
    this.dragging = true;
    this.startY = y;
    this.currentY = y;
  }

  move(y, e) {
    if (!this.dragging || this.locked) return;
    e.preventDefault();
    this.currentY = y;
  }

  end() {
    if (!this.dragging || this.locked) return;
    this.dragging = false;

    const delta = this.currentY - this.startY;
    if (Math.abs(delta) < this.threshold) return;

    if (delta < 0) this.next();
    else this.prev();
  }

  next() {
    this.lock();
    this.container.scrollBy({ top: window.innerHeight, behavior: "smooth" });
    this.feed.checkEnd();
  }

  prev() {
    this.lock();
    this.container.scrollBy({ top: -window.innerHeight, behavior: "smooth" });
  }
}
