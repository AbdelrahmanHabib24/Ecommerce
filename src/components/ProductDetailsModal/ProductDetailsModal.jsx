import PropTypes from 'prop-types';

const ProductDetailsModal = ({ product, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 sm:p-0">
      <div className="bg-white dark:bg-gray-800 p-4 sm:p-8 rounded-lg shadow-2xl w-full max-w-[90%] sm:max-w-md text-gray-900 dark:text-gray-100">
        <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">Product Details</h3>
        <div className="space-y-3 sm:space-y-4">
          <img
            src={product.img}
            alt={product.title}
            className="h-[120px] sm:h-[150px] w-[80px] sm:w-[100px] object-cover rounded-md mx-auto"
          />
          <p className="text-sm sm:text-base">
            <strong>Title:</strong> {product.title}
          </p>
          <p className="text-sm sm:text-base">
            <strong>Price:</strong> ${product.price.toFixed(2)}
          </p>
          <p className="text-sm sm:text-base">
            <strong>Category:</strong> {product.category}
          </p>
          <p className="text-sm sm:text-base">
            <strong>Rating:</strong> {product.rating} / 5
          </p>
          <p className="text-sm sm:text-base">
            <strong>Description:</strong> {product.description}
          </p>
        </div>
        <div className="flex justify-end mt-4 sm:mt-6">
          <button
            onClick={onClose}
            className="px-3 py-1 sm:px-4 sm:py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm sm:text-base"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

ProductDetailsModal.propTypes = {
  product: PropTypes.shape({
    img: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    category: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ProductDetailsModal;