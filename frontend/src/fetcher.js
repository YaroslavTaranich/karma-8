export class Fetcher {
  constructor(url) {
    this.url = url;
    this.links = [];
    this.loading = true;
    this.error = false;
  }

  async get(path) {
    try {
      this.loading = true;
      const resp = await fetch(this.url + path);
      const data = await resp.json();
      this.links = data;
    } catch {
      this.error = true;
    } finally {
      this.loading = false;
    }
  }
}
