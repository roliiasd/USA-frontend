import { useEffect, useState } from "react";
import { getCounties, getCitiesByCounties } from "../getCC";
import { ToastContainer, toast } from "react-toastify";
import Select from "react-select";

export default function Filter() {
  const [megye, setMegye] = useState([]);
  const [selectedMegye, setSelectedMegye] = useState(null);
  const [varos, setVaros] = useState([]);
  const [selectedVaros, setSelectedVaros] = useState(null);
  const [varosLoading, setVarosLoading] = useState(false);

  const megyeHasValue = selectedMegye != null;
  const varosHasValue = selectedVaros != null;

  // console.log(megye);
  useEffect(() => {
    async function loadCounties() {
      try {
        const countiesData = await getCounties();
        //  console.log("countiesData:", countiesData);
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
  return (
    <>
      <div className="ua-filter ">
        <ToastContainer theme="dark" position="top-center" autoClose={2500} />
        <h3>Szűrők</h3>
        <div className="row justify-content-center g-3">
          <div className="col-12 col-md-8 ">
            <div>
              <div className="form-check mb-2">
                <input type="checkbox" className="form-check-input" id="hoki" />
                <label className="form-check-label" htmlFor="hoki">
                  hoki
                </label>
              </div>
              <div className="form-check mb-2">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="broki"
                />
                <label className="form-check-label" htmlFor="broki">
                  broki
                </label>
              </div>
              <div className="form-check mb-2">
                <input type="checkbox" className="form-check-input" id="koki" />
                <label className="form-check-label" htmlFor="koki">
                  koki
                </label>
              </div>
            </div>
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
          </div>
        </div>
      </div>
    </>
  );
}
