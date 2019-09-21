console.log($data);

const container = document.querySelector('.container');

const rowMode = () => {
  let now = 0;
  const makeMove = (delta) => {
    container.style.transform = `translateX(${now -= delta}px)`;
    console.log(delta);
  }
  document.addEventListener('mousewheel', (e) => {
    if (!e.deltaX) {
      makeMove(e.deltaY);
    } else {
      makeMove(e.deltaX);
    }
  });
  let touchpos = 0;
  document.addEventListener('touchstart', (e) => {
    container.style.transition = 'none';
    touchpos = e.touches[0].clientX;
  });
  document.addEventListener('touchmove', (e) => {
    makeMove(touchpos - e.changedTouches[0].clientX);
    touchpos = e.changedTouches[0].clientX;
  });
}

rowMode();
