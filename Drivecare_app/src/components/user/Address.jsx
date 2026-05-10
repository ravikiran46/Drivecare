import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { useForm } from "react-hook-form";
import Nav from "./Nav";
import instance from "../api/api_Instance";
import useAuth from "../Context/useAuth";
import useDataContext from "../Context/useDataContext";

const Address = () => {
  const [addresses, setAddresses] = useState([]);
  const { token, user } = useAuth();
  const { address_data, a_loading, fetchAddresses } = useDataContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [addressId, setAddressId] = useState(null);
  // const landmarkRef = useRef(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      flat_no: "",
      block_no: "",
      parking_no: "",
      landmark: "",
      address_category: "Home",
    },
  });

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setAddressId(null);
    setIsEditing(false);
    reset();
  };

  useEffect(() => {
    if (address_data && !a_loading) {
      setAddresses(address_data);
    }
  }, [address_data, a_loading]);

  // useEffect(() => {
  //   if (window.google && landmarkRef.current) {
  //     const autocomplete = new window.google.maps.places.Autocomplete(
  //       landmarkRef.current,
  //       { types: ["geocode"] } // Restrict to address suggestions
  //     );
  //     autocomplete.addListener("place_changed", () => {
  //       const place = autocomplete.getPlace();
  //       setValue("landmark", place.formatted_address || "");
  //     });
  //   }
  // }, [setValue]);

  const onSubmit = async (data) => {
    try {
      const url = isEditing ? `/address/${addressId}` : "/address";
      const method = isEditing ? "put" : "post";

      await instance[method](
        url,
        { ...data, user_Id: user.id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      closeModal();
      fetchAddresses();
    } catch (error) {
      console.error("Error submitting address:", error);
    }
  };

  const handleEdit = (address) => {
    setAddressId(address._id);
    setIsEditing(true);
    setValue("flat_no", address.flat_no);
    setValue("block_no", address.block_no);
    setValue("parking_no", address.parking_no);
    setValue("landmark", address.landmark);
    setValue("address_category", address.address_category);
    openModal();
  };

  const handleDelete = async (id) => {
    try {
      await instance.delete(`/address/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAddresses();
    } catch (error) {
      console.error("Error deleting address:", error);
    }
  };

  if (a_loading) {
    return <div>loading ...</div>;
  }
  return (
    <div>
      <Nav />
      {addresses.length === 0 ? (
        <div className="flex justify-center mt-52">
          <button
            className="p-2.5 text-white bg-blue-600 border-2 rounded-md shadow-md hover:bg-blue-500"
            onClick={openModal}
          >
            Add Address
          </button>
        </div>
      ) : (
        <>
          <div className="m-5">
            <button
              className="p-2.5 text-white bg-blue-600 border-2 rounded-md shadow-md hover:bg-blue-500 mt-4"
              onClick={openModal}
            >
              <FaPlus />
            </button>
          </div>
          <div className="grid grid-cols-1 gap-3 m-5 md:grid-cols-2 lg:grid-cols-4">
            {addresses.map((address) => (
              <div
                key={address._id}
                className="relative flex w-auto gap-3 p-6 bg-white border rounded-lg shadow-md"
              >
                <div className="p-1 space-y-2">
                  <p className="font-bold uppercase">
                    Flat No: {address.flat_no}
                  </p>
                  <p>Block No: {address.block_no}</p>
                  <p>Parking No: {address.parking_no}</p>
                  <p>Landmark: {address.landmark}</p>
                  <p>Category: {address.address_category}</p>
                </div>
                <div className="absolute flex space-x-4 top-2 right-4">
                  <FaEdit
                    className="text-blue-600 cursor-pointer"
                    onClick={() => handleEdit(address)}
                  />
                  <FaTrash
                    className="text-red-600 cursor-pointer"
                    onClick={() => handleDelete(address._id)}
                  />
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative w-full max-w-lg p-8 bg-white rounded-lg shadow-lg">
            <button
              className="absolute text-xl font-semibold text-gray-500 top-2 right-5"
              onClick={closeModal}
            >
              X
            </button>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <h2 className="text-xl font-semibold">
                {isEditing ? "Edit Address Details" : "Enter Address Details"}
              </h2>

              <label>
                Flat No
                <input
                  type="text"
                  {...register("flat_no", { required: "Flat No is required" })}
                  className="w-full p-2 mb-2 border rounded"
                  placeholder="E.g., 101"
                />
                {errors.flat_no && (
                  <p className="text-red-600">{errors.flat_no.message}</p>
                )}
              </label>

              <label>
                Block No
                <input
                  type="text"
                  {...register("block_no", {
                    required: "Block No is required",
                  })}
                  className="w-full p-2 mb-2 border rounded"
                  placeholder="E.g., B"
                />
                {errors.block_no && (
                  <p className="text-red-600">{errors.block_no.message}</p>
                )}
              </label>

              <label>
                Parking No
                <input
                  type="text"
                  {...register("parking_no", {
                    required: "Parking No is required",
                  })}
                  className="w-full p-2 mb-2 border rounded"
                  placeholder="E.g., 25"
                />
                {errors.parking_no && (
                  <p className="text-red-600">{errors.parking_no.message}</p>
                )}
              </label>

              <label>
                Landmark
                <input
                  type="text"
                  {...register("landmark", {
                    required: "Landmark is required",
                  })}
                  // ref={landmarkRef}
                  className="w-full p-2 mb-2 border rounded"
                  placeholder="Enter landmark or address"
                />
                {errors.landmark && (
                  <p className="text-red-600">{errors.landmark.message}</p>
                )}
              </label>

              <label>
                Address Category
                <select
                  {...register("address_category")}
                  className="w-full p-2 mb-2 border rounded"
                >
                  <option value="Home">Home</option>
                  <option value="Work">Work</option>
                  <option value="Other">Other</option>
                </select>
              </label>

              <button
                type="submit"
                className="w-full p-2 text-white bg-green-600 rounded hover:bg-green-500"
              >
                {isEditing ? "Update Address" : "Add Address"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Address;
