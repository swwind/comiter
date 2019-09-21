console.log($data);

const container = document.querySelector('.container');

const rowMode = () => {
  let now = 0, nowpage = 0;
  const imgs = Array.from(document.querySelectorAll('.container img'));
  const prefixOfImgs = (length) => {
    return imgs.slice(0, length)
      .map((el) => el.clientWidth)
      .reduce((a, b) => a + b, 0);
  }

  const nowpageElem = document.getElementById('nowpage');

  const makeMove = (delta) => {
    now -= delta;
    container.style.transform = `translateX(${now}px)`;
    for (let i = 0; i < imgs.length; ++ i) {
      if (prefixOfImgs(i) >= -now) {
        nowpage = i;
        break;
      }
    }
    nowpageElem.textContent = String(nowpage + 1);
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

  document.querySelector('.leftpage').addEventListener('click', (e) => {
    makeMove(now + prefixOfImgs(Math.max(0, nowpage - 1)));
  });
  document.querySelector('.rightpage').addEventListener('click', (e) => {
    makeMove(now + prefixOfImgs(Math.min(imgs.length - 1, nowpage + 1)));
  });
}

rowMode();
