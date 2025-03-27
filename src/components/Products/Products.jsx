import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import ProductList from '../ProductList/ProductList';
import ProductFilters from '../ProductFilters/ProductFilters';
import ProductDetailsModal from '../ProductDetailsModal/ProductDetailsModal';
import CartPopup from '../CartPopup/CartPopup';
import WishlistPopup from '../WishlistPopup/WishlistPopup';

// إضافة تنسيقات مخصصة للرسوم المتحركة
const styles = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .animate-fadeIn {
    animation: fadeIn 0.3s ease-in-out;
  }
`;

// إضافة التنسيقات إلى الصفحة
const styleSheet = document.createElement('style');
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

const Products = ({ cart, setCart, wishlist, setWishlist, cartPopup, setCartPopup }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [ratingFilter, setRatingFilter] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const productsPerPage = 5;
  const observerRef = useRef(null);

  // دالة لتنظيف أسماء الفئات
  const cleanCategoryName = (name) => {
    if (!name || typeof name !== 'string') return 'Clothes'; // تغيير الـ fallback إلى "Miscellaneous"

    // تنظيف الاسم: إزالة المسافات الزايدة وتحويل الحروف إلى صيغة موحدة
    const cleanedName = name.trim();

    // قائمة بالفئات المعروفة (مع إضافة Clothes وMiscellaneous وإزالة Others)
    const knownCategories = ['Clothes', 'Electronics', 'Furniture', 'Shoes', 'Miscellaneous'];

    // التحقق من الأسماء الغريبة أو الأخطاء
    if (!cleanedName || cleanedName.length < 3 || /[^a-zA-Z\s]/.test(cleanedName)) {
      return 'Clothes'; // لو الاسم غريب (زي "فئة" أو يحتوي على أحرف غريبة)
    }

    // تصحيح الأسماء اللي فيها أخطاء (مثلاً "ssssShoes" تصبح "Shoes")
    if (cleanedName.toLowerCase().includes('shoes')) {
      return 'Shoes';
    }
    if (cleanedName.toLowerCase().includes('clothes')) {
      return 'Clothes';
    }

    // لو الاسم مش معروف (زي "change")، نحطه تحت "Miscellaneous"
    if (!knownCategories.some((cat) => cat.toLowerCase() === cleanedName.toLowerCase())) {
      return 'Clothes';
    }

    // تحويل الاسم إلى صيغة Title Case (مثلاً "clothes" تصبح "Clothes")
    return cleanedName
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // جلب الفئات من API
  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch('https://api.escuelajs.co/api/v1/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();

      // تنظيف أسماء الفئات
      const categoryNames = data
        .map((category) => cleanCategoryName(category.name))
        .filter((name, index, self) => self.indexOf(name) === index); // إزالة التكرار

      console.log("Cleaned Categories from API:", categoryNames);
      setCategories(['All', ...categoryNames]);
    } catch (err) {
      setError(`Failed to load categories: ${err.message}`);
    }
  }, []);

  // جلب المنتجات من API
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('https://api.escuelajs.co/api/v1/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();

      // Log raw category names to debug (من المنتجات)
      const rawCategories = data.map((product) => product.category?.name || "Miscellaneous");
      console.log("Raw Categories from Products API:", [...new Set(rawCategories)]);

      // تنظيف أسماء الفئات في المنتجات
      setProducts(
        data.map((product, index) => ({
          id: product.id,
          rawImage: product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/150',
          title: product.title,
          price: Number(product.price),
          category: cleanCategoryName(product.category?.name), // تنظيف اسم الفئة
          description: product.description,
          aosDelay: String(index * 100),
        }))
      );
      setLoading(false);
    } catch (err) {
      setError(`Failed to load products: ${err.message}`);
      setLoading(false);
    }
  }, []);

  // جلب الفئات والمنتجات عند تحميل الصفحة
  useEffect(() => {
    const loadData = async () => {
      await fetchCategories();
      await fetchProducts();
    };
    loadData();
  }, [fetchCategories, fetchProducts]);

  // معالجة المنتجات عندما تصبح مرئية باستخدام IntersectionObserver
  const formatProduct = useCallback((product) => {
    let imageUrl = product.rawImage.replace(/^\["|"\]$/g, '').trim();
    if (!imageUrl.startsWith('http') || !/\.(jpg|jpeg|png|gif|webp)$/i.test(imageUrl)) {
      imageUrl = 'https://via.placeholder.com/150';
    }

    const price = product.price;
    let rating = price > 500
      ? Math.floor(Math.random() * 2) + 4
      : price > 200
      ? Math.floor(Math.random() * 2) + 3
      : Math.floor(Math.random() * 3) + 2;

    const categoryLower = product.category.toLowerCase();
    let color = categoryLower.includes('clothes') || categoryLower.includes('fashion')
      ? ['White', 'Red', 'Blue', 'Green', 'Black'][Math.floor(Math.random() * 5)]
      : categoryLower.includes('electronics')
      ? ['Silver', 'Black', 'Grey', 'White'][Math.floor(Math.random() * 4)]
      : categoryLower.includes('furniture')
      ? ['Brown', 'Beige', 'White', 'Black'][Math.floor(Math.random() * 4)]
      : ['White', 'Red', 'Brown', 'Yellow', 'Pink'][Math.floor(Math.random() * 5)];

    const discountPercentage = Math.random() * 0.2 + 0.1;
    const originalPrice = price / (1 - discountPercentage);
    const inStock = price < 300 ? Math.random() > 0.1 : Math.random() > 0.3;

    return {
      ...product,
      img: imageUrl,
      rating,
      color,
      originalPrice,
      inStock,
    };
  }, []);

  // تصفية المنتجات بناءً على الفلاتر
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (categoryFilter !== 'All') {
      result = result.filter((product) => product.category === categoryFilter);
    }

    result = result.filter(
      (product) => product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    if (ratingFilter > 0) {
      result = result.filter((product) => {
        const formatted = formatProduct(product);
        return formatted.rating >= ratingFilter;
      });
    }

    return result.map(formatProduct);
  }, [products, categoryFilter, priceRange, ratingFilter, formatProduct]);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // إعداد IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const productId = entry.target.dataset.productId;
            setProducts((prev) =>
              prev.map((p) =>
                String(p.id) === productId && !p.img ? formatProduct(p) : p
              )
            );
          }
        });
      },
      { rootMargin: '100px' }
    );

    observerRef.current = observer;

    return () => observer.disconnect();
  }, [formatProduct]);

  const addToCart = useCallback(
    (product) => {
      setCart((prevCart) => {
        const existingItem = prevCart.find((item) => item.id === product.id);
        if (existingItem) {
          return prevCart.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          );
        }
        return [...prevCart, { ...product, quantity: 1 }];
      });
      setCartPopup(false);
    },
    [setCart, setCartPopup]
  );

  const toggleWishlist = useCallback(
    (product) => {
      setWishlist((prevWishlist) => {
        if (prevWishlist.some((item) => item.id === product.id)) {
          return prevWishlist.filter((item) => item.id !== product.id);
        }
        return [...prevWishlist, product];
      });
      setCartPopup(false);
    },
    [setWishlist, setCartPopup]
  );

  const handleViewDetails = (product) => {
    setSelectedProduct(product.img ? product : formatProduct(product));
    setShowDetailsModal(true);
  };

  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;

  return (
    <div id='Products' className="  mt-14 mb-12 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 max-w-[600px] mx-auto">
          <p data-aos="fade-up" className="text-sm text-primary">
            Top Selling Products for you
          </p>
          <h1 data-aos="fade-up" className="text-3xl font-bold">
            Products
          </h1>
          <p data-aos="fade-up" className="text-xs text-gray-500 dark:text-gray-400">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sit asperiores modi Sit asperiores modi
          </p>
        </div>

        <ProductFilters
          categories={categories}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          ratingFilter={ratingFilter}
          setRatingFilter={setRatingFilter}
        />

        <ProductList
          products={filteredProducts}
          loading={loading}
          onViewDetails={handleViewDetails}
          onAddToCart={addToCart}
          onToggleWishlist={toggleWishlist}
          wishlist={wishlist}
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
          productsPerPage={productsPerPage}
          observer={observerRef.current}
        />

        {showDetailsModal && selectedProduct && (
          <ProductDetailsModal
            product={selectedProduct}
            onClose={() => setShowDetailsModal(false)}
          />
        )}

        <CartPopup
          cartPopup={cartPopup}
          setCartPopup={setCartPopup}
          cart={cart}
          setCart={setCart}
        />
        <WishlistPopup
          wishlist={wishlist}
          setWishlist={setWishlist}
        />
      </div>
    </div>
  );
};

Products.propTypes = {
  cart: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      quantity: PropTypes.number.isRequired,
    })
  ).isRequired,
  setCart: PropTypes.func.isRequired,
  wishlist: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
    })
  ).isRequired,
  setWishlist: PropTypes.func.isRequired,
  cartPopup: PropTypes.bool.isRequired,
  setCartPopup: PropTypes.func.isRequired,
};

export default Products;