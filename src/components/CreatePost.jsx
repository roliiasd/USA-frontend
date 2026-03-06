import { useEffect, useMemo, useState } from "react";
import Select from "react-select";
import { createPost } from "../animals";
import { ToastContainer, toast } from "react-toastify";
import { getCounties, getCitiesByCounties } from "../getCC";
export default function CreatePost({onSuccess}) {
  const [file, setFile] = useState(null);
  const [nev, setNev] = useState("");
  const [megye, setMegye] = useState([]);
  const [selectedMegye, setSelectedMegye] = useState(null);
  const [varos, setVaros] = useState([]);
  const [selectedVaros, setSelectedVaros] = useState(null);
  const [megjegyzes, setMegjegyzes] = useState("");
  const [postcode, setPostcode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [varosLoading, setVarosLoading] = useState(false);

  useEffect(() => {
    async function loadCounties() {
      try {
        const countiesData = await getCounties();
        // console.log("countiesData:", countiesData);
        if (countiesData.error) {
          return toast.error(countiesData.error);
        }

        const formattedCounties = countiesData.result.map((c) => ({
          label: c.county,
          value: c.id,
        }));
        setMegye(formattedCounties);
      } catch (err) {
        console.error(err);
        toast.error("Hiba töltént a bukkitszerverror valo lekerdezesnel");
      }
    }
    loadCounties();
  }, []);

  useEffect(() => {
    async function loadCities() {
      if (!selectedMegye) {
        setVaros([]);
        return;
      }
      setVarosLoading(true);
      try {
        const citiesData = await getCitiesByCounties(selectedMegye.value);
        // console.log(`citiesdata: ${citiesData}`);

        if (citiesData.error) {
          return toast.error(citiesData.error);
        }

        const formattedCities = citiesData.result.map((c) => ({
          label: c.city,
          value: c.city,
        }));
        setVaros(formattedCities);
      } catch (err) {
        console.error(err);
        toast.error("Hiba volt a lekerdezesben bratyeszgatyesz");
      } finally {
        setVarosLoading(false);
      }
    }
    loadCities();
  }, [selectedMegye]);

  const previewUrl = useMemo(() => {
    if (!file) return null;
    return URL.createObjectURL(file);
  }, [file]);

  async function submitHandler(e) {
    e.preventDefault();

    if (!nev.trim()) return toast.info("Add meg az állat nevét!");
    if (!file) return toast.info("Válassz képet!");
    if (!selectedMegye) return toast.info("Válassz megyét!");
    if (!selectedMegye) return toast.info("Válassz várost!");
    if (!postcode.trim()) return toast.info("Addj meg egy irányítószámot!");
    setIsLoading(true);
    try {
      const { result, error } = await createPost({
        nev: nev,
        varos: selectedVaros.value,
        megjegyzes: megjegyzes,
        postcode: postcode,
        megye: selectedMegye.label,
        file: file,
      });

      if (error) {
        return toast.error(error);
      }
      toast.success(result.message);
      setNev("");
      setFile(null);
      setSelectedMegye(null);
      setSelectedVaros(null);
      setPostcode("");
      setMegjegyzes("");

      if(onSuccess) onSuccess()
      const modalElement = document.getElementById("createPostModal");
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) modal.hide();
    } catch (err) {
      console.error(err);
      toast.error("Hiba történt a városok lekérdezésénél");
    } finally {
      setVarosLoading(false);
    }
  }

  return (
    <>
      <ToastContainer theme="dark" position="top-center" autoClose={2500} />
      <div
        className="modal"
        id="createPostModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title text-center w-100">
                Új dög felrakása
              </h1>
              <button
                type="button"
                className="btn btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={submitHandler}>
                <div className="row justify-content-center g-3">
                  {/* Állat neve */}
                  <div className="col-12 col-md-8">
                    <label className="form-label">
                      Kisállat neve
                    </label>
                    <input
                      value={nev}
                      onChange={(e) => setNev(e.target.value)}
                      type="text"
                      className="form-control"
                      placeholder={"pl. szigmuszmaximus"}
                    />
                    <label className="form-label">Megye</label>
                    <Select
                      classNamePrefix="custom-select"
                      options={megye}
                      value={selectedMegye}
                      onChange={(selected) => {
                        setSelectedMegye(selected);
                        setSelectedVaros(null);
                      }}
                      placeholder="Válassz megyét..."
                      isSearchable={true}
                      isClearable={true}
                    />
                    {/* ------- */}
                    {/* ------- */}
                    {/* ------- */}
                    {/* ------- */}
                    <label className="form-label">Város</label>
                    <Select
                      classNamePrefix="custom-select"
                      options={varos}
                      value={selectedVaros}
                      onChange={(selected) => {
                        setSelectedVaros(selected);
                        if (selected?.postcode) {
                          setPostcode(selected.postcode);
                        }
                      }}
                      isDisabled={!selectedMegye}
                      isLoading={varosLoading}
                      placeholder={
                        !selectedMegye
                          ? "Előbb válassz megyét..."
                          : varosLoading
                            ? "Városok betöltése..."
                            : "Válassz várost..."
                      }
                      isSearchable={true}
                      isClearable={true}
                    />
                    {/* -------------- */}
                    {/* -------------- */}
                    {/* -------------- */}
                    {/* -------------- */}
                    <label className="form-label mt-3">Irányítószám</label>
                    <input
                      value={postcode}
                      onChange={(e) => setPostcode(e.target.value)}
                      type="text"
                      className="form-control"
                      placeholder="pl. 1234"
                    />
                    <div className="mt-3">
                      <label className="form-label">Kisállat képe</label>
                      <input
                        type="file"
                        accept="image/*"
                        className="form-control"
                        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                      />
                      <div className="mt-3">
                        {previewUrl ? (
                          <img
                            src={previewUrl}
                            alt="Előnézet"
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
                      <label className="form-label">
                        Megjegyzés hozzáadása:
                      </label>
                      <textarea
                        value={megjegyzes}
                        onChange={(e) => setMegjegyzes(e.target.value)}
                        className="form-control"
                        rows={4}
                      ></textarea>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="justify-content-start gap-2 m-4">
                      <button
                        type="button"
                        className="btn btn-outline-danger"
                        data-bs-dismiss="modal"
                        disabled={isLoading}
                      >
                        Elvetés
                      </button>
                      <button
                        type="submit"
                        className="btn btn-outline-success mx-lg-5"
                        data-bs-dismiss="modal"
                        disabled={isLoading}
                      >
                        {isLoading ? "Feltöltés..." : "Feltöltés"}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
