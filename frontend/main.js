import { VideoItem } from "./src/video-item.js";
import { FeedController } from "./src/feed-controller.js";
import { SwipeController } from "./src/swipe-controller.js";
import { Fetcher } from "./src/fetcher.js";

const API_URL = "http://localhost:3000/";

const app = document.getElementById("app");

const feed = new FeedController(app, new Fetcher(API_URL), VideoItem);

feed.init();

new SwipeController(feed);
