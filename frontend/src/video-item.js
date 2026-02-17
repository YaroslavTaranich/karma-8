export class VideoItem {
  constructor(url) {
    this.url = url;
    this.node = null;
    this.video = null;

    this.autoPlayObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target !== this.node) return;

          if (entry.isIntersecting) this.play();
          else this.pause();
        });
      },
      { threshold: 0.6 }
    );

    this.unloadObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target !== this.node) return;

          if (!entry.isIntersecting) {
            this.stopLoading();
          } else {
            this.resumeLoading();
          }
        });
      },
      { threshold: 0, rootMargin: "150%" }
    );
  }

  create() {
    const wrapper = document.createElement("div");
    wrapper.className = "video-item";

    const video = document.createElement("video");
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.autoplay = false;

    wrapper.appendChild(video);

    this.node = wrapper;
    this.video = video;

    this.autoPlayObserver.observe(wrapper);
    this.unloadObserver.observe(wrapper);

    this.resumeLoading();

    return wrapper;
  }

  play() {
    this.video.play().catch(() => {});
  }

  pause() {
    this.video.pause();
  }

  stopLoading() {
    if (!this.video) return;

    this.video.pause();
    this.video.removeAttribute("src");
    this.video.load();
  }

  resumeLoading() {
    if (!this.video) return;

    if (!this.video.src) {
      this.video.src = this.url;
      this.video.load();
    }
  }
}
