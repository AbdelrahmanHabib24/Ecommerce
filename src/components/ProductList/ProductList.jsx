/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import ProductCard from '../ProductCard/ProductCard';
import InfiniteScroll from 'react-infinite-scroll-component';

// مكون فرعي لعرض الـ Pagination
const Pagination = ({ currentPage, totalPages, setCurrentPage }) => {
  const maxPagesToShow = window.innerWidth < 640 ? 3 : 5; // 3 أزرار على الموبايل، 5 على الشاشات الأكبر
  const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

  const pages = Array.from(
    { length: endPage - startPage + 1 },
    (_, index) => startPage + index
  );

  return (
    <div className="flex justify-center mt-4 sm:mt-6 space-x-1 sm:space-x-2">
      {/* زر Previous */}
      <button
        onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
        disabled={currentPage === 1}
        className={`px-2 py-1 sm:px-3 sm:py-1 rounded-md font-medium transition-colors text-xs sm:text-sm ${
          currentPage === 1
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
        } dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:border-gray-600`}
      >
        Previous
      </button>

      {/* الصفحة الأولى ونقاط التمدد إذا لزم الأمر */}
      {startPage > 1 && (
        <>
          <button
            onClick={() => setCurrentPage(1)}
            className="px-2 py-1 sm:px-3 sm:py-1 rounded-md text-xs sm:text-sm bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:border-gray-600"
          >
            1
          </button>
          {startPage > 2 && (
            <span className="px-2 py-1 text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
              ...
            </span>
          )}
        </>
      )}

      {/* أزرار الصفحات */}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => setCurrentPage(page)}
          className={`px-2 py-1 sm:px-3 sm:py-1 rounded-md font-medium transition-colors text-xs sm:text-sm ${
            currentPage === page
              ? 'bg-primary text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:border-gray-600'
          }`}
        >
          {page}
        </button>
      ))}

      {/* الصفحة الأخيرة ونقاط التمدد إذا لزم الأمر */}
      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && (
            <span className="px-2 py-1 text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
              ...
            </span>
          )}
          <button
            onClick={() => setCurrentPage(totalPages)}
            className="px-2 py-1 sm:px-3 sm:py-1 rounded-md text-xs sm:text-sm bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:border-gray-600"
          >
            {totalPages}
          </button>
        </>
      )}

      {/* زر Next */}
      <button
        onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
        disabled={currentPage === totalPages}
        className={`px-2 py-1 sm:px-3 sm:py-1 rounded-md font-medium transition-colors text-xs sm:text-sm ${
          currentPage === totalPages
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
        } dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:border-gray-600`}
      >
        Next
      </button>
    </div>
  );
};

