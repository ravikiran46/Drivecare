import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import useAuth from "./useAuth";
import instance from "../api/api_Instance";

export const DataContext = createContext();

export default function DataProvider({ children }) {
  const [vehicle_data, setvehicle_data] = useState([]);
  const [address_data, setaddress_data] = useState([]);
  const [v_loading, setv_loading] = useState(true);
  const [a_loading, seta_loading] = useState(true);

  const { token } = useAuth();

  const setvehicle_info = (data) => {
    setvehicle_data(data);
  };

  const setaddress_info = (data) => {
    setaddress_data(data);
  };
  const getVehicles = async () => {
    setv_loading(true);
    try {
      const res = await instance.get("/vehicle", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setvehicle_info(res.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setv_loading(false);
    }
  };

  const fetchAddresses = async () => {
    seta_loading(true);
    try {
      const res = await instance.get("/address", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setaddress_info(res.data.data);
      seta_loading(false);
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };
  useEffect(() => {
    if (token) {
      getVehicles();
    }
  }, [token]);
  useEffect(() => {
    if (token) {
      fetchAddresses();
    }
  }, [token]);

  return (
    <DataContext.Provider
      value={{
        vehicle_data,
        address_data,
        v_loading,
        a_loading,
        seta_loading,
        setv_loading,
        getVehicles,
        fetchAddresses,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

DataProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
