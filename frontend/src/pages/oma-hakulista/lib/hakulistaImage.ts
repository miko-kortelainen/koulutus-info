import { localizedText } from "@/lib/localizedText";
import type { ToteutusEntry } from "@/types.gen";

export const HAKULISTA_SHARE_FILENAME = "oma-hakulista.jpg";

const BACKGROUND_SRC = "/images/share_bg.webp";
const FONT = '"Google Sans Flex", sans-serif';
const WIDTH = 1080;
const HEIGHT = 1920;
const SCALE = 2;
const OUTER = 72;
const TITLE_SIZE = 48;
const PROGRAM_SIZE = 36;
const SCHOOL_SIZE = 28;
const PROGRAM_LINE = 46;
const SCHOOL_LINE = 34;
const AFTER_PROGRAM = 20;
const NUMBER_WIDTH = 64;
const LOGO_SAFE = 220;
const SHARE_SLOTS = 6;
const TITLE_GAP = 64;
const ITEM_GAP = 72;
const MAX_GAP = 220;
const JPEG_QUALITY = 0.92;

const COLOR = {
  title: "oklch(0.99 0.01 126)",
  program: "oklch(0.99 0.01 126)",
  school: "oklch(0.97 0.02 126 / 0.88)",
  number: "oklch(0.99 0.01 126)",
  fallbackBg: "oklch(0.65 0.156 126)",
} as const;

export interface HakulistaShareItem {
  program: string;
  school: string;
}

export function hakulistaShareItems(entries: ToteutusEntry[]): HakulistaShareItem[] {
  return entries.slice(0, SHARE_SLOTS).map((entry) => ({
    program: localizedText(entry.toteutusNimi),
    school: localizedText(entry.oppilaitosNimi),
  }));
}

export function hakulistaShareItemTops(itemHeights: number[], listTop: number, listBottom: number): number[] {
  if (itemHeights.length === 0) return [];

  const available = listBottom - listTop;
  const totalHeight = itemHeights.reduce((sum, height) => sum + height, 0);
  if (itemHeights.length === 1) {
    return [listTop + Math.max(0, (available - totalHeight) / 2)];
  }

  const gap = Math.min(MAX_GAP, Math.max(ITEM_GAP, (available - totalHeight) / (itemHeights.length - 1)));
  const used = totalHeight + gap * (itemHeights.length - 1);
  let y = listTop + Math.max(0, (available - used) / 2);
  return itemHeights.map((height) => {
    const top = y;
    y += height + gap;
    return top;
  });
}

export function wrapCanvasText(text: string, maxWidth: number, measure: (value: string) => number): string[] {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];

  const lines: string[] = [];
  let current = words[0];
  for (const word of words.slice(1)) {
    const next = `${current} ${word}`;
    if (measure(next) <= maxWidth) {
      current = next;
      continue;
    }
    lines.push(current);
    current = word;
  }
  lines.push(current);
  return lines;
}

export async function createHakulistaImageFile(entries: ToteutusEntry[]): Promise<File> {
  const blob = await renderHakulistaImage(hakulistaShareItems(entries));
  const buffer = await blob.arrayBuffer();
  return new File([buffer], HAKULISTA_SHARE_FILENAME, {
    lastModified: Date.now(),
    type: blob.type || "image/jpeg",
  });
}

async function renderHakulistaImage(items: HakulistaShareItem[]): Promise<Blob> {
  const photo = await loadBackground();
  await loadFonts();

  const canvas = document.createElement("canvas");
  canvas.width = WIDTH * SCALE;
  canvas.height = HEIGHT * SCALE;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Jakokuvaa ei voitu luoda.");

  ctx.setTransform(SCALE, 0, 0, SCALE, 0, 0);
  drawBackground(ctx, photo);
  ctx.shadowColor = "oklch(0.28 0.08 126 / 0.35)";
  ctx.shadowBlur = 8;
  ctx.textBaseline = "top";

  const textWidth = WIDTH - OUTER * 2 - NUMBER_WIDTH;
  const listTop = OUTER + TITLE_SIZE + TITLE_GAP;
  const listBottom = HEIGHT - LOGO_SAFE;
  const itemHeights = items.map((item) => measureItem(ctx, item, textWidth));
  const itemTops = hakulistaShareItemTops(itemHeights, listTop, listBottom);

  ctx.fillStyle = COLOR.title;
  ctx.font = `700 ${TITLE_SIZE}px ${FONT}`;
  ctx.fillText("Oma hakulista", OUTER, OUTER);

  for (const [index, item] of items.entries()) {
    drawItem(ctx, item, index + 1, itemTops[index], textWidth);
  }

  return canvasToJpeg(canvas);
}

function measureItem(ctx: CanvasRenderingContext2D, item: HakulistaShareItem, textWidth: number): number {
  ctx.font = `700 ${PROGRAM_SIZE}px ${FONT}`;
  const programLines = wrapCanvasText(item.program, textWidth, (value) => ctx.measureText(value).width);
  ctx.font = `400 ${SCHOOL_SIZE}px ${FONT}`;
  const schoolLines = wrapCanvasText(item.school, textWidth, (value) => ctx.measureText(value).width);
  return programLines.length * PROGRAM_LINE + AFTER_PROGRAM + schoolLines.length * SCHOOL_LINE;
}

function drawItem(
  ctx: CanvasRenderingContext2D,
  item: HakulistaShareItem,
  index: number,
  y: number,
  textWidth: number,
) {
  ctx.fillStyle = COLOR.number;
  ctx.font = `700 ${PROGRAM_SIZE}px ${FONT}`;
  ctx.fillText(`${index}.`, OUTER, y);

  const textX = OUTER + NUMBER_WIDTH;
  ctx.fillStyle = COLOR.program;
  ctx.font = `700 ${PROGRAM_SIZE}px ${FONT}`;
  let cursor = y;
  for (const line of wrapCanvasText(item.program, textWidth, (value) => ctx.measureText(value).width)) {
    ctx.fillText(line, textX, cursor);
    cursor += PROGRAM_LINE;
  }

  cursor += AFTER_PROGRAM;
  ctx.fillStyle = COLOR.school;
  ctx.font = `400 ${SCHOOL_SIZE}px ${FONT}`;
  for (const line of wrapCanvasText(item.school, textWidth, (value) => ctx.measureText(value).width)) {
    ctx.fillText(line, textX, cursor);
    cursor += SCHOOL_LINE;
  }
}

function drawBackground(ctx: CanvasRenderingContext2D, photo: HTMLImageElement | null) {
  ctx.fillStyle = COLOR.fallbackBg;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  if (photo) ctx.drawImage(photo, 0, 0, WIDTH, HEIGHT);
}

function loadBackground(): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => resolve(null);
    image.src = BACKGROUND_SRC;
  });
}

async function loadFonts() {
  if (!document.fonts) return;
  try {
    await Promise.all([
      document.fonts.load(`700 ${TITLE_SIZE}px ${FONT}`),
      document.fonts.load(`700 ${PROGRAM_SIZE}px ${FONT}`),
      document.fonts.load(`400 ${SCHOOL_SIZE}px ${FONT}`),
    ]);
  } catch {
    // System sans-serif is an acceptable fallback if the site font is still swapping.
  }
}

function canvasToJpeg(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Jakokuvaa ei voitu luoda."));
      },
      "image/jpeg",
      JPEG_QUALITY,
    );
  });
}
