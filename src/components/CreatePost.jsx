import { useEffect, useMemo, useState } from "react";
import Select from "react-select";
import { createPost, updatePost } from "../animals";
import { ToastContainer, toast } from "react-toastify";
import { getCounties, getCitiesByCounties } from "../getCC";
export default function CreatePost({ onSuccess, editData, onClose }) {
  const [file, setFile] = useState(null);
  const [nev, setNev] = useState("");
  const [megye, setMegye] = useState([]);
  const [selectedMegye, setSelectedMegye] = useState(null);
  const [varos, setVaros] = useState([]);
  const [selectedVaros, setSelectedVaros] = useState(null);
  const [megjegyzes, setMegjegyzes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [varosLoading, setVarosLoading] = useState(false);
  const [citiesRaw, setCitiesRaw] = useState([]);
  const [postcodes, setPostcodes] = useState([]);
  const [selectedPostcode, setSelectedPostcode] = useState(null);
  const isEditMode = !!editData;
  useEffect(() => {
    if (editData) {
      setNev(editData.nev || "");
      setMegjegyzes(editData.megjegyzes || "");

      if (editData.megye) {
        setSelectedMegye({ label: editData.megye, value: editData.megye });
      }
      if (editData.varos) {
        setSelectedVaros({ label: editData.varos, value: editData.varos });
      }
      if (editData.postcode) {
        setSelectedPostcode({
          label: String(editData.postcode),
          value: String(editData.postcode),
        });
      }
    }
  }, [editData]);
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
        setCitiesRaw([]);
        setPostcodes([]);
        setSelectedVaros(null);
        setSelectedPostcode(null);
        return;
      }

      setVarosLoading(true);
      try {
        const countyID = selectedMegye.value;
        const citiesData = await getCitiesByCounties(
          typeof countyID === "number" ? countyID : selectedMegye.label,
        );
        if (citiesData.error) return toast.error(citiesData.error);

        setCitiesRaw(citiesData.result);

        const uniqueCities = Array.from(
          new Set(citiesData.result.map((x) => x.city)),
        );
        setVaros(uniqueCities.map((city) => ({ label: city, value: city })));
      } finally {
        setVarosLoading(false);
      }
    }

    loadCities();
  }, [selectedMegye]);

  useEffect(() => {
    if (!selectedVaros) {
      setPostcodes([]);
      setSelectedPostcode(null);
      return;
    }
    const pcs = citiesRaw
      .filter((x) => x.city === selectedVaros.value)
      .map((x) => x.postcode)
      .filter(Boolean);
    const uniquePcs = Array.from(new Set(pcs.map(String)));
    setPostcodes(uniquePcs.map((pc) => ({ label: pc, value: pc })));
    setSelectedPostcode(null);
  }, [selectedVaros, citiesRaw]);

  const previewUrl = useMemo(() => {
    if (!file) return null;
    return URL.createObjectURL(file);
  }, [file]);
  const resetForm = () => {
    setNev("");
    setFile(null);
    setSelectedMegye(null);
    setSelectedVaros(null);
    setSelectedPostcode(null);
    setMegjegyzes("");
  };
  async function submitHandler(e) {
    e.preventDefault();

    if (!nev.trim()) return toast.info("Add meg az állat nevét!");
    if (!isEditMode && !file) return toast.info("Válassz képet!");
    if (!selectedMegye) return toast.info("Válassz megyét!");
    if (!selectedVaros) return toast.info("Válassz várost!");
    if (!selectedPostcode) return toast.info("Válassz irányítószámot!");
    setIsLoading(true);
    try {
      let result, error;

      if (isEditMode) {
        ({ result, error } = updatePost({
          id: editData.id,
          nev,
          varos: selectedVaros.value,
          megjegyzes,
          postcode: setSelectedPostcode.value,
          megye: selectedMegye.label,
          file,
        }));
      } else {
        ({ result, error } = await createPost({
          nev,
          varos: selectedVaros.label,
          megjegyzes,
          postcode: selectedPostcode.value,
          megye: selectedMegye.label,
          file,
        }));
      }

      if (error) {
        return toast.error(error);
      }
      toast.success(isEditMode ? "Sikeres módositás!" : "Sikeres feltöltés!");
      resetForm();

      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (err) {
      console.error(err);
      toast.error("Hiba történt a városok lekérdezésénél");
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <>
      <ToastContainer theme="dark" position="top-center" autoClose={2000} />
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
                {isEditMode ? "Hirdetés szerkesztése" : "Új hirdetés"}
              </h1>
              <button
                type="button"
                className="btn btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={onClose}
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={submitHandler}>
                <div className="row justify-content-center g-3">
                  {/* Állat neve */}
                  <div className="col-12 col-md-8">
                    <label className="form-label">Kisállat neve</label>
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
                        setSelectedPostcode(null);
                      }}
                      placeholder="Válassz megyét..."
                      isSearchable
                      isClearable
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
                        setSelectedPostcode(null);
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
                    <label className="form-label mt-3">Irányítószám</label>
                    <Select
                      classNamePrefix="custom-select"
                      options={postcodes}
                      value={selectedPostcode}
                      onChange={setSelectedPostcode}
                      isDisabled={!selectedVaros}
                      placeholder={
                        !selectedVaros
                          ? "Előbb válassz várost..."
                          : "Válassz irányítószámot..."
                      }
                      isSearchable
                      isClearable
                    />
                    <div className="mt-3">
                      <label className="form-label">
                        {isEditMode ? "Új kép (opcionális)" : "Kisállat képe"}
                      </label>
                      {isEditMode && editData?.kep && !file && (
                        <div className="mb-2">
                          <small className="text-muted">Jelenlegi kép</small>
                          <img
                            src={editData.kep}
                            alt="Jelenlegi"
                            className="previewImg d-block"
                            style={{ maxHeight: 150 }}
                          />
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="form-control"
                        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                        multiple={true}
                      />

                      {previewUrl && (
                        <div className="mt-3">
                          <small className="text-muted">
                            Új kép előnézete:
                          </small>
                          <img
                            src={previewUrl}
                            alt="Előnézet"
                            className="previewImg d-block"
                          />
                        </div>
                      )}
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

                  <div className="">
                    <div className="gap-2 m-4 d-flex justify-content-around ">
                      <button
                        type="button"
                        className="btn btn-outline-danger justify-content-between"
                        data-bs-dismiss="modal"
                        disabled={isLoading}
                        onClick={onClose}
                      >
                        Elvetés
                      </button>
                      <button
                        type="submit"
                        className="btn btn-outline-success justify-content-betweens"
                        data-bs-dismiss="modal"
                        disabled={isLoading}
                      >
                        {isLoading
                          ? isEditMode
                            ? "Mentés..."
                            : "Feltöltés...."
                          : isEditMode
                            ? "Mentés"
                            : "Feltöltés"}
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
