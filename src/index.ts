import express from 'express';

import {
  renderPage, 
  getTree, 
  renderPDF,
} from './chart';

const app = express();
const PORT = 8000;

app.get('/', (_, res) => {
  const tree = getTree(true);
  const html = renderPage(tree);

  res.contentType('.html').send(html)
});

app.get('/pdf', async (_, res) => {
  const tree = getTree(true);
  const html = renderPage(tree);
  const buffer = await renderPDF(html, {
    width: 8.5 * 96,
    height: 11 * 96,
    printBackground: true,
  });

  res.contentType('application/pdf').send(buffer);
});

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});
