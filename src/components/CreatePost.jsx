import { useMemo, useState } from "react";
import Select from "react-select";
import Btn from './Btn'
export default function CreatePost() {
  const [file, setFile] = useState(null);
  const [nev, setNev] = useState("");
  const [kep, setKep] = useState("");
  const [megye, setMegye] = useState(null); 
  const [varos, setVaros] = useState(null); 
  const [megjegyzes, setMegjegyzes] = useState("");





  const previewUrl = useMemo(() => {
    if (!file) return null;
    return URL.createObjectURL(file);
  }, [file]);
  return (
    <div
      className="modal"
      id="createPostModal"
      tabIndex="-1"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content bg-dark text-light">
          <div className="modal-header">
            <h1 className="modal-title text-center w-100">Új dög felrakása</h1>
            <button
              type="button"
              className="btn btn-close text-light"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <form>
              <div className="row justify-content-center g-3">
                {/* Állat neve */}
                <div className="col-12 col-md-8">
                  <label className="form-label  text-light">Kisállat neve</label>
                  <input
                    value={nev}
                    type="text"
                    className="form-control  border-secondary placeholder-glow  text-light"
                    placeholder={"pl. szigmuszmaximus"}
                  />
                  <label className="form-label">Megye</label>
                  <Select
                    options={megye}
                    value={megye}
                    onChange={(opt) => {
                      setMegye(opt);
                      setVaros(null);
                    }}
                    styles={{color:'black'}}
                    placeholder="Válassz megyét..."
                  />
                  <label className="form-label">Város</label>
                  <Select
                    options={varos}
                    value={varos}
                    onChange={setVaros}
                    isDisabled={!megye}
                    placeholder={
                      megye ? "Válassz várost..." : "Előbb válassz megyét"
                    }
                    isSearchable={true}
                  />

                  <div className="mt-3">
                    <label className="form-label">Kisállat képe</label>
                    <input
                      value={kep}
                      type="file"
                      accept="image/*"
                      className="form-control bg-black text-light border-secondary"
                      onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                    />
                    <div className="mt-3">
                      {previewUrl ? (
                        <img
                          src={previewUrl}
                          alt="Előnézet"
                          style={{
                            width: "100%",
                            height: "50%",
                            borderRadius: 12,
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <>
                          <div className="text-secondary">
                            Nincs kiválasztott kép.
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="mt-3">
                    <label className="form-label">Megjegyzés hozzáadása</label>
                    <textarea
                      value={megjegyzes}
                      className="form-control bg-black text-light border-secondary"
                      rows={4}
                    ></textarea>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="justify-content-start gap-2 m-4">
                    <button
                      className="btn btn-outline-danger text-light "
                      data-bs-dismiss="modal"
                    >
                      Elvetés
                    </button>
                    <Btn btnClass={'btn btn-outline-warning text-light mx-lg-5'} btnContent={'Fetöltés'}/>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
