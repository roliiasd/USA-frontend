import { useEffect, useMemo, useRef, useState } from "react";
import Select from "react-select";
import { createPost } from "../utils/animals";
import { toast } from "react-toastify";
import { getCounties, getCitiesByCounties } from "../utils/getCC";

export default function CreatePostModal({ showModal, onClose, onSuccess }) {
  const [files, setFiles] = useState([]);
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
  const [previewUrls, setPreviewUrls] = useState([]);

  const modalRef = useRef(null);
  const MAX_FILES = 5;
  // Backdrop és ESC kezelés
  useEffect(() => {
    if (!showModal) return;

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
  }, [showModal, onClose]);

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

  useEffect(() => {
    previewUrls.forEach((url) => URL.revokeObjectURL(url));
    const newUrls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(newUrls);
    return () => {
      newUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files]);
  const customSelectStyles = {
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
    }),
  };

  const resetForm = () => {
    setNev("");
    setFiles([]);
    setPreviewUrls([])
    setSelectedMegye(null);
    setSelectedVaros(null);
    setSelectedPostcode(null);
    setMegjegyzes("");
  };
  function handleFileChange(e) {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length + files.length > MAX_FILES) {
      toast.warning(`Maximum ${MAX_FILES} kepet tölthetsz fel`);
      return;
    }
    setFiles((prev) => [...prev, ...selectedFiles]);
    e.target.value = "";
  }
  function removeFile(index) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }
  async function submitHandler(e) {
    e.preventDefault();

    if (!nev.trim()) return toast.info("Add meg az állat nevét!");
    if (files.length === 0)
      return toast.info("Válassz legalább egy képet képet!");
    if (!selectedMegye) return toast.info("Válassz megyét!");
    if (!selectedVaros) return toast.info("Válassz várost!");
    if (!selectedPostcode) return toast.info("Válassz irányítószámot!");

    setIsLoading(true);
    try {
      const { result, error } = await createPost({
        nev,
        varos: selectedVaros.label,
        megjegyzes,
        postcode: selectedPostcode.value,
        megye: selectedMegye.label,
        files,
      });

      if (error) {
        return toast.error(error);
      }
      toast.success("Sikeres feltöltés!");
      resetForm();
      onSuccess?.();
      onClose?.();
    } catch (err) {
      console.error(err);
      toast.error("Hiba történt");
    } finally {
      setIsLoading(false);
    }
  }

  if (!showModal) return null;

  return (
    <div className="create-modal-backdrop">
      <div
        className="modal-dialog modal-lg modal-dialog-centered create-post-modal"
        ref={modalRef}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title text-center w-100">Új hirdetés</h1>
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
                    <label className="form-label">
                      Kisállat képei
                      <small className="text-muted d-block mt-1">
                        Maximum {MAX_FILES} kép, egyébként max 10mb
                      </small>
                    </label>
                    <label className="custom-file-input">
                      <i className="bi bi-cloud-upload me-2" />
                      <span>Képek kiválasztása</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="form-control"
                        onChange={handleFileChange}
                        disabled={files.length >= MAX_FILES}
                      />
                    </label>

                    {files.length > 0 && (
                      <div className="image-preview-grid mt-3">
                        {files.map((file, index) => (
                          <div className="image-preview-item" key={index}>
                            <img
                              src={previewUrls[index]}
                              alt={`Előnézet ${index + 1}`}
                            />
                            {index === 0 && (
                              <span className="main-image-badge">Fő kép</span>
                            )}
                            <button
                              type="button"
                              className="remove-image-btn"
                              onClick={() => removeFile(index)}
                              title="Kép törlése"
                            >
                              <i className="bi bi-x-lg" />
                            </button>
                          </div>
                        ))}
                        {files.length < MAX_FILES && (
                          <label className="add-more-images">
                            <i className="bi bi-plus-lg" />
                            <span>Kép hozzáadása</span>
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={handleFileChange}
                              hidden
                            />
                          </label>
                        )}
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
  );
}
