import { getVideoElement } from "./getVideoElement";
import { isDomRectEqual } from "./isDomRectEqual";

import refreshOnUpdate from "virtual:reload-on-update-in-view";

refreshOnUpdate("pages/content");

// find video element in the DOM and add id

// get message from background script
chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
  if (message.active) {
    let video = getVideoElement();
    if (!video) return sendResponse(false);

    // get most parent element at the same position as the video
    const videoRect = video.getBoundingClientRect();
    while (video.parentElement) {
      const parentRect = video.parentElement.getBoundingClientRect();

      if (!isDomRectEqual(parentRect, videoRect)) break;
      video.classList.add("video-cinema-mode-inner");
      video = video.parentElement;
    }

    // save parent element in global variable
    window.cinemaExtension = {
      container: video.parentElement,
      after: video.nextElementSibling,
    };

    // move video element to first child of body
    document.body.prepend(video);
    video.classList.add("video-cinema-mode");
    sendResponse(true);
  } else {
    const video = document.querySelector(`.video-cinema-mode`);
    if (!video) return sendResponse(false);

    // move video element back to parent
    if (window.cinemaExtension.after) {
      window.cinemaExtension.container.insertBefore(
        video,
        window.cinemaExtension.after
      );
    } else {
      window.cinemaExtension.container.append(video);
    }
    video.classList.remove("video-cinema-mode");

    // find all elements with class video-cinema-mode-inner and remove it
    const innerVideos = document.querySelectorAll(".video-cinema-mode-inner");
    innerVideos.forEach((innerVideo) =>
      innerVideo.classList.remove("video-cinema-mode-inner")
    );

    sendResponse(true);
  }
});
