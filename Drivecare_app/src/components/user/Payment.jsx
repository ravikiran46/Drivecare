import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import instance from "../api/api_Instance";
import useAuth from "../Context/useAuth";
import Nav from "./Nav";
import useDataContext from "../Context/useDataContext";
import Card from "./components/Card";
const Payment = () => {
  const [Service, setService] = useState([]);
  const { vehicle_data, address_data } = useDataContext();
  const { id } = useParams();
  const { token } = useAuth();
  useEffect(() => {
    const getdata = async () => {
      try {
        // fetch service after booking
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
      <div className="m-5">
        <div className="">
          <Card
            Service={Service}
            vehicle_data={vehicle_data}
            address_data={address_data}
          />
        </div>
      </div>
    </>
  );
};

export default Payment;
