export function Eventos() {
  return (
    <div className="container mt-5 mb-5">
      <h1 className="text-center mb-4">Nuestros eventos</h1>
      <hr />
      <h2 className="text-center">
        A lo largo de nuestro camino hemos sido parte de{" "}
        <strong>desfiles, ferias y encuentros alternativos</strong> donde
        compartimos nuestra esencia gótica.
      </h2>

      <div className="row mt-4">
        <div className="col-md-6 mb-4">
          <div className="card">
            <img src="/img/Evento1.png" className="card-img-top" alt="Evento gótico"/>
            <div className="card-body">
              <h2 className="card-title"><strong>Mysticum teatempore</strong></h2>
              <h3 className="card-text">Participación en la primera edición de Mysticum teatempore</h3>
              <button type="button" className="btn button1" data-bs-toggle="modal" data-bs-target="#modalEvento1">Ver más</button>
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card">
            <img src="/img/Evento2.png" className="card-img-top" alt="Concierto Metal"/>
            <div className="card-body">
              <h2 className="card-title"><strong>Feria Addams</strong></h2>
              <h3 className="card-text">Evento feria Addams por Goth Session SMedia</h3>
              <button type="button" className="btn button1" data-bs-toggle="modal" data-bs-target="#modalEvento2">Ver más</button>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade" id="modalEvento1" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title"><strong>Primera edición de Mysticum teatempore</strong></h2>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <img src="/img/Desfile1.png" className="img-fluid mb-3" alt="Evento gótico"/>
              <h3><strong>Fecha evento:</strong> 01/agosto/2023</h3>
              <hr />
              <h3>
                El Armario de Sombras tuvo el honor de participar en la primera
                edición de Mysticum Teatempore, un exclusivo desfile de moda
                donde las marcas más innovadoras presentaron sus colecciones.
              </h3>
              <h3>
                Durante el evento, los asistentes pudieron descubrir y adquirir
                prendas únicas, disfrutando de un ambiente creativo y lleno de
                estilo. Fue una experiencia inolvidable que mostró lo mejor del
                diseño contemporáneo y la moda emergente.
              </h3>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn button1" data-bs-dismiss="modal">Cerrar </button>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" id="modalEvento2" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">
                <strong>La Feria Addams</strong>
              </h2>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <img src="/img/Desfile2.png"  className="img-fluid mb-3" alt="Concierto Metal"/>
              <h3><strong>Fecha evento:</strong> 03/septiembre/2025</h3>
              <hr />
              <h3>
                La Feria Addams, organizada por Goth Session SMedia, fue toda
                una experiencia. Durante el evento, los asistentes pudieron
                explorar y adquirir prendas exclusivas de diferentes marcas,
                disfrutando de un ambiente lleno de estilo, creatividad y
                originalidad.
              </h3>
              <h3>
                Fue una oportunidad única para conocer las tendencias más
                innovadoras y sumergirse en la moda alternativa.
              </h3>
            </div>
            <div className="modal-footer">
              <button  type="button"  className="btn button1" data-bs-dismiss="modal">Cerrar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}