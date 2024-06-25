import { PositionVo } from '../world/common/position-vo';

export class MazeVo {
  private width: number;

  private depth: number;

  private grid: boolean[][];

  constructor(width: number, depth: number) {
    if (width < 0 || width % 2 !== 1 || depth < 0 || depth % 2 !== 1)
      throw Error(`Width ${width} or depth ${depth} is not valid`);
    this.width = width;
    this.depth = depth;
    this.grid = this.initializeGrid();
    this.generateMaze(1, 1);
  }

  static create(width: number, depth: number): MazeVo {
    return new MazeVo(width, depth);
  }

  private initializeGrid(): boolean[][] {
    const grid = [];
    for (let y = 0; y < this.depth; y += 1) {
      const row = [];
      for (let x = 0; x < this.width; x += 1) {
        row.push(true);
      }
      grid.push(row);
    }
    return grid;
  }

  private initializeVisited(): boolean[][] {
    const visited = [];
    for (let y = 0; y < this.depth; y += 1) {
      const row = [];
      for (let x = 0; x < this.width; x += 1) {
        row.push(false);
      }
      visited.push(row);
    }
    return visited;
  }

  private generateMaze(x: number, y: number): void {
    const directions = [
      { dx: 0, dy: -1 },
      { dx: 1, dy: 0 },
      { dx: 0, dy: 1 },
      { dx: -1, dy: 0 },
    ];

    const visited = this.initializeVisited();
    const stack: { x: number; y: number }[] = [];
    this.grid[y][x] = false;
    stack.push({ x, y });

    while (stack.length > 0) {
      const current = stack[stack.length - 1];
      const availableDirections = directions.filter((d) => {
        const nx = current.x + d.dx * 2;
        const ny = current.y + d.dy * 2;
        return nx >= 0 && ny >= 0 && nx < this.width && ny < this.depth && !visited[ny][nx];
      });

      if (availableDirections.length > 0) {
        const { dx, dy } = availableDirections[Math.floor(Math.random() * availableDirections.length)];
        const nx = current.x + dx;
        const ny = current.y + dy;
        const nx2 = current.x + dx * 2;
        const ny2 = current.y + dy * 2;

        this.grid[ny][nx] = false;
        this.grid[ny2][nx2] = false;
        visited[ny2][nx2] = true;

        stack.push({ x: nx2, y: ny2 });
      } else {
        stack.pop();
      }
    }
  }

  public async iterateSync(cb: (pos: PositionVo, isWall: boolean) => Promise<void>): Promise<void> {
    const queue: [number, number][] = [];
    const visited = new Set<string>();
    const directions = [
      [0, 1],
      [1, 0],
      [0, -1],
      [-1, 0],
    ];

    const isValidPosition = (x: number, z: number): boolean => {
      return x >= 0 && x < this.width && z >= 0 && z < this.depth;
    };

    queue.push([0, 0]);
    visited.add('0,0');

    while (queue.length > 0) {
      const [x, z] = queue.shift()!;
      await cb(PositionVo.create(x, z), this.grid[x][z]);

      directions.forEach(([dx, dz]) => {
        const newX = x + dx;
        const newZ = z + dz;
        const newPosition = `${newX},${newZ}`;

        if (isValidPosition(newX, newZ) && !visited.has(newPosition)) {
          queue.push([newX, newZ]);
          visited.add(newPosition);
        }
      });
    }
  }
}
