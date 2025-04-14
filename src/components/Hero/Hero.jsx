import { useDispatch } from "react-redux";
import Image1 from "../../assets/hero/women.png";
import Image2 from "../../assets/hero/shopping.png";
import Image3 from "../../assets/hero/sale.png";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Image list for the slider
const ImageList = [
  {
    id: 1,
    img: Image1,
    title: "Up to 50% Off on Men's Wear",
    description: "Discover premium quality men's clothing at unbeatable prices.",
  },
  {
    id: 2,
    img: Image2,
    title: "30% Off on Women's Wear",
    description: "Elevate your style with our exclusive women's collection.",
  },
  {
    id: 3,
    img: Image3,
    title: "70% Off Sitewide Sale",
    description: "Shop now and enjoy massive discounts on all products.",
  },
];

// Slider settings
const sliderSettings = {
  dots: true,
  arrows: false,
  infinite: true,
  speed: 800,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 4000,
  cssEase: "ease-in-out",
  pauseOnHover: true,
  pauseOnFocus: true,
  responsive: [
    {
      breakpoint: 640,
      settings: {
        dots: false,
      },
    },
  ],
};

const Hero = () => {
  const dispatch = useDispatch();

  const handleOrderPopup = () => {
    dispatch({ type: "SET_CART_POPUP", payload: true });
  };

  return (
    <section
      className="relative overflow-hidden min-h-[550px] sm:min-h-[650px] bg-gray-100 dark:bg-gray-950 dark:text-white duration-200 flex items-center"
      aria-label="Featured Promotions"
    >
      {/* Background Shape */}
      <div
        className="h-[700px] w-[700px] bg-gradient-to-br from-primary/20 to-secondary/20 absolute -top-1/2 right-0 rounded-3xl rotate-45 -z-10 hidden lg:block"
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-0">
        <Slider {...sliderSettings}>
          {ImageList.map(({ id, img, title, description }) => (
            <div
              key={id}
              className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center"
            >
              {/* Text Section */}
              <div className="flex flex-col justify-center gap-6 pt-12 sm:pt-0 text-center sm:text-left order-2 sm:order-1 relative z-10">
                <h1
                  data-aos="fade-up"
                  data-aos-delay="100"
                  data-aos-duration="800"
                  data-aos-once="true"
                  className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-gray-900 dark:text-white"
                >
                  {title}
                </h1>
                <p
                  data-aos="fade-up"
                  data-aos-delay="300"
                  data-aos-duration="800"
                  data-aos-once="true"
                  className="text-base sm:text-lg text-gray-700 dark:text-gray-300 max-w-md"
                >
                  {description}
                </p>
                <div
                  data-aos="fade-up"
                  data-aos-delay="500"
                  data-aos-duration="800"
                  data-aos-once="true"
                >
                  <button
                    onClick={handleOrderPopup}
                    className="bg-gradient-to-r from-primary to-secondary hover:scale-105 duration-200 text-white font-medium py-3 px-8 rounded-full transition-transform focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    aria-label={`Shop ${title}`}
                  >
                    Shop Now
                  </button>
                </div>
              </div>

              {/* Image Section */}
              <div className="order-1 sm:order-2 flex justify-center">
                <div
                  data-aos="zoom-in"
                  data-aos-delay="700"
                  data-aos-duration="800"
                  data-aos-once="true"
                  className="relative z-10"
                >
                  <img
                    src={img}
                    alt={title}
                    className="w-[250px] h-[250px] sm:w-[400px] sm:h-[400px] lg:w-[450px] lg:h-[450px] object-contain mx-auto transform transition-transform duration-300 hover:scale-105"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};



export default Hero;