// مكون ProductList الرئيسي
const ProductList = ({
  products,
  loading,
  onViewDetails,
  onAddToCart,
  onToggleWishlist,
  wishlist,
  currentPage,
  totalPages,
  setCurrentPage,
  productsPerPage,
  observer,
}) => {
  const [displayedProductsCount, setDisplayedProductsCount] = useState(productsPerPage);
  const [useInfiniteScroll, setUseInfiniteScroll] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(productsPerPage);
  const [filteredProducts, setFilteredProducts] = useState(products);
  const observerRef = useRef(observer);

  // إعداد IntersectionObserver إذا لم يتم تمريره
  useEffect(() => {
    if (!observer) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // يمكن إضافة منطق هنا إذا لزم الأمر
            }
          });
        },
        { rootMargin: '100px' }
      );
    }
    return () => {
      if (!observer && observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [observer]);

  // تحديث filteredProducts عند تغيير products مع تحقق من البيانات
  useEffect(() => {
    const validProducts = products.map((product) => ({
      ...product,
      img: product.img && product.img !== '' ? product.img : 'https://via.placeholder.com/150?text=Image+Not+Found',
    }));
    setFilteredProducts(validProducts);
  }, [products]);

  // المنتجات المعروضة بناءً على التقسيم أو التمرير اللانهائي
  const paginatedProducts = useInfiniteScroll
    ? filteredProducts.slice(0, displayedProductsCount)
    : filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // إعادة حساب totalPages بناءً على filteredProducts
  const updatedTotalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // دالة لتحميل المزيد من المنتجات عند التمرير اللانهائي
  const loadMore = useCallback(() => {
    setDisplayedProductsCount((prev) => prev + itemsPerPage);
  }, [itemsPerPage]);

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* خيارات العرض */}
      <div className="flex flex-col sm:flex-row justify-center items-center mb-6 space-y-4 sm:space-y-0 sm:space-x-60">
        <div className="flex items-center">
          <label className="text-gray-700 dark:text-gray-300 mr-2">
            Products per page:
          </label>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="px-3 py-1 rounded-md border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>
        <div className="flex items-center">
          <label className="text-gray-700 dark:text-gray-300 mr-2">
            Display Mode:
          </label>
          <select
            value={useInfiniteScroll ? 'infinite' : 'pagination'}
            onChange={(e) => {
              setUseInfiniteScroll(e.target.value === 'infinite');
              setCurrentPage(1);
              setDisplayedProductsCount(itemsPerPage);
            }}
            className="px-3 py-1 rounded-md border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          >
            <option value="pagination">Pagination</option>
            <option value="infinite">Infinite Scroll</option>
          </select>
        </div>
      </div>

      {/* قائمة المنتجات */}
      {loading ? (
        <div className="text-center py-10">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em]"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Loading products...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-10 text-gray-600 dark:text-gray-400">
          No products found. Try adjusting your filters.
        </div>
      ) : useInfiniteScroll ? (
        <InfiniteScroll
          dataLength={paginatedProducts.length}
          next={loadMore}
          hasMore={paginatedProducts.length < filteredProducts.length}
          loader={
            <div className="text-center py-4">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em]"></div>
            </div>
          }
          endMessage={
            <p className="text-center py-4 text-gray-600 dark:text-gray-400">
              No more products to load.
            </p>
          }
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 place-items-center gap-6">
            {paginatedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={onViewDetails}
                onAddToCart={onAddToCart}
                onToggleWishlist={onToggleWishlist}
                wishlist={wishlist}
                observer={observer || observerRef.current}
              />
            ))}
          </div>
        </InfiniteScroll>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 place-items-center gap-6">
          {paginatedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onViewDetails={onViewDetails}
              onAddToCart={onAddToCart}
              onToggleWishlist={onToggleWishlist}
              wishlist={wishlist}
              observer={observer || observerRef.current}
            />
          ))}
        </div>
      )}

      {/* الـ Pagination أو زر View All */}
      {!useInfiniteScroll && updatedTotalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={updatedTotalPages}
          setCurrentPage={setCurrentPage}
        />
      )}

      {/* زر View All Products */}
      {!useInfiniteScroll && filteredProducts.length > itemsPerPage && (
        <div className="flex justify-center mt-4 sm:mt-6">
          <button
            onClick={() => setItemsPerPage(filteredProducts.length)}
            className="text-center px-4 py-1 sm:px-5 sm:py-2 bg-primary text-white rounded-md hover:bg-blue-600 transition-colors text-sm sm:text-base font-medium"
          >
            View All Products
          </button>
        </div>
      )}
    </div>
  );
};

// PropTypes لمكون Pagination
Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  setCurrentPage: PropTypes.func.isRequired,
};

// PropTypes لمكون ProductList
ProductList.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      img: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      rating: PropTypes.number.isRequired,
      color: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      originalPrice: PropTypes.number.isRequired,
      inStock: PropTypes.bool.isRequired,
      category: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      aosDelay: PropTypes.string.isRequired,
    })
  ).isRequired,
  loading: PropTypes.bool.isRequired,
  onViewDetails: PropTypes.func.isRequired,
  onAddToCart: PropTypes.func.isRequired,
  onToggleWishlist: PropTypes.func.isRequired,
  wishlist: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
    })
  ).isRequired,
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  setCurrentPage: PropTypes.func.isRequired,
  productsPerPage: PropTypes.number.isRequired,
  observer: PropTypes.instanceOf(IntersectionObserver),
};

export default ProductList;