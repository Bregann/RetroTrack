import { useState } from 'react';
import type { GameScreenshot } from '../../mockData';

interface Props {
  screenshotColors: GameScreenshot[];
}

export default function GameDetailCarousel({ screenshotColors }: Props) {
  const [carouselIdx, setCarouselIdx] = useState(0);

  if (screenshotColors.length === 0) return null;

  const prev = () =>
    setCarouselIdx((i) => (i <= 0 ? screenshotColors.length - 1 : i - 1));
  const next = () =>
    setCarouselIdx((i) => (i >= screenshotColors.length - 1 ? 0 : i + 1));

  return (
    <div className="gd-section">
      <h3 className="gd-section-title">Game Images</h3>
      <div className="gd-carousel">
        <button type="button" className="gd-carousel-arrow gd-carousel-prev" onClick={prev}>
          ‹
        </button>
        <div className="gd-carousel-viewport">
          <div
            className="gd-carousel-main"
            style={{ backgroundColor: screenshotColors[carouselIdx]?.color }}
          >
            <span className="gd-carousel-main-label">
              {screenshotColors[carouselIdx]?.label}
            </span>
          </div>
        </div>
        <button type="button" className="gd-carousel-arrow gd-carousel-next" onClick={next}>
          ›
        </button>
      </div>
      <div className="gd-carousel-thumbs">
        {screenshotColors.map((ss, idx) => (
          <button
            key={ss.id}
            type="button"
            className={`gd-carousel-thumb ${idx === carouselIdx ? 'active' : ''}`}
            style={{ backgroundColor: ss.color }}
            onClick={() => setCarouselIdx(idx)}
          >
            <span className="gd-carousel-thumb-label">{ss.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
