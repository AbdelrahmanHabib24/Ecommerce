import { useEffect } from "react";
import { Link } from "react-router-dom";
import { FaSpinner, FaRedo } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../reducers/categoriesReducer";

const Categories = () => {
  const dispatch = useDispatch();
  const {
    formattedCategories = [],
    loading,
    error,
  } = useSelector((state) => state.categories || {});

  useEffect(() => {
    if (!formattedCategories.length && !loading && !error) {
      dispatch(fetchCategories());
    }
  }, [dispatch, formattedCategories.length, loading, error]);

  const handleRetry = () => dispatch(fetchCategories());

  return (
    <div className="py-6 sm:py-10 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6">
        <h2
          className="text-2xl sm:text-3xl font-semibold mb-6 sm:mb-8 text-center text-orange-400 dark:text-gray-100"
          data-aos="fade-down"
          data-aos-duration="800"
        >
          Shop by Category
        </h2>

        {loading ? (
          <div className="text-center py-6 flex justify-center items-center">
            <FaSpinner className="animate-spin text-blue-500 w-8 h-8 sm:w-10 sm:h-10" />
            <span className="ml-2 text-lg sm:text-xl text-gray-700 dark:text-gray-300">
              Loading categories...
            </span>
          </div>
        ) : error ? (
          <div className="text-center py-6">
            <p className="text-red-500 text-base sm:text-lg mb-4">{error}</p>
            <button
              onClick={handleRetry}
              className="flex items-center gap-2 mx-auto px-4 sm:px-6 py-2 sm:py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              <FaRedo
                className={`w-4 h-4 sm:w-5 sm:h-5 ${
                  loading ? "animate-spin" : ""
                }`}
              />
              Retry
            </button>
          </div>
        ) : formattedCategories.length === 0 ? (
          <div className="text-center py-6 text-gray-500 dark:text-gray-400">
            No categories available at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {formattedCategories.map((cat) => (
              <Link
                key={cat.id}
                to={`/shop?category=${cat.value
                  .replace(/\s+/g, "-")
                  .toLowerCase()}`}
                className="relative group overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
                data-aos="fade-up"
                data-aos-delay={cat.aosDelay}
                data-aos-duration="800"
              >
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="w-full h-36 xs:h-40 sm:h-48 md:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-center">
                  <h3 className="text-white text-base xs:text-lg sm:text-xl md:text-2xl font-semibold group-hover:-translate-y-1 transition-transform duration-300 drop-shadow-lg">
                    {cat.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
