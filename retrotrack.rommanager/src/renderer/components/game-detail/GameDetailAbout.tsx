interface Props {
  description: string;
  developer: string;
  publisher: string;
  releaseDate: string;
  genre: string;
  consoleName: string;
  players: string;
}

export default function GameDetailAbout({
  description,
  developer,
  publisher,
  releaseDate,
  genre,
  consoleName,
  players,
}: Props) {
  return (
    <>
      <div className="gd-section">
        <h3 className="gd-section-title">About This Game</h3>
        <p className="gd-description">{description}</p>
      </div>

      <div className="gd-section">
        <div className="gd-detail-strip">
          <div className="gd-detail-item">
            <span className="gd-detail-label">Developer</span>
            <span className="gd-detail-value">{developer}</span>
          </div>
          <div className="gd-detail-item">
            <span className="gd-detail-label">Publisher</span>
            <span className="gd-detail-value">{publisher}</span>
          </div>
          <div className="gd-detail-item">
            <span className="gd-detail-label">Released</span>
            <span className="gd-detail-value">{releaseDate}</span>
          </div>
          <div className="gd-detail-item">
            <span className="gd-detail-label">Genre</span>
            <span className="gd-detail-value">{genre}</span>
          </div>
          <div className="gd-detail-item">
            <span className="gd-detail-label">Console</span>
            <span className="gd-detail-value">{consoleName}</span>
          </div>
          <div className="gd-detail-item">
            <span className="gd-detail-label">Players</span>
            <span className="gd-detail-value">{players}</span>
          </div>
        </div>
      </div>
    </>
  );
}
