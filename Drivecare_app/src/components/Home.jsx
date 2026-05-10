import Navbar from "./Nav/Nav";
import { Link } from "react-router-dom";
const Content = () => {
  return (
    <section className="py-20 text-white bg-black">
      <div className="flex flex-col items-center max-w-screen-xl px-6 mx-auto lg:flex-row">
        {/* Left Side: Text and CTA */}
        <div className="space-y-6 lg:w-1/2">
          <h1 className="text-5xl font-bold leading-tight">
            Your Vehicle <span className="text-violet-400">Deserves</span>{" "}
            <br /> The Best Care
          </h1>
          <p className="text-lg text-gray-400">
            Book car and bike services in Bangalore — washing, detailing, full
            servicing and more. Doorstep service at your parking spot.
          </p>
          <br />
          <Link
            to={"/Login"}
            className="px-6 py-3 mt-4 text-white transition rounded-full bg-violet-500 hover:bg-violet-600"
          >
            Book a Service &rarr;
          </Link>

          {/* Benefits Section */}
          <div className="flex mt-8 space-x-12">
            <div className="text-center">
              <p className="text-4xl font-bold">500+</p>
              <p className="text-sm text-gray-400">Happy Customers</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold">50+</p>
              <p className="text-sm text-gray-400">Services Available</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold">4.8</p>
              <p className="text-sm text-gray-400">Average Rating</p>
            </div>
          </div>
        </div>

        {/* Right Side: Feature Cards */}
        <div className="relative mt-12 lg:w-1/2 lg:mt-0">
          {/* Service Card */}
          <div className="flex items-center p-6 space-x-4 bg-gray-900 rounded-lg shadow-lg">
            <div className="flex items-center justify-center w-12 h-12 text-xl bg-violet-600 rounded-full">
              🚗
            </div>
            <div>
              <p className="font-semibold">Doorstep Service</p>
              <p className="text-sm text-gray-400">
                We come to your parking spot
              </p>
            </div>
          </div>

          {/* Testimonial */}
          <div className="absolute right-0 p-4 text-white rounded-lg shadow-lg top-36 bg-violet-500">
            <p>
              &quot;My car looks brand new after every wash. Super convenient
              doorstep service!&quot;
            </p>
            <p className="mt-2 font-semibold">Rahul K.</p>
            <p className="text-sm text-gray-200">Bangalore</p>
          </div>

          {/* Feature Card */}
          <div className="flex items-center p-4 mt-48 space-x-4 bg-gray-800 rounded-full">
            <span className="text-gray-400">
              Cars &bull; Bikes &bull; Washing &bull; Detailing &bull; Servicing
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

const Home = () => {
  return (
    <div>
      <Navbar />
      <Content />
    </div>
  );
};

export default Home;
