import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { FaSpinner, FaRedo } from "react-icons/fa";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("https://api.escuelajs.co/api/v1/categories?limit=3");
      if (!response.ok) throw new Error("Failed to fetch categories");
      const data = await response.json();
      const formattedCategories = data.map((category, index) => {
        let modifiedCategory = {
          id: category.id,
          name: category.name,
          img: category.image || "https://via.placeholder.com/150",
          category: category.name.toLowerCase().replace(/\s+/g, "-"),
          aosDelay: String(index * 100),
        };
        if (index === 0) {
          modifiedCategory = {
            ...modifiedCategory,
            name: "Clothes",
            img: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
            category: "c",
          };
        }
        return modifiedCategory;
      });
      setCategories(formattedCategories);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const memoizedCategories = useMemo(() => categories, [categories]);

  const handleRetry = () => {
    fetchCategories();
  };

  return (
    <div className="py-6 sm:py-10 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6">
        <h2
          className="text-2xl sm:text-3xl font-semibold mb-6 sm:mb-8 text-center text-gray-900 dark:text-gray-100"
          data-aos="fade-up"
        >
          Shop by Category
        </h2>

        {loading ? (
          <div className="text-center py-6 flex justify-center items-center">
            <FaSpinner className="animate-spin text-primary w-8 h-8" />
            <span className="ml-2 text-lg">Loading categories...</span>
          </div>
        ) : error ? (
          <div className="text-center py-6">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={handleRetry}
              className="flex items-center gap-2 mx-auto px-6 py-3 bg-primary text-white rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label="Retry fetching categories"
            >
              <FaRedo className="w-5 h-5" />
              Retry
            </button>
          </div>
        ) : memoizedCategories.length === 0 ? (
          <div className="text-center py-6 text-gray-500 dark:text-gray-400">
            No categories available at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {memoizedCategories.map((category) => (
              <Link
                key={category.id}
                to={`/shop?category=${category.category}`}
                className="relative group overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
                data-aos="fade-up"
                data-aos-delay={category.aosDelay}
                aria-label={`Shop ${category.name} category`}
              >
                <img
                  src={category.img}
                  alt={category.name}
                  className="w-full h-40 sm:h-48 md:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-center justify-center">
                  <h3 className="text-white text-lg sm:text-xl md:text-2xl font-semibold group-hover:-translate-y-1 transition-transform duration-300">
                    {category.name}
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
