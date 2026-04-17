import { createCanvas, registerFont, Canvas } from 'canvas';
import { join } from 'path';

export interface MemeTemplate {
  id: string;
  imagePath: string;
  textPositions: { x: number; y: number; maxWidth: number; fontSize: number }[];
}

export class MemeGenerator {
  private templates: Map<string, MemeTemplate>;

  constructor() {
    this.templates = new Map();
    this.initializeTemplates();
  }

  private initializeTemplates(): void {
    this.templates.set('fiscal-cliff', {
      id: 'fiscal-cliff',
      imagePath: join(__dirname, '../../assets/templates/fiscal-cliff.jpg'),
      textPositions: [
        { x: 50, y: 50, maxWidth: 400, fontSize: 30 },
        { x: 50, y: 400, maxWidth: 400, fontSize: 30 }
      ]
    });
  }

  /**
   * Generates a meme based on fiscal follies or digital dissent themes.
   * @param templateId The ID of the meme template to use.
   * @param captions Array of strings to overlay on the image.
   * @returns A Promise resolving to a Buffer containing the image data.
   */
  public async generateMeme(templateId: string, captions: string[]): Promise<Buffer> {
    const template = this.templates.get(templateId);
    if (!template) {
      throw new Error(`Template ${templateId} not found.`);
    }

    const canvas = createCanvas(500, 500);
    const ctx = canvas.getContext('2d');

    // In a real implementation, we would load the image from template.imagePath here
    // For this implementation, we simulate the drawing process
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 500, 500);
    ctx.fillStyle = '#000000';

    captions.forEach((text, index) => {
      const pos = template.textPositions[index];
      if (pos) {
        ctx.font = `${pos.fontSize}px Impact`;
        ctx.fillText(text, pos.x, pos.y, pos.maxWidth);
      }
    });

    return canvas.toBuffer('image/jpeg');
  }

  /**
   * Returns a list of available meme templates.
   */
  public getAvailableTemplates(): string[] {
    return Array.from(this.templates.keys());
  }
}