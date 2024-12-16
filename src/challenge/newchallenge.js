import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function FilterPage() {
  const [filter, setFilter] = useState("");
  const navigate = useNavigate();

  const handleFilter = () => {
    if (filter) {
      navigate(`/challenges?filter=${encodeURIComponent(filter)}`);
    } else {
      alert("Please select a filter.");
    }
  };

  return (
    <div className="filter-page">
      <h1>Filter Challenges</h1>
      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="filter-dropdown"
      >
        <option value="">Select a Filter</option>
        <option value="learn">Learn New Language</option>
        <option value="gym">Go to Gym</option>
        <option value="design">Learn Design</option>
        <input type="submit" value="See More.." class="see-more
                 d-block fs-14 bg-blue c-white w-fit btn-shape" onclick="OpenPopup(1)"/>
      </select>
      <button onClick={handleFilter} className="btn bg-blue c-white">
        Apply Filter
      </button>
    </div>
  );
}

export default FilterPage;