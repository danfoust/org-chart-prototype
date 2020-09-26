import faker from 'faker';
import fs from 'fs';
import path from 'path';

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
  if (depth > 2) return;

  const childCount = (depth + 1);
  for (let i = 0; i < childCount; i++) {
    seat.children.push(createSeat());
  }

  seat.children.map(s => createTree(s, depth + 1));
}

export function getTree(): ChartSeat {
  let tree: ChartSeat | null = null;
  
  tree = JSON.parse(fs.readFileSync(path.resolve('./src/cached-tree.json')).toString());

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
        <header>${seat.name}</header>
        <ul>${seat.roles.map(r => r).join(' ')}</ul>
      </div>
      ${childHTML}
    </div>
  `;
}
