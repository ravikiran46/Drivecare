import Navbar from "./Nav/Nav";
import { Link } from "react-router-dom";
const Content = () => {
  return (
    <section className="py-20 text-white bg-black">
      <div className="flex flex-col items-center max-w-screen-xl px-6 mx-auto lg:flex-row">
        {/* Left Side: Text and CTA */}
        <div className="space-y-6 lg:w-1/2">
          <h1 className="text-5xl font-bold leading-tight">
            Deposit <span className="text-gray-300">Crypto</span> <br /> Earn
            Fast
          </h1>
          <p className="text-lg text-gray-400">
            Buy and sell 100+ cryptocurrencies with 20+ fiat currencies using
            Net Banking or your Credit/Debit Card.
          </p>
          <br />
          <Link
            to={"/login"}
            className="px-6 py-3 mt-4 text-white transition rounded-full bg-violet-500 hover:bg-violet-600"
          >
            Get Started &rarr;
          </Link>

          {/* Benefits Section */}
          <div className="flex mt-8 space-x-12">
            <div className="text-center">
              <p className="text-4xl font-bold">10%</p>
              <p className="text-sm text-gray-400">Discount on Crypto</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold">14%</p>
              <p className="text-sm text-gray-400">Growth Estimate</p>
            </div>
          </div>
        </div>

        {/* Right Side: Crypto Card */}
        <div className="relative mt-12 lg:w-1/2 lg:mt-0">
          {/* Crypto Card */}
          <div className="flex items-center p-6 space-x-4 bg-gray-900 rounded-lg shadow-lg">
            <div className="p-4 bg-gray-800 rounded-full"></div>
            <div>
              <p className="font-semibold">Ethereum CY</p>
              <p className="text-sm text-gray-400">8.82041 ETH</p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-red-500">- $1356 (14%)</p>
            </div>
          </div>

          {/* Chat Box */}
          <div className="absolute right-0 p-4 text-white rounded-lg shadow-lg top-36 bg-violet-500">
            <p>
              You are all doing an incredible job, LOVE IT. Keep the good work
              🎉👏
            </p>
            <p className="mt-2 font-semibold">Brandon Wrangler</p>
            <p className="text-sm text-gray-200">Crypto Buyer</p>
          </div>

          {/* Ask Anything Box */}
          <div className="flex items-center p-4 mt-48 space-x-4 bg-gray-800 rounded-full ">
            <span className="text-gray-400">Ask Anything...</span>
            <button className="text-white hover:text-violet-500">😊</button>
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
