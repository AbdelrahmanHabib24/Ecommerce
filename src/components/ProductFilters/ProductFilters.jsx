/* eslint-disable react/prop-types */
import { memo, useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { FaFilter } from "react-icons/fa";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const sliderStyles = {
  rail: { light: "#e5e7eb", dark: "#4b5563" },
  track: { light: "#3b82f6", dark: "#60a5fa" },
  handle: {
    light: { borderColor: "#3b82f6", backgroundColor: "#ffffff" },
    dark: { borderColor: "#60a5fa", backgroundColor: "#1f2937" },
  },
};

const capitalize = (str) => {
  if (!str) return "";
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const defaultCategories = [
  { id: "all", name: "All Categories", value: "" },
  { id: "electronics", name: "Electronics", value: "electronics" },
  { id: "jewelery", name: "Jewelery", value: "jewelery" },
  { id: "mens-clothing", name: "Men's Clothing", value: "men's clothing" },
  { id: "womens-clothing", name: "Women's Clothing", value: "women's clothing" },
];

const ProductFilters = ({
  categoryFilter = "",
  setCategoryFilter,
  priceRange = [0, 1000],
  setPriceRange,
  ratingFilter = 0,
  setRatingFilter,
  
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const isDarkMode = document.documentElement.classList.contains("dark");
  const { categories: reduxCategories, loading, error } = useSelector((state) => state.categories);

  const categories = reduxCategories?.length > 0 ? reduxCategories : defaultCategories;

  const handleCategoryChange = useCallback(
    (e) => {
      const value = e.target.value;
      console.log("ProductFilters: Category changed to:", value);
      setCategoryFilter(value);
    },
    [setCategoryFilter]
  );

  return (
    <div className="mb-6 px-4 sm:px-0">
      <div className="md:hidden mb-4">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="flex items-center gap-2 px-4 py-2  bg-blue-500 text-white rounded-md w-full hover:bg-blue-600 transition-colors"
          aria-expanded={isFilterOpen}
          aria-controls="filter-panel"
        >
          <FaFilter className="w-5 h-5" />
          <span>{isFilterOpen ? "Hide Filters" : "Show Filters"}</span>
        </button>
      </div>

      <div
        id="filter-panel"
        className={`flex flex-col md:flex-row md:items-center place-content-center sm:gap-2 lg:gap-16 space-y-4 md:space-y-0 md:space-x-6 ${
          isFilterOpen ? "block" : "hidden md:flex"
        }`}
        role="region"
        aria-labelledby="filter-heading"
      >
        <div className="w-full md:w-1/4 flex items-center space-x-2">
          <FaFilter className="text-gray-600 dark:text-gray-300 flex-shrink-0" aria-hidden="true" />
          <div className="w-full">
            {loading ? (
              <div className="px-3 py-2 text-gray-500 dark:text-gray-400 animate-pulse">
                Loading categories...
              </div>
            ) : error ? (
              <div className="px-3 py-2 text-red-500 dark:text-red-400">{error}</div>
            ) : categories.length > 0 ? (
              <select
                className="w-full border rounded-lg px-3 py-2 bg-white text-gray-700 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:focus:ring-blue-400 transition-colors"
                value={categoryFilter}
                onChange={handleCategoryChange}
                aria-label="Select product category"
                disabled={loading}
              >
                <option value="">All Categories</option>
                {categories
                  .filter((category) => category.value !== "") // Exclude "All Categories" since it's hardcoded above
                  .map((category) => (
                    <option key={category.id} value={category.value}>
                      {capitalize(category.name)}
                    </option>
                  ))}
              </select>
            ) : (
              <div className="px-3 py-2 text-gray-500 dark:text-gray-400">
                No categories available.
              </div>
            )}
          </div>
        </div>

        <div className="w-full md:w-1/3">
          <label
            htmlFor="price-range"
            className="text-sm text-gray-600 dark:text-gray-300 block mb-1"
          >
            Price Range: ${priceRange[0]} - ${priceRange[1]}
          </label>
          <Slider
            id="price-range"
            range
            min={0}
            max={1000}
            value={priceRange}
            onChange={setPriceRange}
            trackStyle={[{ backgroundColor: isDarkMode ? sliderStyles.track.dark : sliderStyles.track.light }]}
            handleStyle={[
              { ...(isDarkMode ? sliderStyles.handle.dark : sliderStyles.handle.light) },
              { ...(isDarkMode ? sliderStyles.handle.dark : sliderStyles.handle.light) },
            ]}
            railStyle={{ backgroundColor: isDarkMode ? sliderStyles.rail.dark : sliderStyles.rail.light }}
            aria-label={`Price range from ${priceRange[0]} to ${priceRange[1]} dollars`}
          />
        </div>

        <div className="w-full md:w-1/4">
          <label
            htmlFor="rating-filter"
            className="text-sm text-gray-600 dark:text-gray-300 block mb-1"
          >
            Min Rating: {ratingFilter} Stars
          </label>
          <Slider
            id="rating-filter"
            min={0}
            max={5}
            step={1}
            value={ratingFilter}
            onChange={setRatingFilter}
            trackStyle={[{ backgroundColor: isDarkMode ? sliderStyles.track.dark : sliderStyles.track.light }]}
            handleStyle={[{ ...(isDarkMode ? sliderStyles.handle.dark : sliderStyles.handle.light) }]}
            railStyle={{ backgroundColor: isDarkMode ? sliderStyles.rail.dark : sliderStyles.rail.light }}
            aria-label={`Minimum rating of ${ratingFilter} stars`}
          />
        </div>
      </div>
    </div>
  );
};





export default memo(ProductFilters);