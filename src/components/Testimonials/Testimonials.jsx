import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const TestimonialData = [
  {
    id: 1,
    name: "Victor",
    text: "Exceptional quality and fast delivery! This store has become my go-to for all shopping needs.",
    img: "https://picsum.photos/101/101",
  },
  {
    id: 2,
    name: "Satya Nadella",
    text: "Outstanding customer service and a fantastic selection of products. Highly recommended!",
    img: "https://picsum.photos/102/102",
  },
  {
    id: 3,
    name: "Virat Kohli",
    text: "The best online shopping experience I've had. Great deals and reliable shipping.",
    img: "https://picsum.photos/104/104",
  },
  {
    id: 4, // Fixed duplicate ID
    name: "Sachin Tendulkar",
    text: "Amazing variety and unbeatable prices. Shopping here is always a pleasure!",
    img: "https://picsum.photos/103/103",
  },
];

const Testimonials = () => {
  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000, // Increased for better readability
    cssEase: "ease-in-out", // Changed to smoother transition
    pauseOnHover: true,
    pauseOnFocus: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <p 
            data-aos="fade-up" 
            className="text-sm text-primary font-medium mb-2"
          >
            What Our Customers Are Saying
          </p>
          <h2 
            data-aos="fade-up" 
            data-aos-delay="100"
            className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white"
          >
            Testimonials
          </h2>
          <p 
            data-aos="fade-up" 
            data-aos-delay="200"
            className="text-sm text-gray-600 dark:text-gray-400 mt-4"
          >
            Hear from our satisfied customers about their shopping experiences
          </p>
        </div>

        {/* Testimonial Slider */}
        <div data-aos="zoom-in" data-aos-delay="300">
          <Slider {...settings}>
            {TestimonialData.map((data) => (
              <div key={data.id} className="px-3 py-6">
                <div className="flex flex-col gap-6 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 h-full relative overflow-hidden transition-all duration-300 hover:shadow-lg">
                  {/* Quote Icon */}
                  <span className="text-6xl text-primary/10 absolute top-2 right-2 font-serif">“</span>
                  
                  {/* Avatar */}
                  <div className="flex justify-center">
                    <img
                      src={data.img}
                      alt={`${data.name}'s avatar`}
                      className="w-16 h-16 rounded-full object-cover border-2 border-primary/20"
                      loading="lazy"
                    />
                  </div>

                  {/* Content */}
                  <div className="text-center space-y-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                      {data.text}
                    </p>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {data.name}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;