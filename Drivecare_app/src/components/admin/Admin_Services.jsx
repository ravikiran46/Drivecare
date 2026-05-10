import Navbar from "./Navbar";
import { useEffect, useState } from "react";
import { FiEdit } from "react-icons/fi";
import instance from "../api/api_Instance";
import useAuth from "../Context/useAuth";

const Admin_Services = () => {
  const [services, setServices] = useState([]);
  const [service_name, setService_name] = useState("");
  const [price, setPrice] = useState("");
  const [details, setdetails] = useState("");
  const [imgURL, setimgURL] = useState("");
  const [category, setCategory] = useState("Bike");
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [showActions, setShowActions] = useState(null);

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

  const addService = async () => {
    if (!service_name || !price) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const newService = {
        service_name: service_name,
        price,
        category,
        details,
        imgURL,
      };

      const res = await instance.post("/service", newService, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res);
      setServices([...services]);
      setService_name("");
      setPrice("");
      setdetails("");
      setimgURL("");
      setCategory("Bike");
    } catch (error) {
      console.log(error);
    }
  };

  const updateService = async () => {
    if (!service_name || !price) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const updatedService = {
        service_name,
        price,
        category,
        details,
        imgURL,
      };
      console.log(updatedService);
      const res = await instance.put(
        `/service/${editingServiceId}`,
        updatedService,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res);
      setServices(
        services.map((service) =>
          service._id === editingServiceId ? res.data.data : service
        )
      );
      setEditingServiceId(null);
      setService_name("");
      setPrice("");
      setdetails("");
      setimgURL("");
      setCategory("Bike");
    } catch (error) {
      console.log(error);
    }
  };

  const editService = (id) => {
    const serviceToEdit = services.find((service) => service._id === id);
    if (serviceToEdit) {
      setService_name(serviceToEdit.service_name);
      setPrice(serviceToEdit.price);
      setdetails(serviceToEdit.details);
      setimgURL(serviceToEdit.imgURL);
      setCategory(serviceToEdit.category);
      setEditingServiceId(id);
      setShowActions(null);
    }
  };

  const deleteService = async (id) => {
    try {
      await instance.delete(`/service/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = services.filter((service) => service._id !== id);
      setServices(data);
      setShowActions(null);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="mx-auto  md:p-4">
        <div className="w-full max-w-2xl p-6 mx-auto bg-white">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="col-span-1 md:col-span-1">
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded "
                placeholder="Service Name"
                value={service_name}
                onChange={(e) => setService_name(e.target.value)}
              />
            </div>
            <div className="col-span-1 md:col-span-1">
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div className="col-span-1 md:col-span-3">
              <textarea
                id="details"
                rows="4"
                className="block w-full p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 resize-vertical"
                placeholder="Write your details here..."
                value={details}
                onChange={(e) => setdetails(e.target.value)}
                style={{ maxHeight: "150px" }}
              ></textarea>
            </div>
            <div className="col-span-1 md:col-span-1">
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Image URL"
                value={imgURL}
                onChange={(e) => setimgURL(e.target.value)}
              />
            </div>
            <div className="flex items-center col-span-1 md:col-span-1">
              <label className="flex items-center mr-4">
                <input
                  type="radio"
                  name="category"
                  value="Bike"
                  checked={category === "Bike"}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mr-1"
                />
                Bike
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="category"
                  value="Car"
                  checked={category === "Car"}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mr-1"
                />
                Car
              </label>
            </div>
            <div className="col-span-1 md:col-span-1">
              <button
                className={`p-2 mt-4 text-white w-full rounded md:mt-0 ${
                  !service_name || !price
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-500"
                }`}
                onClick={editingServiceId ? updateService : addService}
                disabled={!service_name || !price}
              >
                {editingServiceId ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-5 overflow-x-auto rounded-lg">
          <table className="w-full border-2 border-slate-200">
            <thead className="">
              <tr>
                <th className="p-2 border border-slate-300">Service Name</th>
                <th className="p-2 border border-slate-300">Price</th>
                <th className="p-2 border border-slate-300">Details</th>
                <th className="p-2 border border-slate-300">Category</th>
              </tr>
            </thead>
            <tbody className="">
              {services.map((service) => (
                <tr
                  key={service._id}
                  className="text-center border border-slate-300"
                >
                  <td className="p-2 border border-slate-300">
                    {service.service_name}
                  </td>
                  <td className="p-2 border border-slate-300">
                    {service.price}
                  </td>
                  <td className="p-2 border text-wrap border-slate-300">
                    {service.details}
                  </td>
                  <td className="p-2 border border-slate-300">
                    {service.category}
                  </td>
                  <td className="p-2 text-right">
                    <div className="relative">
                      <button
                        className="text-gray-500 hover:text-blue-500"
                        onClick={() =>
                          setShowActions(
                            showActions === service._id ? null : service._id
                          )
                        }
                      >
                        <FiEdit />
                      </button>
                      {showActions === service._id && (
                        <div className="absolute right-0 z-10 w-24 mt-2 bg-white border border-gray-200 rounded shadow-lg">
                          <button
                            className="block px-4 py-2 text-left text-gray-700"
                            onClick={() => editService(service._id)}
                          >
                            Edit
                          </button>
                          <button
                            className="block w-full px-4 py-2 text-left text-red-700"
                            onClick={() => deleteService(service._id)}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Admin_Services;
