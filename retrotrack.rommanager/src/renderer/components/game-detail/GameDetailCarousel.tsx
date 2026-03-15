import { useState } from 'react';

interface CarouselImage {
  id: number;
  label: string;
  url: string;
}

interface Props {
  images: CarouselImage[];
}

export default function GameDetailCarousel({ images }: Props) {
  const [carouselIdx, setCarouselIdx] = useState(0);

  if (images.length === 0) return null;

  const prev = () =>
    setCarouselIdx((i) => (i <= 0 ? images.length - 1 : i - 1));
  const next = () =>
    setCarouselIdx((i) => (i >= images.length - 1 ? 0 : i + 1));

  return (
    <div className="gd-section">
      <h3 className="gd-section-title">Game Images</h3>
      <div className="gd-carousel">
        <button type="button" className="gd-carousel-arrow gd-carousel-prev" onClick={prev}>
          ‹
        </button>
        <div className="gd-carousel-viewport">
          <div className="gd-carousel-main">
            <img
              key={images[carouselIdx]?.url}
              src={images[carouselIdx]?.url}
              alt={images[carouselIdx]?.label}
              className="gd-carousel-img"
            />
          </div>
        </div>
        <button type="button" className="gd-carousel-arrow gd-carousel-next" onClick={next}>
          ›
        </button>
      </div>
      <div className="gd-carousel-thumbs">
        {images.map((img, idx) => (
          <button
            key={img.id}
            type="button"
            className={`gd-carousel-thumb ${idx === carouselIdx ? 'active' : ''}`}
            onClick={() => setCarouselIdx(idx)}
          >
            <img src={img.url} alt={img.label} className="gd-carousel-thumb-img" />
            <span className="gd-carousel-thumb-label">{img.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
