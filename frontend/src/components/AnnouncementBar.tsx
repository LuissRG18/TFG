const AnnouncementBar = () => {
  return (
    <div className="announcement-bar">
      <div className="announcement-bar-inner">
        <span className="announcement-bar-status">
          <span className="announcement-dot" />
          Sincronizado con <strong>arXiv</strong>, <strong>CrossRef</strong> y <strong>OpenAlex</strong>
          &nbsp;·&nbsp;última actualización hace 11 min
        </span>
      </div>
    </div>
  );
};

export default AnnouncementBar;
