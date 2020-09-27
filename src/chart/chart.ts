import faker from 'faker';
import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';

export interface ChartSeat {
  name: string;
  roles: string[];
  children: ChartSeat[];
}

export function createSeat(): ChartSeat {
  return {
    name: faker.name.jobTitle(),
    roles: ['Manage Others', 'Track Time', 'Work Hard'],
    children: [],
  }
}

export function createTree(seat: ChartSeat, depth: number): void {
  if (depth > 5) return;

  const childCount = 2;
  for (let i = 0; i < childCount; i++) {
    const childSeat = createSeat();

    createTree(childSeat, depth + 1);

    seat.children.push(childSeat);
  }
}

export function getTree(useCache: boolean): ChartSeat {
  let tree: ChartSeat | null = null;
  
  if (useCache) {
    tree = JSON.parse(fs.readFileSync(path.resolve('./src/cached-tree.json')).toString());
  }

  if (!tree) {
    tree = createSeat();
    createTree(tree, 0);
    fs.writeFileSync(path.resolve('./src/cached-tree.json'), JSON.stringify(tree));
  }

  return tree;
}

export function drawTree(seat: ChartSeat, depth: number): string {
  const seatClasses = ['seat'];

  if (depth === 0) seatClasses.push('first');
  if (depth > 0) seatClasses.push('child');

  const childClasses = ['children'];
  let childHTML = '';
  if (seat.children.length > 0) {

    if (seat.children.length === 1) childClasses.push('single');

    seatClasses.push('parent');
    childHTML += `
      <div class="${childClasses.join(' ')}">
        ${seat.children.map(s => drawTree(s, depth + 1)).join('')}
      </div>
    `;
  }

  return `
    <div class="family">
      <div class="${seatClasses.join(' ')}">
        <header><strong>${seat.name}</strong></header>
        <ul>${seat.roles.map(r => `<li><span>${r}</span></li>`).join('')}</ul>
      </div>
      ${childHTML}
    </div>
  `;
}

export function renderPage(tree: ChartSeat): string {
  return `
  <html>
    <head><style>${fs.readFileSync(path.resolve('./src/assets/chart.css'))}</style></head>
    <body>
      <div class="page">
        <header><h1>Brand Name</h1></header>
        <div class="chart">${drawTree(tree, 0)}</div>
        <footer>
          <div class="service">Organization Chart, LLC</div>
          <div class="copyright">
            <div>Printed: ${(new Date()).toISOString().slice(0,10)}</div>
          </div>
        </footer>
      </div>

      <script>document.querySelector('body').classList.add('complete');</script>
    </body>
  </html>
  `;
}


export async function renderPDF(html: string, opts: puppeteer.PDFOptions): Promise<Buffer> {
  const browser = await puppeteer.launch()

  try {
    const page = await browser.newPage();

    await page.setContent(html);

    await page.waitForSelector('.complete');

    return await page.pdf(opts);
  } catch (e) {
    console.error('error rendering pdf: ', e);
    throw e;
  } finally {
    await browser.close();
  }
}
