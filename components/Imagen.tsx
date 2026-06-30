"use client";

import Image from "next/image";
import { useState } from "react";

type Props = {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
};

// Renderiza la imagen real del slot; si aun no existe el archivo,
// muestra un placeholder con sus mismas dimensiones (ver assets/README.md).
export default function Imagen({ src, alt, width, height, className }: Props) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex items-center justify-center rounded-lg border border-dashed border-border bg-surface-2 text-center ${className ?? ""}`}
        style={{ aspectRatio: `${width} / ${height}` }}
      >
        <span className="px-4 text-sm text-muted">
          {alt}
          <span className="mt-1 block font-mono text-xs text-muted/70">
            {width}x{height}
          </span>
        </span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => setError(true)}
    />
  );
}
