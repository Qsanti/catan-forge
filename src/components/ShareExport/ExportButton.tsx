import type { RefObject } from 'react';
import { useState } from 'react';
import { useI18n } from '../../i18n/useI18n';
import styles from '../Controls/Controls.module.css';

type Props = {
  svgRef: RefObject<SVGSVGElement | null>;
};

function resolveCSS(svgEl: SVGSVGElement, svgString: string): string {
  const computed = getComputedStyle(svgEl);
  const replacements: Record<string, string> = {};

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
  const [error, setError] = useState<string | null>(null);

  const handleExport = () => {
    const svg = svgRef.current;
    if (!svg) return;

    // Clear any previous errors
    setError(null);

    // Add viewBox null check
    const viewBox = svg.viewBox.baseVal;
    if (!viewBox) {
      setError('SVG viewBox not found');
      console.error('SVG viewBox not found');
      return;
    }

    const vbWidth = viewBox.width;
    const vbHeight = viewBox.height;
    const scale = 2;

    const serializer = new XMLSerializer();
    let svgString = serializer.serializeToString(svg);

    svgString = resolveCSS(svg, svgString);

    // Ensure explicit width/height on SVG element
    svgString = svgString.replace(
      /^(<svg[^>]*?)(\swidth="[^"]*")?(\sheight="[^"]*")?/,
      `$1 width="${vbWidth}" height="${vbHeight}"`
    );

    // Use a Blob URL to avoid encoding issues with deprecated unescape()/btoa()
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);

    const img = new Image();

    img.onerror = () => {
      URL.revokeObjectURL(svgUrl);
      const errorMsg = 'Failed to load SVG image for export';
      setError(errorMsg);
      console.error(errorMsg);
    };

    img.onload = () => {
      URL.revokeObjectURL(svgUrl);
      try {
        const canvas = document.createElement('canvas');
        canvas.width = vbWidth * scale;
        canvas.height = vbHeight * scale;

        // Add canvas context null check
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          const errorMsg = 'Failed to get canvas 2D context';
          setError(errorMsg);
          console.error(errorMsg);
          return;
        }

        ctx.scale(scale, scale);
        ctx.drawImage(img, 0, 0, vbWidth, vbHeight);

        canvas.toBlob(blob => {
          if (!blob) {
            const errorMsg = 'Failed to create PNG blob';
            setError(errorMsg);
            console.error(errorMsg);
            return;
          }

          // Try Web Share API first (better mobile support)
          if (navigator.share && navigator.canShare) {
            const file = new File([blob], 'catan-map.png', { type: 'image/png' });
            if (navigator.canShare({ files: [file] })) {
              navigator.share({ files: [file] }).catch(err => {
                // Share failed or cancelled, fallback to download
                console.warn('Share failed, using download fallback', err);
                downloadBlob(blob);
              });
              return;
            }
          }

          // Fallback: download via anchor
          downloadBlob(blob);
        }, 'image/png');
      } catch (err) {
        const errorMsg = `Error during canvas export: ${err instanceof Error ? err.message : String(err)}`;
        setError(errorMsg);
        console.error(errorMsg, err);
      }
    };

    img.src = svgUrl;
  };

  function downloadBlob(blob: Blob) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'catan-map.png';
    link.href = url;

    // Mobile-friendly: add to DOM and trigger
    link.style.display = 'none';
    document.body.appendChild(link);

    // iOS Safari needs a slight delay
    setTimeout(() => {
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);
    }, 100);
  }

  return (
    <>
      <button onClick={handleExport} className={styles.button}>
        {t('exportPng')}
      </button>
      {error && (
        <div style={{ color: 'red', fontSize: '0.85rem', marginTop: '0.25rem' }}>
          {error}
        </div>
      )}
    </>
  );
}
