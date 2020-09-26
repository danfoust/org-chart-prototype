import express from 'express';
import fs from 'fs';
import path from 'path';

import { drawTree, getTree } from './chart';

const app = express();
const PORT = 8000;

app.get('/', (req, res) => {
  const tree = getTree();
  const html = `
  <html>
    <head><style>${fs.readFileSync(path.resolve('./src/assets/chart.css'))}</style></head>
    <body>
      <div class="page">
        <header><h1>Brand Name</h1></header>
        <div class="chart">
          ${drawTree(tree, 0)}
        </div>
        <footer>
          <div class="service">Organization Chart, LLC</div>
          <div class="copyright">
            <div>Printed: ${(new Date()).toISOString().slice(0,10)}</div>
            <div>Copyright &copy;</div>
          </div>
      </div>
    </body>
  </html>
  `;
  res.contentType('.html').send(html);
});

app.get('/pdf', (req, res) => {
  res.send('Express + TypeScript Server')
});

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});
