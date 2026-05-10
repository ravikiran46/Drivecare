import { useEffect, useState } from "react";
import instance from "../api/api_Instance";
import useAuth from "../Context/useAuth";
import { GiFlatTire } from "react-icons/gi";
import { Link } from "react-router-dom";

const Hero = () => {
  const [Services, setServices] = useState([]);
  const { token } = useAuth();
  useEffect(() => {
    const getservices = async () => {
      try {
        const res = await instance.get("/service", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setServices(res.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    getservices();
  }, [token]);
  return (
    <div className="grid grid-cols-2 gap-4 p-4 mt-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 ">
      {Services.map((service) => (
        <Link to={`/service/${service._id}`} key={service._id}>
          <div className="flex flex-col items-center justify-between w-full p-4 border border-gray-200 rounded-lg shadow-md h-36">
            <GiFlatTire className="mb-auto w-14 h-14" />
            <div className="mt-2 text-sm break-words text-wrap">
              {service?.service_name}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Hero;
