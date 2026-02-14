import type { RefObject } from 'react';
import { useI18n } from '../../i18n/useI18n';
import styles from '../Controls/Controls.module.css';

type Props = {
  svgRef: RefObject<SVGSVGElement | null>;
};

function resolveCSS(svgEl: SVGSVGElement, svgString: string): string {
  const computed = getComputedStyle(svgEl);
  const replacements: Record<string, string> = {};

  // Find all var(--...) references in the SVG string
  const varRegex = /var\(--([^)]+)\)/g;
  let match;
  while ((match = varRegex.exec(svgString)) !== null) {
    const varName = `--${match[1]}`;
    if (!replacements[match[0]]) {
      replacements[match[0]] = computed.getPropertyValue(varName).trim() || match[0];
    }
  }

  let resolved = svgString;
  for (const [token, value] of Object.entries(replacements)) {
    resolved = resolved.replaceAll(token, value);
  }
  return resolved;
}

export function ExportButton({ svgRef }: Props) {
  const { t } = useI18n();

  const handleExport = () => {
    const svg = svgRef.current;
    if (!svg) return;

    const viewBox = svg.viewBox.baseVal;
    const vbWidth = viewBox.width;
    const vbHeight = viewBox.height;
    const scale = 2;

    const serializer = new XMLSerializer();
    let svgString = serializer.serializeToString(svg);

    // Resolve CSS custom properties so they work outside the DOM
    svgString = resolveCSS(svg, svgString);

    // Ensure the SVG has explicit width/height matching the viewBox
    svgString = svgString.replace(
      /^(<svg[^>]*?)(\swidth="[^"]*")?(\sheight="[^"]*")?/,
      `$1 width="${vbWidth}" height="${vbHeight}"`
    );

    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = vbWidth * scale;
      canvas.height = vbHeight * scale;
      const ctx = canvas.getContext('2d')!;
      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0, vbWidth, vbHeight);
      URL.revokeObjectURL(url);

      const link = document.createElement('a');
      link.download = 'catan-map.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    img.src = url;
  };

  return (
    <button onClick={handleExport} className={styles.button}>
      {t('exportPng')}
    </button>
  );
}
