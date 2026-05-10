import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { useForm } from "react-hook-form";
import Nav from "./Nav";
import instance from "../api/api_Instance";
import useAuth from "../Context/useAuth";
import car from "../../assets/car1.png";
import bike from "../../assets/bike.png";
import toast from "react-hot-toast";
import useDataContext from "../Context/useDataContext";

const Vehicle = () => {
  const [vehicles, setVehicles] = useState([]);
  const { token, user } = useAuth();
  const { vehicle_data, v_loading, getVehicles, fetchAddresses } =
    useDataContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [vehicleId, setVehicleId] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      category: "",
      vehicle_number: "",
      brand: "",
      model: "",
      variant: "",
      color: "",
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
    setStep(1);
    setVehicleId(null);
    setIsEditing(false);
    reset();
  };

  useEffect(() => {
    if (!v_loading && vehicle_data) setVehicles(vehicle_data);
  }, [vehicle_data, v_loading]);

  const onSubmitVehicle = async (data) => {
    try {
      let res;
      if (isEditing) {
        res = await instance.put(
          `/vehicle/${vehicleId}`,
          { ...data, user_Id: user.id },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        closeModal();
      } else {
        res = await instance.post(
          "/vehicle",
          { ...data, user_Id: user.id },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }

      if (
        (isEditing && res.status === 200) ||
        (!isEditing && res.status === 201)
      ) {
        toast.success(isEditing ? "Vehicle updated!" : "Vehicle added!");
        !isEditing && setStep(3);
        getVehicles();
      } else {
        toast.error("Could not process the vehicle request, try again.");
      }
    } catch (error) {
      console.error("Error updating/adding vehicle:", error);
    }
  };

  const onSubmitAddress = async (data) => {
    try {
      const res = await instance.post(
        "/address",
        { ...data, user_Id: user.id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.status === 201) {
        toast.success("Address added!");
        closeModal();
        fetchAddresses();
      } else {
        toast.error("Could not add address, try again.");
      }
    } catch (error) {
      console.error("Error adding address:", error);
    }
  };

  const handleEdit = (vehicle) => {
    setVehicleId(vehicle._id);
    setIsEditing(true);
    setValue("category", vehicle.category);
    setValue("vehicle_number", vehicle.vehicle_number);
    setValue("brand", vehicle.brand);
    setValue("model", vehicle.model);
    setValue("variant", vehicle.variant);
    setValue("color", vehicle.color);
    setStep(2);
    openModal();
  };

  const handleDelete = async (id) => {
    try {
      await instance.delete(`/vehicle/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      getVehicles();
    } catch (error) {
      console.error("Error deleting vehicle:", error);
    }
  };

  const handleNextStep = (vehicleType) => {
    setValue("category", vehicleType);
    setStep(2);
  };

  const handleBackStep = () => setStep(1);

  if (v_loading) {
    return <div>loading ...</div>;
  }
  return (
    <div>
      <Nav />
      {vehicles.length === 0 ? (
        <div className="flex justify-center mt-52">
          <button
            className="p-2.5 text-white bg-blue-600 border-2 rounded-md shadow-md hover:bg-blue-500"
            onClick={openModal}
          >
            Add Vehicle
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
            {vehicles.map((vehicle) => (
              <div
                key={vehicle._id}
                className="relative flex w-auto gap-3 p-6 bg-white border rounded-lg shadow-md"
              >
                <img
                  src={vehicle.category === "car" ? car : bike}
                  alt={vehicle.category}
                  className="w-32 h-32"
                />
                <div className="p-1 space-y-2">
                  <p className="font-bold uppercase">
                    {vehicle?.vehicle_number}
                  </p>
                  <p className="uppercase">{vehicle?.brand}</p>
                  <p className="uppercase">{vehicle?.model}</p>
                  <p>{vehicle?.variant}</p>
                </div>

                <div className="absolute flex space-x-4 top-2 right-4">
                  <FaEdit
                    className="text-blue-600 cursor-pointer"
                    onClick={() => handleEdit(vehicle)}
                  />
                  <FaTrash
                    className="text-red-600 cursor-pointer"
                    onClick={() => handleDelete(vehicle._id)}
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
              className="absolute text-xl font-semibold text-gray-500 top-7 right-5"
              onClick={closeModal}
            >
              X
            </button>

            {step === 1 && !isEditing && (
              <div className="transition-transform duration-500 transform translate-x-0">
                <h2 className="mb-4 text-xl font-semibold">Select Vehicle</h2>
                <div className="flex justify-around">
                  <button
                    onClick={() => handleNextStep("car")}
                    className="p-4 text-white bg-blue-500 rounded-md hover:bg-blue-400"
                  >
                    Car
                  </button>
                  <button
                    onClick={() => handleNextStep("bike")}
                    className="p-4 text-white bg-blue-500 rounded-md hover:bg-blue-400"
                  >
                    Bike
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <form
                onSubmit={handleSubmit(onSubmitVehicle)}
                className="space-y-3"
              >
                <button
                  className="mb-2 text-sm text-blue-500"
                  onClick={handleBackStep}
                >
                  ← Back
                </button>
                <h2 className="text-xl font-semibold">
                  {isEditing ? `Edit ` : "Enter Vehicle "} Details
                </h2>
                {(errors.vehicle_number ||
                  errors.brand ||
                  errors.model ||
                  errors.variant ||
                  errors.color) && (
                  <p className="text-red-600">Enter all feilds</p>
                )}
                <div className="relative">
                  <input
                    type="text"
                    id="number"
                    className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    {...register("vehicle_number", {
                      required: "Vehicle number is required",
                    })}
                  />
                  <label
                    htmlFor="number"
                    className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                  >
                    Vehicle Number
                  </label>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    id="brand"
                    className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    {...register("brand", { required: "Brand is required" })}
                  />
                  <label
                    htmlFor="brand"
                    className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                  >
                    Brand
                  </label>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    id="model"
                    className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    {...register("model", { required: "Model is required" })}
                  />
                  <label
                    htmlFor="model"
                    className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                  >
                    Model
                  </label>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    id="variant"
                    className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    {...register("variant", {
                      required: "variant is required",
                    })}
                  />
                  <label
                    htmlFor="variant"
                    className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                  >
                    Variant
                  </label>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    id="color"
                    className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    {...register("color", { required: "Color is required" })}
                  />
                  <label
                    htmlFor="color"
                    className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                  >
                    Color
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full p-2 text-white bg-green-600 rounded hover:bg-green-500"
                >
                  {isEditing ? "Update Vehicle" : "Add Vehicle"}
                </button>
              </form>
            )}

            {step === 3 && (
              <form
                onSubmit={handleSubmit(onSubmitAddress)}
                className="space-y-3"
              >
                <h2 className="text-xl font-semibold">Enter Address Details</h2>
                <div className="relative">
                  <input
                    type="text"
                    id="flat_no"
                    className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    {...register("flat_no", {
                      required: "Flat Number is required",
                    })}
                  />
                  <label
                    htmlFor="flat_no"
                    className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                  >
                    Flat No
                  </label>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    id="block_no"
                    className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    {...register("block_no", {
                      required: "Block Number is required",
                    })}
                  />
                  <label
                    htmlFor="block_no"
                    className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                  >
                    Block No
                  </label>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    id="parking_no"
                    className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    {...register("parking_no", {
                      required: "Parking Number is required",
                    })}
                  />
                  <label
                    htmlFor="parking_no"
                    className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                  >
                    Parking No
                  </label>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    id="landmark"
                    className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    {...register("landmark", {
                      required: "Landmark is required",
                    })}
                  />
                  <label
                    htmlFor="landmark"
                    className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                  >
                    Landmark
                  </label>
                </div>

                <div className="relative">
                  <select
                    id="address_cat"
                    className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    // placeholder=" "
                    {...register("address_category")}
                  >
                    <option value="Home">Home</option>
                    <option value="Work">Work</option>
                    <option value="Other">Other</option>
                  </select>
                  <label
                    htmlFor="address_cat"
                    className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                  >
                    Address Category
                  </label>
                </div>
                <button
                  type="submit"
                  className="w-full p-2 text-white bg-green-600 rounded hover:bg-green-500"
                >
                  Add Address
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Vehicle;
