const dplayer = new DPlayer({
  container: document.getElementById('video'),
  screenshot: true,
});

let nowplaying = -1;

const switchVideo = (epi, autoplay) => {
  if (epi === nowplaying) {
    return;
  }
  nowplaying = epi;
  const link = $data[epi] && $data[epi].link;
  if (!link) {
    return;
  }
  dplayer.switchVideo({
    url: '/' + link,
  });

  if (autoplay) {
    setTimeout(() => {
      dplayer.seek(0);
      dplayer.play();
    }, 0);
  }

  const playing = document.querySelector('.playing');
  playing && playing.classList.remove('playing');
  const select = document.querySelector(`[data-src="${epi}"]`);
  select && select.classList.add('playing');
}

Array.from(document.querySelectorAll('.playlist .item'))
  .map((elem) => {
    elem.addEventListener('click', (e) => {
      switchVideo(Number(elem.getAttribute('data-src')), true);
    });
  });

switchVideo(0, false);
