import { useEffect, useState } from "react";
import useAuth from "../Context/useAuth";
import instance from "../api/api_Instance";
import { useParams } from "react-router-dom";
import Nav from "./Nav";
import image from "../../assets/car-8514314_640.png";
import { Link } from "react-router-dom";

const SingleService = () => {
  const [service, setService] = useState({});
  const { token } = useAuth();

  const { id } = useParams();

  useEffect(() => {
    const getdata = async () => {
      try {
        const res = await instance.get(`/service/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setService(...res.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    getdata();
  }, [token, id]);

  return (
    <>
      <Nav />
      <div className="grid grid-cols-1 m-5 mr-8 md:grid-cols-2">
        <div className="grid items-center grid-cols-8 ">
          <div className="col-start-1 col-end-8">
            <img
              src={image}
              alt="Service"
              className="object-cover w-full h-full rounded-3xl"
            />
          </div>
        </div>
        <div className="mt-10">
          <h2 className="text-2xl text-wrap">{service?.service_name}</h2>
          {/* <span className="text-3xl font-bold">{priceformat(price)}</span> */}
          <div>
            <p className="text-wrap">{service?.details}</p>
          </div>
          <br />
          <hr />
          <br />
          <Link to={`/payment/${service._id}`}>
            <button className="p-3 py-2 text-white transition duration-200 ease-in-out rounded-lg shadow-md bg-violet-500 hover:bg-violet-400 px 8">
              Book Now
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default SingleService;
