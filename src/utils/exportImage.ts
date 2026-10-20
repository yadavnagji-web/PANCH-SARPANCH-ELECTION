import { toPng, toJpeg } from 'html-to-image';
import { EMBEDDED_FONTS_CSS } from './embeddedFonts.ts';

export interface ExportImageOptions {
  format?: 'png' | 'jpeg';
  filename?: string;
  quality?: number;
  pixelRatio?: number;
  backgroundColor?: string;
  downloadImmediately?: boolean;
}

/**
 * Robust image exporter that embeds all Devanagari webfonts (Khand, Noto Sans, etc.)
 * directly as base64 in the SVG foreignObject, guaranteeing 100% WYSIWYG fidelity
 * without font clipping, text wrapping distortion, or CORS SecurityError.
 */
export async function exportElementAsImage(
  element: HTMLElement,
  options: ExportImageOptions = {}
): Promise<string> {
  const {
    format = 'png',
    filename = 'wardpanch-pemphlet.png',
    quality = 0.95,
    pixelRatio = 2.5,
    backgroundColor = '#ffffff',
    downloadImmediately = true,
  } = options;

  // Intercept and swallow known benign html-to-image stylesheet warnings
  const originalConsoleError = console.error;
  const originalConsoleWarn = console.warn;

  console.error = (...args: any[]) => {
    const str = String(args[0] || '');
    if (
      str.includes('Error inlining remote css file') ||
      str.includes('Error while reading CSS rules') ||
      str.includes('SecurityError') ||
      str.includes('Cannot access rules')
    ) {
      return;
    }
    originalConsoleError.apply(console, args);
  };

  console.warn = (...args: any[]) => {
    const str = String(args[0] || '');
    if (
      str.includes('CSSStyleSheet') ||
      str.includes('cssRules') ||
      str.includes('SecurityError')
    ) {
      return;
    }
    originalConsoleWarn.apply(console, args);
  };

  try {
    const exportFn = format === 'jpeg' ? toJpeg : toPng;

    // Use EMBEDDED_FONTS_CSS with base64 font data so the SVG foreignObject has
    // native access to Khand, Noto Sans Devanagari, Rozha One, Yatra One without external requests.
    const dataUrl = await exportFn(element, {
      quality,
      pixelRatio,
      backgroundColor,
      fontEmbedCSS: EMBEDDED_FONTS_CSS,
      cacheBust: false,
    });

    if (downloadImmediately && filename) {
      const mime = format === 'jpeg' ? 'image/jpeg' : 'image/png';
      // Convert base64 dataUrl into binary Blob with explicit MIME header
      const parts = dataUrl.split(',');
      const byteString = atob(parts[1]);
      const arrayBuffer = new ArrayBuffer(byteString.length);
      const uint8Array = new Uint8Array(arrayBuffer);
      for (let i = 0; i < byteString.length; i++) {
        uint8Array[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([uint8Array], { type: mime });
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.download = filename;
      link.href = blobUrl;
      document.body.appendChild(link);
      link.click();

      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
      }, 1500);
    }

    return dataUrl;
  } catch (err) {
    originalConsoleError('Pamphlet image generation failed:', err);
    throw err;
  } finally {
    console.error = originalConsoleError;
    console.warn = originalConsoleWarn;
  }
}
