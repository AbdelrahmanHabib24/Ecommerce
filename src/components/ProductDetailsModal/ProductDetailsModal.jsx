/* eslint-disable react/prop-types */
import { useEffect, useRef } from 'react';
import 'aos/dist/aos.css';

const capitalize = (str) => (typeof str === 'string' ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : '');

const ProductDetailsModal = ({ product, onClose }) => {
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);

  // Initialize AOS
 

  // Focus management and key handling
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'Tab') {
        // Trap focus within the modal
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    // Set initial focus to the modal
    modalRef.current.focus();
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  if (!product) return null;

  const image = product.image || 'https://via.placeholder.com/100';
  const title = product.title || 'Untitled Product';
  const price = Number(product.price) || 0;
  const category = capitalize(product.category || 'Uncategorized');
  const description = product.description || 'No description available.';

  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center p-4 sm:p-0 transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="bg-white dark:bg-gray-800 p-4 sm:p-8 rounded-lg shadow-2xl w-full max-w-[90%] sm:max-w-md text-gray-900 dark:text-gray-100 transform transition-all duration-300 scale-100"
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
        role="dialog"
        aria-labelledby="product-details-title"
        aria-modal="true"
        data-aos="zoom-in"
        data-aos-delay="50"
        data-aos-duration="800"
        data-aos-once="true"
      >
        <h3
          id="product-details-title"
          className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6"
          data-aos="fade-down"
          data-aos-delay="150"
          data-aos-duration="800"
          data-aos-once="true"
        >
          Product Details
        </h3>
        <div className="space-y-3 sm:space-y-4">
          <div
            className="flex justify-center"
            data-aos="fade-up"
            data-aos-delay="250"
            data-aos-duration="800"
            data-aos-once="true"
          >
            <img
              src={image}
              alt={title}
              className="h-[120px] sm:h-[150px] w-[80px] sm:w-[100px] object-contain rounded-md"
              onError={(e) => (e.target.src = 'https://via.placeholder.com/100')}
            />
          </div>
          <p
            className="text-sm sm:text-base"
            data-aos="fade-up"
            data-aos-delay="350"
            data-aos-duration="800"
            data-aos-once="true"
          >
            <strong>Title:</strong> {title}
          </p>
          <p
            className="text-sm sm:text-base"
            data-aos="fade-up"
            data-aos-delay="450"
            data-aos-duration="800"
            data-aos-once="true"
          >
            <strong>Price:</strong> ${price.toFixed(2)}
          </p>
          <p
            className="text-sm sm:text-base"
            data-aos="fade-up"
            data-aos-delay="550"
            data-aos-duration="800"
            data-aos-once="true"
          >
            <strong>Category:</strong> {category}
          </p>
          <p
            className="text-sm sm:text-base"
            data-aos="fade-up"
            data-aos-delay="650"
            data-aos-duration="800"
            data-aos-once="true"
          >
            <strong>Description:</strong> {description}
          </p>
        </div>
        <div
          className="flex justify-end mt-4 sm:mt-6"
          data-aos="fade-up"
          data-aos-delay="750"
          data-aos-duration="800"
          data-aos-once="true"
        >
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="px-3 py-1 sm:px-4 sm:py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 text-sm sm:text-base transition-colors duration-200"
            aria-label="Close product details modal"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};



export default ProductDetailsModal;