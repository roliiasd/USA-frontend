import { useEffect, useMemo, useRef, useState } from "react";
import Select from "react-select";
import { updatePost } from "../animals";
import { toast } from "react-toastify";
import { getCounties, getCitiesByCounties } from "../getCC";

export default function EditPost({ editData, onClose, onSuccess }) {
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

  const modalRef = useRef(null);

  // Backdrop és ESC kezelés
  useEffect(() => {
    if (!editData) return;

    function handleBackdropClick(e) {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose?.();
      }
    }

    function handleEsc(e) {
      if (e.key === "Escape") {
        onClose?.();
      }
    }

    document.addEventListener("mousedown", handleBackdropClick);
    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("mousedown", handleBackdropClick);
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [editData, onClose]);

  // EditData betöltése
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

  // Megyék betöltése
  useEffect(() => {
    async function loadCounties() {
      try {
        const countiesData = await getCounties();
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
        toast.error("Hiba történt a megyék lekérdezésénél");
      }
    }
    loadCounties();
  }, []);

  // Városok betöltése
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
          typeof countyID === "number" ? countyID : selectedMegye.label
        );
        if (citiesData.error) return toast.error(citiesData.error);

        setCitiesRaw(citiesData.result);
        const uniqueCities = Array.from(
          new Set(citiesData.result.map((x) => x.city))
        );
        setVaros(uniqueCities.map((city) => ({ label: city, value: city })));
      } finally {
        setVarosLoading(false);
      }
    }
    loadCities();
  }, [selectedMegye]);

  // Irányítószámok
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

  const customSelectStyles = {
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
    }),
  };

  async function submitHandler(e) {
    e.preventDefault();

    if (!nev.trim()) return toast.info("Add meg az állat nevét!");
    if (!selectedMegye) return toast.info("Válassz megyét!");
    if (!selectedVaros) return toast.info("Válassz várost!");
    if (!selectedPostcode) return toast.info("Válassz irányítószámot!");

    setIsLoading(true);
    try {
      const { result, error } = await updatePost({
        id: editData.id,
        nev,
        varos: selectedVaros.value,
        megjegyzes,
        postcode: selectedPostcode.value,
        megye: selectedMegye.label,
        file,
      });

      if (error) {
        return toast.error(error);
      }
      toast.success("Sikeres módosítás!");
      onSuccess?.();
      onClose?.();
    } catch (err) {
      console.error(err);
      toast.error("Hiba történt");
    } finally {
      setIsLoading(false);
    }
  }

  if (!editData) return null;

  return (
    <div className="edit-modal-backdrop">
      <div
        className="modal-dialog modal-lg modal-dialog-centered edit-post-modal"
        ref={modalRef}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title text-center w-100">
              Hirdetés szerkesztése
            </h1>
            <button
              type="button"
              className="btn btn-close"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <form onSubmit={submitHandler}>
              <div className="row justify-content-center g-3">
                <div className="col-12 col-md-8">
                  <label className="form-label">Kisállat neve</label>
                  <input
                    value={nev}
                    onChange={(e) => setNev(e.target.value)}
                    type="text"
                    className="form-control"
                    placeholder="pl. Bodri"
                  />

                  <label className="form-label mt-3">Megye</label>
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
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                    styles={customSelectStyles}
                  />

                  <label className="form-label mt-3">Város</label>
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
                    isSearchable
                    isClearable
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                    styles={customSelectStyles}
                  />

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
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                    styles={customSelectStyles}
                  />

                  <div className="mt-3">
                    <label className="form-label">Új kép (opcionális)</label>
                    {editData?.kep && !file && (
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
                    />
                    {previewUrl && (
                      <div className="mt-3">
                        <small className="text-muted">Új kép előnézete:</small>
                        <img
                          src={previewUrl}
                          alt="Előnézet"
                          className="previewImg d-block"
                        />
                      </div>
                    )}
                  </div>

                  <div className="mt-3">
                    <label className="form-label">Megjegyzés:</label>
                    <textarea
                      value={megjegyzes}
                      onChange={(e) => setMegjegyzes(e.target.value)}
                      className="form-control"
                      rows={4}
                    ></textarea>
                  </div>
                </div>

                <div className="col-12">
                  <div className="gap-2 m-4 d-flex justify-content-around">
                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      onClick={onClose}
                      disabled={isLoading}
                    >
                      Elvetés
                    </button>
                    <button
                      type="submit"
                      className="btn btn-outline-success"
                      disabled={isLoading}
                    >
                      {isLoading ? "Mentés..." : "Mentés"}
                    </button>
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