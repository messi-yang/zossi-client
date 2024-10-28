/**
 * Color representation with Red, Green, and Blue attributes, where values range from 0 to 255.
 */
export class ColorVo {
  constructor(private r: number, private g: number, private b: number) {
    this.r = this.clamp(Math.round(r), 0, 255);
    this.g = this.clamp(Math.round(g), 0, 255);
    this.b = this.clamp(Math.round(b), 0, 255);
  }

  static create = (r: number, g: number, b: number): ColorVo => new ColorVo(r, g, b);

  static createRandom = (): ColorVo =>
    new ColorVo(Math.round(Math.random() * 255), Math.round(Math.random() * 255), Math.round(Math.random() * 255));

  static parse(hex: string): ColorVo {
    const hexPattern = /^#?([0-9A-Fa-f]{6})$/;
    const match = hex.match(hexPattern);
    if (!match) throw new Error('Invalid hex color format.');

    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    return new ColorVo(r, g, b);
  }

  public getR(): number {
    return this.r;
  }

  public getG(): number {
    return this.g;
  }

  public getB(): number {
    return this.b;
  }

  public toHex(): string {
    const rHex = this.r.toString(16).padStart(2, '0');
    const gHex = this.g.toString(16).padStart(2, '0');
    const bHex = this.b.toString(16).padStart(2, '0');
    return `#${rHex}${gHex}${bHex}`;
  }

  public toRgb(): string {
    const rHex = this.r.toString().padStart(2, '0');
    const gHex = this.g.toString().padStart(2, '0');
    const bHex = this.b.toString().padStart(2, '0');
    return `rgb(${rHex}, ${gHex}, ${bHex})`;
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }
}
