/* eslint-disable react/no-unescaped-entities */
export default function NotFound() {
  return (
    <div
      className="flex flex-col items-center justify-center py-20 text-center px-4 sm:px-0"
      data-aos="fade-up"
      data-aos-delay="100"
    >
      <h2 className="text-xl sm:text-2xl font-bold mb-2">
        404 - Page Not Found
      </h2>
      <p className="text-gray-500">
        The page you're looking for doesn't exist.
      </p>
    </div>
  );
}
