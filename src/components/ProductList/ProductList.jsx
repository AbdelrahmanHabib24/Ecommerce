/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "@/redux/slices/cartSlice";
import { setCategory, setSortBy } from "@/redux/slices/filterSlice";
import { toast } from "react-toastify";
import CartPopup from "@/components/shared/CartPopup";
import Pagination from "@/components/shared/Pagination";
import ProductCard from "@/components/product/ProductCard";
import LazyImage from "@/components/shared/LazyImage";
import AOS from "aos";
import "aos/dist/aos.css";

const ProductList = ({ products }) => {
  const dispatch = useDispatch();
  const { selectedCategory } = useSelector((state) => state.filters);
  const [popupProduct, setPopupProduct] = useState(null);
  const [sortOption, setSortOption] = useState("default");
  const [paginationMode, setPaginationMode] = useState("pagination");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(12);
  const [visibleProducts, setVisibleProducts] = useState(12);

  // Init AOS
  useEffect(() => {
    AOS.init({ duration: 800, easing: "ease-in-out", once: true });
  }, []);

  const processedProducts = useMemo(() => {
    let result = products.map((p) => ({ ...p, img: p.img || p.image }));

    if (selectedCategory) {
      result = result.filter(
        (p) => p.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (sortOption === "price-asc") result.sort((a, b) => a.price - b.price);
    if (sortOption === "price-desc") result.sort((a, b) => b.price - a.price);
    if (sortOption === "rating")
      result.sort((a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0));

    return result;
  }, [products, selectedCategory, sortOption]);

  const paginatedProducts = useMemo(() => {
    if (paginationMode === "pagination") {
      const start = (currentPage - 1) * productsPerPage;
      return processedProducts.slice(start, start + productsPerPage);
    }
    return processedProducts.slice(0, visibleProducts);
  }, [processedProducts, paginationMode, currentPage, productsPerPage, visibleProducts]);

  // Handlers
  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    setPopupProduct(product);
    toast.success(`${product.title} added to cart.`);
  };

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 100 >=
      document.documentElement.scrollHeight
    ) {
      setVisibleProducts((prev) => prev + productsPerPage);
    }
  };

  useEffect(() => {
    if (paginationMode !== "infinite") return;
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [paginationMode, productsPerPage]);

  return (
    <div className="py-4 sm:py-8 px-2 sm:px-4 container mx-auto">
      {/* Filters */}
      <div
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-6 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md"
        data-aos="fade-down"
      >
        <Filter
          label="Category"
          value={selectedCategory}
          onChange={(e) => dispatch(setCategory(e.target.value))}
          options={[
            { value: "", label: "All Categories" },
            { value: "electronics", label: "Electronics" },
            { value: "jewelery", label: "Jewelery" },
            { value: "men's clothing", label: "Men's Clothing" },
            { value: "women's clothing", label: "Women's Clothing" },
          ]}
        />
        <Filter
          label="Sort By"
          value={sortOption}
          onChange={(e) => {
            setSortOption(e.target.value);
            dispatch(setSortBy(e.target.value));
          }}
          options={[
            { value: "default", label: "Default" },
            { value: "price-asc", label: "Price: Low to High" },
            { value: "price-desc", label: "Price: High to Low" },
            { value: "rating", label: "Top Rated" },
          ]}
        />
        <Filter
          label="Display Mode"
          value={paginationMode}
          onChange={(e) => setPaginationMode(e.target.value)}
          options={[
            { value: "pagination", label: "Pagination" },
            { value: "infinite", label: "Infinite Scroll" },
          ]}
        />
        <Filter
          label="Products per Page"
          value={productsPerPage}
          onChange={(e) => {
            setProductsPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
          options={[
            { value: 6, label: "6" },
            { value: 12, label: "12" },
            { value: 24, label: "24" },
          ]}
        />
      </div>

      {/* Products */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6" data-aos="fade-up">
        {paginatedProducts.length > 0 ? (
          paginatedProducts.map((product, i) => (
            <div
              key={product.id}
              data-aos="fade-up"
              data-aos-delay={String(200 + i * 100)}
            >
              <ProductCard
                product={product}
                LazyImage={LazyImage}
                onAddToCart={handleAddToCart}
              />
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-6 text-gray-500">
            No products found.
          </div>
        )}
      </div>

      {/* Pagination */}
      {paginationMode === "pagination" && processedProducts.length > 0 && (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            productsPerPage={productsPerPage}
            totalProducts={processedProducts.length}
            paginate={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        </div>
      )}

      {/* Cart Popup */}
      {popupProduct && (
        <CartPopup product={popupProduct} onClose={() => setPopupProduct(null)} />
      )}
    </div>
  );
};

// Filter component
const Filter = ({ label, value, onChange, options }) => (
  <div className="w-full sm:w-auto">
    <label
      htmlFor={label}
      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
    >
      {label}:
    </label>
    <select
      id={label}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

export default ProductList;
