
export function HomeSection() {
  return (
    <>
      <div className="container">
        <div id="demo" className="carousel slide mt-5" data-bs-ride="carousel">
          <div className="carousel-indicators">
            <button type="button" data-bs-target="#demo" data-bs-slide-to="0" className="active"></button>
            <button type="button" data-bs-target="#demo" data-bs-slide-to="1"></button>
          </div>

          <div className="carousel-inner">
            <div className="carousel-item active">
              <img src="/img/fotoCarusel.1.png" alt="Slide 1" className="d-block w-100" />
            </div>
            <div className="carousel-item">
              <img src="/img/fotoCarusel.2.png" alt="Slide 2" className="d-block w-100" />
            </div>
          </div>

          <button className="carousel-control-prev" type="button" data-bs-target="#demo" data-bs-slide="prev">
            <span className="carousel-control-prev-icon"></span>
          </button>

          <button className="carousel-control-next" type="button" data-bs-target="#demo" data-bs-slide="next">
            <span className="carousel-control-next-icon"></span>
          </button>
        </div>
      </div>
    </>
  );
}