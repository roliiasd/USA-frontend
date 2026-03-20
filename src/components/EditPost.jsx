import { useEffect, useMemo, useRef, useState } from "react";
import Select from "react-select";
import { updatePost, delAnim } from "../animals";
import { toast } from "react-toastify";
import { getCounties, getCitiesByCounties } from "../getCC";

export default function EditPost({ editData, onClose, onSuccess }) {
  const [nev, setNev] = useState("");
  const [megye, setMegye] = useState([]);
  const [selectedMegye, setSelectedMegye] = useState(null);
  const [varos, setVaros] = useState([]);
  const [selectedVaros, setSelectedVaros] = useState(null);
  const [megjegyzes, setMegjegyzes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [varosLoading, setVarosLoading] = useState(false);
  const [citiesRaw, setCitiesRaw] = useState([]);
  const [postcode, setPostcodes] = useState([]);
  const [selectedPostcode, setSelectedPostcode] = useState(null);

  const [images, setImages] = useState([]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const modalRef = useRef(null);

  useEffect(() => {
    if (!editData) return;
    setIsInitialLoad(true);
    setNev(editData.nev || "");
    setMegjegyzes(editData.megjegyzes || "");
    if (editData.images && editData.images.length > 0) {
      setImages(
        editData.images.map((img) => ({
          imageId: img.imageId,
          url: img.url,
          newFile: null,
          previewUrl: null,
        })),
      );
    } else {
      setImages([]);
    }
    setCurrentIndex(0);

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
    console.log("editData:", editData);
  }, [editData]);
  useEffect(() => {
    return () => {
      images.forEach((img) => {
        if (img.previewUrl) URL.revokeObjectURL(img.previewUrl);
      });
    };
  }, []);
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
        if (!isInitialLoad) {
          setSelectedVaros(null);
          setSelectedPostcode(null);
        }
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
        if (isInitialLoad) {
          setIsInitialLoad(false);
        }
      } finally {
        setVarosLoading(false);
      }
    }
    loadCities();
  }, [selectedMegye, isInitialLoad]);

  // Irányítószámok
  useEffect(() => {
    if (!selectedVaros || !citiesRaw.length) {
      if (!isInitialLoad) {
        setPostcodes([]);
        setSelectedPostcode(null);
      }
      return;
    }

    const pcs = citiesRaw
      .filter((x) => x.city === selectedVaros.value)
      .map((x) => x.postcode)
      .filter(Boolean);
    const uniquePcs = Array.from(new Set(pcs.map(String)));
    setPostcodes(uniquePcs.map((pc) => ({ label: pc, value: pc })));
   
    if (!isInitialLoad) {
      setSelectedPostcode(null);
    }
  }, [selectedVaros, citiesRaw, isInitialLoad]);

  const customSelectStyles = {
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
    }),
  };

  const formatImagePath = (path) => {
    if (!path) return "/placeholder.jpg";
    return path.startsWith("/") ? path : `/${path}`;
  };
  const goToPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };
  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (images[currentIndex]?.previewUrl) {
      URL.revokeObjectURL(images[currentIndex].previewUrl);
    }
    setImages((prev) =>
      prev.map((img, idx) => {
        if (idx === currentIndex) {
          return {
            ...img,
            newFile: file,
            previewUrl: URL.createObjectURL(file),
          };
        }
        return img;
      }),
    );
    e.target.valeu = "";
    toast.info("Kep kijelolve cserér, mentéskor lesz véglegesitve");
  }
  function undoReplace() {
    if (images[currentIndex]?.previewUrl) {
      URL.revokeObjectURL(images[currentIndex].previewUrl);
    }
    setImages((pev) =>
      prev.map((img, idx) => {
        if (idx === currentIndex) {
          return {
            ...img,
            newFile: null,
            previewUrl: null,
          };
        }
        return img;
      }),
    );
  }
  async function handleDelete() {
    setIsLoading(true);
    try {
      const result = await delAnim(editData.id);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("hirdetés Törölve");
      onSuccess?.();
      onClose?.();
    } catch (err) {
      console.error(err);
      toast.error("hiba tortent a torles soran");
    } finally {
      setIsLoading(false);
    }
  }

  async function submitHandler(e) {
    e.preventDefault();

    if (!nev.trim()) return toast.info("Add meg az állat nevét!");
    if (!selectedMegye) return toast.info("Válassz megyét!");
    if (!selectedVaros) return toast.info("Válassz várost!");
    if (!selectedPostcode) return toast.info("Válassz irányítószámot!");

    if (!currentImage && !newFile) {
      return toast.info("Tolts fel egy kepet!");
    }
    setIsLoading(true);
    try {
      const modifiedImages = images.filter((img) => img.newFile);

      for (const img of modifiedImages) {
        const { error } = await updatePost({
          animalId: editData.id,
          imageId: img.imageId,
          nev,
          varos: selectedVaros.value,
          megjegyzes,
          postcode: selectedPostcode.value,
          megye: selectedMegye.label,
          file: img.newFile,
        });
        if (error) {
          toast.error("Hiba a krep frisitekser:", error);
          return;
        }
      }
      if (modifiedImages.length === 0) {
        const { error } = await updatePost({
          animalId: editData.id,
          imageId: images[0]?.imageId,
          nev,
          varos: selectedVaros.value,
          megjegyzes,
          postcode: selectedPostcode.value,
          megye: selectedMegye.label,
          file: null,
        });
        if (error) {
          toast.error(error);
          return;
        }
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
  const currentImage = images[currentIndex];
  const hasMultipleImages = images.length > 1;
  const isModified = currentImage?.newFile != null;

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
                    options={postcode}
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
                      Kisállat képei ({currentIndex + 1}/ {images.length})
                    </label>
                    <div className="edit-carousel">
                      {images.length > 0 ? (
                        <>
                          {hasMultipleImages && (
                            <button
                              type="button"
                              className="carousel-btn carousel-btn-left"
                              onClick={goToPrev}
                            >
                              <i className="bi bi-chevron-left" />
                            </button>
                          )}
                          <div className="carousel-image-container">
                            <img
                              src={
                                isModified
                                  ? currentImage.previewUrl
                                  : formatImagePath(currentImage.url)
                              }
                              alt={`Kép ${currentIndex + 1}`}
                              className="carousel-image"
                              onError={(e) => {
                                e.target.src = "/placeholder.jpg";
                              }}
                            />
                            {isModified && (
                              <span className="image-badge modified-badge">
                                Módositva
                              </span>
                            )}
                            {currentIndex === 0 && (
                              <span className="image-badge main-badge">
                                Fő kép:
                              </span>
                            )}
                          </div>
                          {hasMultipleImages && (
                            <button
                              type="button"
                              className="carousel-btn carousel-btn-right"
                              onClick={goToNext}
                            >
                              <i className="bi bi-chevron-right" />
                            </button>
                          )}
                          {hasMultipleImages && (
                            <div className="carousel-dots">
                              {images.map((img, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  className={`carousel-dot 
                                    ${idx === currentIndex ? "active" : ""} 
                                  ${img.newFile ? "modified" : ""}`}
                                  onClick={() => setCurrentIndex(idx)}
                                />
                              ))}
                            </div>
                          )}
                          <div className="carousel-counter">
                            {currentIndex + 1}/{images.length}
                          </div>
                        </>
                      ) : (
                        <div className="no-images">
                          <i className="bi bi-image" />
                          <p>Nincs kép</p>
                        </div>
                      )}
                    </div>
                    <div className="image-actions mt-2 d-flex gap-2">
                      <label className="btn btn-outline-primary btn-sm">
                        <i className="bi bi-arrow-repeat me-1" />
                        {isModified ? "Masik kep valasztasa" : "Kepc sereje"}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          hidden
                        />
                      </label>
                      {isModified && (
                        <button
                          type="button"
                          className="btn btn-outline-warning btn-sm"
                          onClick={undoReplace}
                        >
                          <i className="bi bi-arrow-counterclockwise me-1" />
                          Visszavonás
                        </button>
                      )}
                    </div>
                    {images.some((img) => img.newFile) && (
                      <div className="alert alert-info mt-2 py-2">
                        <small>
                          <i className="bi bi-info-circle me-1" />
                          {images.filter((img) => img.newFile).length} kép
                          modositásra jelolve
                        </small>
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
                      className="btn btn-danger"
                      onClick={handleDelete}
                      disabled={isLoading}
                    >
                      <i className="bi bi-trash me-2" />
                      Törlés
                    </button>
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
