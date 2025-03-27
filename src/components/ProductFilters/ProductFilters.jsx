/* eslint-disable no-undef */
import React from 'react';
import PropTypes from 'prop-types';
import { FaFilter } from 'react-icons/fa';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

// أنماط مخصصة لمكون Slider لدعم الـ White Mode والـ Dark Mode
const sliderStyles = {
  rail: {
    light: '#e5e7eb', // لون السكة في الوضع الفاتح (رمادي فاتح)
    dark: '#4b5563',  // لون السكة في الوضع الداكن (رمادي داكن)
  },
  track: {
    light: '#3b82f6', // لون المسار في الوضع الفاتح (أزرق)
    dark: '#60a5fa',  // لون المسار في الوضع الداكن (أزرق فاتح)
  },
  handle: {
    light: {
      borderColor: '#3b82f6', // لون الحدود في الوضع الفاتح (أزرق)
      backgroundColor: '#ffffff', // لون الخلفية في الوضع الفاتح (أبيض)
      boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.2)', // ظل خفيف
    },
    dark: {
      borderColor: '#60a5fa', // لون الحدود في الوضع الداكن (أزرق فاتح)
      backgroundColor: '#1f2937', // لون الخلفية في الوضع الداكن (رمادي داكن)
      boxShadow: '0 0 0 2px rgba(96, 165, 250, 0.2)', // ظل خفيف
    },
  },
};

const ProductFilters = ({
  categories,
  categoryFilter,
  setCategoryFilter,
  priceRange,
  setPriceRange,
  ratingFilter,
  setRatingFilter,
}) => {
  // التحقق من السمة الحالية (لتحديد الأنماط بناءً عليها)
  const isDarkMode = document.documentElement.classList.contains('dark');

  // حالة للتحكم في إظهار/إخفاء الفلاتر على الموبايل
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);

  // دالة لمسح جميع الفلاتر
 

  return (
    <div className="mb-6 px-10 space-x-2 items-center justify-between md:flex-wrap md:gap-x-96  sm:px-0">
      {/* زر لإظهار/إخفاء الفلاتر على الموبايل */}
      <div className="md:hidden mb-4">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md w-full sm:w-auto transition-all duration-100"
          aria-expanded={isFilterOpen}
          aria-controls="filter-section"
        >
          <FaFilter className="w-5 h-5" />
          <span>{isFilterOpen ? 'Hide Filters' : 'Show Filters'}</span>
        </button>
      </div>

      {/* قسم الفلاتر */}
      <div
        id="filter-section"
        className={`flex flex-col gap-x-16 md:flex-row md:items-center md:justify-center space-y-4 md:space-y-0 md:space-x-6 transition-all duration-300 ${
          isFilterOpen ? 'block' : 'hidden md:flex'
        }`}
        data-aos="fade-up"
      >
        {/* فلتر الفئات */}
        <div className="w-full  md:w-1/4 flex items-center space-x-2">
          <FaFilter className="text-gray-600 dark:text-gray-300 flex-shrink-0" />
          <div className="w-full">
            <label htmlFor="category-filter" className="sr-only">
              Filter by category
            </label>
            {categories.length > 0 ? (
              <select
                id="category-filter"
                className="w-full border rounded-lg px-3 py-2 bg-white text-gray-700 border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 text-sm sm:text-base"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                aria-label="Filter by category"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            ) : (
              <div className="w-full px-3 py-2 text-gray-500 dark:text-gray-400">
                Loading categories...
              </div>
            )}
          </div>
        </div>

        {/* فلتر نطاق السعر */}
        <div className="w-full md:w-1/3">
          <label
            htmlFor="price-range"
            className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 block mb-1 font-medium"
          >
            Price Range: ${priceRange[0]} - ${priceRange[1]}
          </label>
          <Slider
            id="price-range"
            range
            min={0}
            max={1000}
            value={priceRange}
            onChange={(value) => setPriceRange(value)}
            trackStyle={[{ backgroundColor: isDarkMode ? sliderStyles.track.dark : sliderStyles.track.light }]}
            handleStyle={[
              { ...(isDarkMode ? sliderStyles.handle.dark : sliderStyles.handle.light) },
              { ...(isDarkMode ? sliderStyles.handle.dark : sliderStyles.handle.light) },
            ]}
            railStyle={{ backgroundColor: isDarkMode ? sliderStyles.rail.dark : sliderStyles.rail.light }}
            className="w-full"
            ariaLabel={['Minimum price', 'Maximum price']}
            ariaValueTextFormatter={(value) => `${value} dollars`}
          />
        </div>

        {/* فلتر التقييم */}
        <div className="w-full md:w-1/4">
          <label
            htmlFor="rating-filter"
            className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 block mb-1 font-medium"
          >
            Min Rating: {ratingFilter} Stars
          </label>
          <Slider
            id="rating-filter"
            min={0}
            max={5}
            step={1}
            value={ratingFilter}
            onChange={(value) => setRatingFilter(value)}
            trackStyle={[{ backgroundColor: isDarkMode ? sliderStyles.track.dark : sliderStyles.track.light }]}
            handleStyle={[{ ...(isDarkMode ? sliderStyles.handle.dark : sliderStyles.handle.light) }]}
            railStyle={{ backgroundColor: isDarkMode ? sliderStyles.rail.dark : sliderStyles.rail.light }}
            className="w-full"
            ariaLabel="Minimum rating"
            ariaValueTextFormatter={(value) => `${value} stars`}
          />
        </div>

        {/* زر مسح الفلاتر */}
       
      </div>
    </div>
  );
};

ProductFilters.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  categoryFilter: PropTypes.string.isRequired,
  setCategoryFilter: PropTypes.func.isRequired,
  priceRange: PropTypes.arrayOf(PropTypes.number).isRequired,
  setPriceRange: PropTypes.func.isRequired,
  ratingFilter: PropTypes.number.isRequired,
  setRatingFilter: PropTypes.func.isRequired,
};

export default ProductFilters;