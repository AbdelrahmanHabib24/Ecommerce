/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "@/redux/slices/cartSlice";
import { toast } from "react-toastify";
import CartPopup from "@/components/shared/CartPopup";
import Pagination from "@/components/shared/Pagination";
import ProductCard from "@/components/product/ProductCard";
import LazyImage from "@/components/shared/LazyImage";
import { setCategory, setSortBy } from "@/redux/slices/filterSlice";
import AOS from "aos";
import "aos/dist/aos.css";

// Constants
const ProductList = ({ products }) => {
  const dispatch = useDispatch();
  const { selectedCategory } = useSelector((state) => state.filters);
  const [showPopup, setShowPopup] = useState(false);
  const [popupProduct, setPopupProduct] = useState(null);
  const [sortOption, setSortOption] = useState("default");
  const [paginationMode, setPaginationMode] = useState("pagination");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(12);
  const [visibleProducts, setVisibleProducts] = useState(productsPerPage);

  // Initialize AOS
  useEffect(() => {
    AOS.init({ duration: 800, easing: "ease-in-out", once: true });
  }, []);

  // Normalize product images
  const normalizedProducts = useMemo(
    () =>
      products.map((product) => ({
        ...product,
        img: product.img || product.image,
      })),
    [products]
  );

  // Filter products by category
  const filteredProducts = useMemo(
    () =>
      selectedCategory === ""
        ? normalizedProducts
        : normalizedProducts.filter(
            (p) => p.category?.toLowerCase() === selectedCategory.toLowerCase()
          ),
    [normalizedProducts, selectedCategory]
  );

  // Sort products
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];
    if (sortOption === "price-asc") sorted.sort((a, b) => a.price - b.price);
    else if (sortOption === "price-desc") sorted.sort((a, b) => b.price - a.price);
    else if (sortOption === "rating") sorted.sort((a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0));
    return sorted;
  }, [filteredProducts, sortOption]);

  // Paginate or infinite scroll products
  const paginatedProducts = useMemo(() => {
    if (paginationMode === "pagination") {
      const start = (currentPage - 1) * productsPerPage;
      return sortedProducts.slice(start, start + productsPerPage);
    }
    return sortedProducts.slice(0, visibleProducts);
  }, [sortedProducts, currentPage, productsPerPage, paginationMode, visibleProducts]);

  // Handlers
  const handleAddToCart = (product) => {
    const normalizedProduct = { ...product };
    dispatch(addToCart(normalizedProduct));
    setPopupProduct(normalizedProduct);
    setShowPopup(true);
    toast.success(`${product.title} تمت إضافته إلى السلة.`);
  };

  const handleSortChange = (e) => {
    const selected = e.target.value;
    setSortOption(selected);
    dispatch(setSortBy(selected));
  };

  const handleCategoryChange = (e) => dispatch(setCategory(e.target.value));

  const handlePaginationModeChange = (e) => setPaginationMode(e.target.value);

  const handleProductsPerPageChange = (e) => {
    setProductsPerPage(parseInt(e.target.value, 10));
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Infinite scroll effect
  useEffect(() => {
    if (paginationMode !== "infinite") return;

    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 100 >=
        document.documentElement.scrollHeight
      ) {
        setVisibleProducts((prev) => prev + productsPerPage);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [paginationMode, productsPerPage]);

  return (
    <div className="py-4 sm:py-8 px-2 sm:px-4 container mx-auto">
      {/* Filters Section */}
      <div
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6 bg-gray-100 dark:bg-gray-800 p-3 sm:p-4 rounded-lg shadow-md"
        data-aos="fade-down"
        data-aos-delay="50"
        data-aos-duration="800"
        data-aos-once="true"
      >
        <div className="w-full sm:w-auto">
          <label
            htmlFor="category"
            className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            التصنيف:
          </label>
          <select
            id="category"
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="w-full sm:w-40 px-2 py-1 sm:px-3 sm:py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm sm:text-base"
            data-aos="fade-down"
            data-aos-delay="150"
            data-aos-duration="800"
          >
            <option value="">كل التصنيفات</option>
            <option value="electronics">الكترونيات</option>
            <option value="jewelery">مجوهرات</option>
            <option value="men's clothing">ملابس رجالي</option>
            <option value="women's clothing">ملابس حريمي</option>
          </select>
        </div>

        <div className="w-full sm:w-auto">
          <label
            htmlFor="sort"
            className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            الترتيب:
          </label>
          <select
            id="sort"
            value={sortOption}
            onChange={handleSortChange}
            className="w-full sm:w-48 px-2 py-1 sm:px-3 sm:py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm sm:text-base"
            data-aos="fade-down"
            data-aos-delay="250"
            data-aos-duration="800"
          >
            <option value="default">الافتراضي</option>
            <option value="price-asc">السعر: من الأقل للأعلى</option>
            <option value="price-desc">السعر: من الأعلى للأقل</option>
            <option value="rating">الأعلى تقييماً</option>
          </select>
        </div>

        <div className="w-full sm:w-auto">
          <label
            htmlFor="paginationMode"
            className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            وضع الصفحات:
          </label>
          <select
            id="paginationMode"
            value={paginationMode}
            onChange={handlePaginationModeChange}
            className="w-full sm:w-40 px-2 py-1 sm:px-3 sm:py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm sm:text-base"
            data-aos="fade-down"
            data-aos-delay="350"
            data-aos-duration="800"
          >
            <option value="pagination">تقسيم الصفحات</option>
            <option value="infinite">تمرير لا نهائي</option>
          </select>
        </div>

        <div className="w-full sm:w-auto">
          <label
            htmlFor="productsPerPage"
            className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            عدد المنتجات لكل صفحة:
          </label>
          <select
            id="productsPerPage"
            value={productsPerPage}
            onChange={handleProductsPerPageChange}
            className="w-full sm:w-24 px-2 py-1 sm:px-3 sm:py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm sm:text-base"
            data-aos="fade-down"
            data-aos-delay="450"
            data-aos-duration="800"
          >
            <option value={6}>6</option>
            <option value={12}>12</option>
            <option value={24}>24</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
        data-aos="fade-up"
        data-aos-delay="150"
        data-aos-duration="800"
        data-aos-once="true"
      >
        {paginatedProducts.length > 0 ? (
          paginatedProducts.map((product, index) => (
            <div
              key={product.id}
              data-aos="fade-up"
              data-aos-delay={String(200 + index * 100)}
              data-aos-duration="800"
              data-aos-once="true"
            >
              <ProductCard product={product} LazyImage={LazyImage} onAddToCart={handleAddToCart} />
            </div>
          ))
        ) : (
          <div
            className="col-span-full text-center py-6"
            data-aos="fade-up"
            data-aos-delay="150"
            data-aos-duration="800"
            data-aos-once="true"
          >
            <p className="text-gray-500 text-sm sm:text-base">لا توجد منتجات تطابق هذا التصنيف.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {paginationMode === "pagination" && sortedProducts.length > 0 && (
        <div
          className="mt-4 sm:mt-6"
          data-aos="fade-up"
          data-aos-delay="600"
          data-aos-duration="800"
          data-aos-once="true"
        >
          <Pagination
            currentPage={currentPage}
            productsPerPage={productsPerPage}
            totalProducts={sortedProducts.length}
            paginate={handlePageChange}
          />
        </div>
      )}

      {/* Cart Popup */}
      {showPopup && popupProduct && (
        <div
          data-aos="zoom-in"
          data-aos-delay="50"
          data-aos-duration="800"
          data-aos-once="true"
        >
          <CartPopup product={popupProduct} onClose={() => setShowPopup(false)} />
        </div>
      )}
    </div>
  );
};

export default ProductList;