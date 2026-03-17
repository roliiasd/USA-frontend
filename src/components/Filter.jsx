import { useEffect, useState } from "react";
import { getCounties, getCitiesByCounties } from "../getCC";
import Select from "react-select";

export default function Filter({ filters, setFilters }) {
  const [megye, setMegye] = useState([]);
  const [varos, setVaros] = useState([]);
  const [varosLoading, setVarosLoading] = useState(false);
  const [citiesRaw, setCitiesRaw] = useState([]);
  const [postcodes, setPostcodes] = useState([]);

  // console.log(megye);
  useEffect(() => {
    async function loadCounties() {
      try {
        const countiesData = await getCounties();
        //  console.log("countiesData:", countiesData);
        if (countiesData.error) {
          return console.error(countiesData.error);
        }
        const formattedCounties = countiesData.result.map((c) => ({
          label: c.county,
          value: c.id,
        }));
        setMegye(formattedCounties);
      } catch (err) {
        console.error(err);
        console.error("Hiba töltént a bukkitszerverror valo lekerdezesnel");
      }
    }
    loadCounties();
  }, []);

  useEffect(() => {
    async function loadCities() {
      if (!filters.county) {
        setVaros([]);
        setCitiesRaw([]);
        setPostcodes([]);
        return;
      }
      setVarosLoading(true);
      try {
        const citiesData = await getCitiesByCounties(filters.county.value);
        // console.log(`citiesdata: ${citiesData}`);

        if (citiesData.error) {
          return console.error(citiesData.error);
        }
        setCitiesRaw(citiesData.result);

        const uniqueCities = Array.from(
          new Set(citiesData.result.map((x) => x.city)),
        );
        setVaros(uniqueCities.map((city) => ({ label: city, value: city })));
      } catch (err) {
        console.error(err);
        console.error("Hiba volt a lekerdezesben bratyeszgatyesz");
      } finally {
        setVarosLoading(false);
      }
    }
    loadCities();
  }, [filters.county]);

  useEffect(() => {
    if (!filters.city) {
      setPostcodes([]);
      return;
    }

    const pcs = citiesRaw
      .filter((x) => x.city === filters.city.value)
      .map((x) => x.postcode)
      .filter(Boolean);
    const uniquePcs = Array.from(new Set(pcs));
    setPostcodes(uniquePcs.map((pc) => ({ label: pc, value: pc })));
  }, [filters.city, citiesRaw]);

  return (
    <>
      <div className="ua-filter ">
        <h3 className="mb-5">Szűrők</h3>
        <div className="row justify-content-center g-3">
          <div className="col-12 col-md-8 ">
            
            <label className="form-label">Megye</label>
            {/* ------- */}
            {/* ------- */}
            {/* ------- */}
            {/* ------- */}
            {/* ------- */}
            {/* ------- */}
            <Select
              classNamePrefix="custom-select"
              options={megye}
              value={filters.county}
              onChange={(selected) => {
                setFilters((prev) => ({
                  ...prev,
                  county: selected,
                  city: null,
                }));
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
              value={filters.city}
              onChange={(selected) =>
                setFilters((prev) => ({
                  ...prev,
                  city: selected,
                  postcode: null,
                }))
              }
              isDisabled={!filters.county}
              isLoading={varosLoading}
              placeholder={
                !filters.county
                  ? "Előbb válassz megyét..."
                  : "Válassz várost..."
              }
              isClearable
              isSearchable
            />
            {/* ------- */}
            {/* ------- */}
            {/* ------- */}
            {/* ------- */}
            {/* ------- */}
            {/* ------- */}
            
          </div>
        </div>
      </div>
    </>
  );
}
