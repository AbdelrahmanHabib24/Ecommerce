import footerLogo from "../../assets/logo.png";
import Banner from "../../assets/website/footer-pattern.jpg";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaLocationArrow,
  FaMobileAlt,
} from "react-icons/fa";

// Background style for the footer
const BannerImg = {
  backgroundImage: `url(${Banner})`,
  backgroundPosition: "bottom",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  height: "100%",
  width: "100%",
};

// Footer links data
const FooterLinks = [
  { title: "Home", link: "/#" },
  { title: "About", link: "/#about" },
  { title: "Contact", link: "/#contact" },
  { title: "Blog", link: "/#blog" },
];

const Footer = () => {
  return (
    <div style={BannerImg} className="text-white">
      <div className="container">
        <div className="grid md:grid-cols-3 pb-44 pt-5">
          {/* Company Details */}
          <div
            className="py-8 px-4"
            data-aos="fade-up"
            data-aos-delay="100"
            data-aos-duration="800"
          >
            <h1 className="sm:text-3xl text-xl font-bold sm:text-left text-justify mb-3 flex items-center gap-3">
              <img src={footerLogo} alt="Shopsy Logo" className="max-w-[50px]" />
              Shopsy
            </h1>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum in
              beatae ea recusandae blanditiis veritatis.
            </p>
          </div>

          {/* Footer Links */}
          <div className="grid grid-cols-2 sm:grid-cols-3 col-span-2 md:pl-10">
            {/* Important Links */}
            <div
              className="py-8 px-4"
              data-aos="fade-up"
              data-aos-delay="300"
              data-aos-duration="800"
            >
              <h1 className="sm:text-xl text-xl font-bold sm:text-left text-justify mb-3">
                Important Links
              </h1>
              <ul className="flex flex-col gap-3">
                {FooterLinks.map((link, index) => (
                  <li
                    className="cursor-pointer hover:text-primary hover:translate-x-1 duration-300 text-gray-200"
                    key={link.title}
                    data-aos="fade-right"
                    data-aos-delay={String(400 + index * 100)} // Staggered delay for each link
                    data-aos-duration="800"
                  >
                    <a href={link.link}>{link.title}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Links */}
            <div
              className="py-8 px-4"
              data-aos="fade-up"
              data-aos-delay="500"
              data-aos-duration="800"
            >
              <h1 className="sm:text-xl text-xl font-bold sm:text-left text-justify mb-3">
                Links
              </h1>
              <ul className="flex flex-col gap-3">
                {FooterLinks.map((link, index) => (
                  <li
                    className="cursor-pointer hover:text-primary hover:translate-x-1 duration-300 text-gray-200"
                    key={link.title}
                    data-aos="fade-right"
                    data-aos-delay={String(600 + index * 100)} // Staggered delay for each link
                    data-aos-duration="800"
                  >
                    <a href={link.link}>{link.title}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social Links and Contact Info */}
            <div
              className="py-8 px-4"
              data-aos="fade-up"
              data-aos-delay="700"
              data-aos-duration="800"
            >
              <div className="flex items-center gap-3 mt-6">
                {[
                  { Icon: FaInstagram, href: "#" },
                  { Icon: FaFacebook, href: "#" },
                  { Icon: FaLinkedin, href: "#" },
                ].map(({ Icon, href }, index) => (
                  <a
                    href={href}
                    key={index}
                    data-aos="zoom-in"
                    data-aos-delay={String(800 + index * 100)} // Staggered delay for each icon
                    data-aos-duration="800"
                  >
                    <Icon className="text-3xl" />
                  </a>
                ))}
              </div>
              <div className="mt-6">
                <div
                  className="flex items-center gap-3"
                  data-aos="fade-up"
                  data-aos-delay="1100"
                  data-aos-duration="800"
                >
                  <FaLocationArrow />
                  <p>Noida, Uttar Pradesh</p>
                </div>
                <div
                  className="flex items-center gap-3 mt-3"
                  data-aos="fade-up"
                  data-aos-delay="1200"
                  data-aos-duration="800"
                >
                  <FaMobileAlt />
                  <p>+91 123456789</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;