const $ = (selector) => document.querySelector(selector);

(async () => {
  const screenWidth = (8.5 * 96) - 1;
  const screenHeight = (11 * 96) - 16;

  const pageEl = $('.page');
  pageEl.style.width = `${screenWidth}px`;
  pageEl.style.height = `${screenHeight}px`;

  const headerEl = $('header');
  const footerEl = $('footer');

  const chartEl = $('.chart');

  const INCR = 0.01;
  let fontSize = 0;
  while (screenWidth > chartEl.scrollWidth || screenHeight > chartEl.scrollHeight) {
    chartEl.style.fontSize = `${fontSize}px`;

    let isOutOfBounds = await new Promise(res => {
      setTimeout(() => res(chartEl.scrollWidth > screenWidth || chartEl.scrollHeight > screenHeight));
    })

    if (isOutOfBounds) {
      chartEl.style.fontSize = `${fontSize - INCR * 2}px`;
      document.querySelector('body').classList.add('complete');
      break;
    }

    fontSize += INCR;
  }

  chartEl.style.width = `${screenWidth}px`;
  chartEl.style.height = `${screenHeight - headerEl.scrollHeight - footerEl.scrollHeight}px`;
})();
