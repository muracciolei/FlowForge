export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, value));
};

export const distance = (x1: number, y1: number, x2: number, y2: number): number => {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
};

export const isPointInBox = (
  px: number,
  py: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number
): boolean => {
  const minX = Math.min(x1, x2);
  const maxX = Math.max(x1, x2);
  const minY = Math.min(y1, y2);
  const maxY = Math.max(y1, y2);
  return px >= minX && px <= maxX && py >= minY && py <= maxY;
};

export const isBoundingBoxesIntersecting = (
  x1: number,
  y1: number,
  w1: number,
  h1: number,
  x2: number,
  y2: number,
  w2: number,
  h2: number
): boolean => {
  return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2;
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  let previous = 0;

  return function executedFunction(...args: Parameters<T>) {
    const now = Date.now();
    const remaining = wait - (now - previous);

    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      func(...args);
    } else if (!timeout) {
      timeout = setTimeout(() => {
        previous = Date.now();
        timeout = null;
        func(...args);
      }, remaining);
    }
  };
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  } else if (date.getFullYear() === today.getFullYear()) {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } else {
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }
};

export const exportToJson = (data: any, filename: string): void => {
  const jsonString = JSON.stringify(data, null, 2);
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(jsonString));
  element.setAttribute('download', `${filename}.json`);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

export const exportToPng = async (canvas: HTMLCanvasElement, filename: string): Promise<void> => {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const element = document.createElement('a');
        element.setAttribute('href', url);
        element.setAttribute('download', `${filename}.png`);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        URL.revokeObjectURL(url);
      }
      resolve();
    });
  });
};

export const downloadFile = (content: string, filename: string, mimeType = 'text/plain'): void => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportGraphToSvg = (
  nodes: { id: string; position: { x: number; y: number }; size: { width: number; height: number }; data: any }[],
  connections: { id: string; sourceNodeId: string; targetNodeId: string }[],
  options?: { pdfReady?: boolean }
): string => {
  const padding = 40;
  const allX = nodes.flatMap((node) => [node.position.x, node.position.x + node.size.width]);
  const allY = nodes.flatMap((node) => [node.position.y, node.position.y + node.size.height]);
  const minX = Math.min(...allX, 0) - padding;
  const minY = Math.min(...allY, 0) - padding;
  const maxX = Math.max(...allX, 800) + padding;
  const maxY = Math.max(...allY, 600) + padding;
  const width = maxX - minX;
  const height = maxY - minY;
  const bg = options?.pdfReady ? '#0f172a' : '#020617';

  const getCenter = (nodeId: string) => {
    const node = nodes.find((item) => item.id === nodeId);
    if (!node) return { x: 0, y: 0 };
    return {
      x: node.position.x + node.size.width / 2 - minX,
      y: node.position.y + node.size.height / 2 - minY,
    };
  };

  const connectionPaths = connections
    .map((connection) => {
      const source = getCenter(connection.sourceNodeId);
      const target = getCenter(connection.targetNodeId);
      const dx = target.x - source.x;
      const dy = target.y - source.y;
      const curve = Math.max(Math.abs(dx), Math.abs(dy)) * 0.3;
      return `<path d="M ${source.x} ${source.y} C ${source.x + curve} ${source.y}, ${target.x - curve} ${target.y}, ${target.x} ${target.y}" fill="none" stroke="#00d9ff" stroke-width="2" stroke-linecap="round" opacity="0.8" />`;
    })
    .join('');

  const nodeElements = nodes
    .map((node) => {
      const x = node.position.x - minX;
      const y = node.position.y - minY;
      const label = String(node.data?.label || node.id).replace(/&/g, '&amp;').replace(/</g, '&lt;');
      return `<g>
        <rect x="${x}" y="${y}" width="${node.size.width}" height="${node.size.height}" rx="18" fill="#17233a" stroke="#00d9ff" stroke-width="1.5" opacity="0.95" />
        <text x="${x + 16}" y="${y + 28}" fill="#e2e8f0" font-family="Inter, sans-serif" font-size="14" font-weight="700">${label}</text>
      </g>`;
    })
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" role="img">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#00d9ff" />
      <stop offset="100%" stop-color="#b537f2" />
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="${bg}" />
  <g opacity="0.12">
    <rect width="100%" height="100%" fill="url(#g)" />
  </g>
  ${connectionPaths}
  ${nodeElements}
</svg>`;
};

export const exportSvgAsPng = async (
  nodes: { id: string; position: { x: number; y: number }; size: { width: number; height: number }; data: any }[],
  connections: { id: string; sourceNodeId: string; targetNodeId: string }[],
  filename: string
): Promise<void> => {
  const svg = exportGraphToSvg(nodes, connections);
  const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const image = new Image();
  image.crossOrigin = 'anonymous';
  return new Promise((resolve, reject) => {
    image.onload = async () => {
      const canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas not supported'));
        return;
      }
      ctx.drawImage(image, 0, 0);
      canvas.toBlob((pngBlob) => {
        if (pngBlob) {
          const pngUrl = URL.createObjectURL(pngBlob);
          const link = document.createElement('a');
          link.href = pngUrl;
          link.download = `${filename}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(pngUrl);
        }
        URL.revokeObjectURL(url);
        resolve();
      });
    };
    image.onerror = reject;
    image.src = url;
  });
};

export const animateValue = (
  start: number,
  end: number,
  duration: number,
  callback: (value: number) => void
): (() => void) => {
  const startTime = Date.now();
  let animationId: number;

  const animate = () => {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const value = start + (end - start) * progress;
    callback(value);

    if (progress < 1) {
      animationId = requestAnimationFrame(animate);
    }
  };

  animationId = requestAnimationFrame(animate);

  return () => cancelAnimationFrame(animationId);
};

export const getMousePos = (
  event: React.MouseEvent<HTMLElement>,
  element: HTMLElement,
  pan: { x: number; y: number },
  zoom: number
): { x: number; y: number } => {
  const rect = element.getBoundingClientRect();
  const clientX = event.clientX - rect.left;
  const clientY = event.clientY - rect.top;
  
  return {
    x: (clientX - pan.x) / zoom,
    y: (clientY - pan.y) / zoom
  };
};
