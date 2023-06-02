export function getVideoElement() {
  // get the largest video element in the dom
  const videos = document.querySelectorAll("video");
  let video: HTMLElement = null;
  let videoSize = 0;
  for (let i = 0; i < videos.length; i++) {
    const rect = videos[i].getBoundingClientRect();
    const currSize = rect.width * rect.height;
    if (currSize > videoSize) {
      video = videos[i];
      videoSize = currSize;
    }
  }
  return video;
}
