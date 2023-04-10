
export function setupVideo(url: string,callBack:()=>void) {
    const video = document.createElement("video");
    video.crossOrigin = "anonymous";
    
    let playing = false;
    let timeupdate = false;

    video.playsInline = true;
    video.muted = true;
    video.loop = true;

    // Waiting for these 2 events ensures
    // there is data in the video

    video.addEventListener(
        "playing",
        () => {
            playing = true;
            checkReady();
        },
        true
    );

    video.addEventListener(
        "timeupdate",
        () => {
            timeupdate = true;
            checkReady();
        },
        true
    );

    video.src = url;
    video.play();

    function checkReady() {
        if (playing && timeupdate) {
            callBack();
        }
    }

    return video;
}
