/* eslint-disable react/prop-types */
import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import car from "../../../assets/car1.png";
import bike from "../../../assets/bike.png";

const Card = ({ Service, vehicle_data, address_data }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");

  const handleNextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  // Handle date change and generate time slots
  const handleDateChange = (date) => {
    setSelectedDate(date);
    setTimeSlots(["10:00 AM", "12:00 PM", "2:00 PM", "4:00 PM"]);
  };

  const handleVehicleSelect = (vehicle) => setSelectedVehicle(vehicle);
  const handleAddressSelect = (address) => setSelectedAddress(address);

  const Summary = () => (
    <div className="p-5 m-5 bg-white border rounded-lg shadow-md">
      <h3 className="mb-4 text-2xl font-semibold">Summary</h3>
      <p>
        <strong>Service:</strong> {Service?.service_name}
      </p>
      <p>
        <strong>Vehicle:</strong> {selectedVehicle?.vehicle_number}
      </p>
      <p>
        <strong>Address:</strong> {selectedAddress?.flat_no},{" "}
        {selectedAddress?.block_no}
      </p>
      <p>
        <strong>Date:</strong> {format(selectedDate, "PPP")}
      </p>
      <p>
        <strong>Time Slot:</strong> {selectedTimeSlot}
      </p>
      <p>
        <strong>Price:</strong> {}
      </p>{" "}
      {/* Replace with actual price data */}
      <Button
        onClick={() => console.log(Service?.service_name)}
        className="mt-4 bg-violet-500 hover:bg-violet-400"
      >
        Proceed to Payment
      </Button>
    </div>
  );

  return (
    <>
      {/* Progress Bar */}
      <div className="flex flex-wrap items-center justify-center gap-4 py-4 mb-8 border-b sm:gap-6 md:gap-9">
        <div
          className={`step ${
            currentStep === 1
              ? "text-violet-500 border-violet-500 bg-violet-100"
              : "text-gray-500"
          } border-2  p-2  rounded-3xl text-sm sm:text-base md:text-lg`}
        >
          <span className="step-number">1.</span>Vehicles
        </div>{" "}
        <span className="hidden text-gray-400 sm:inline">{">"}</span>
        <div
          className={`step ${
            currentStep === 2
              ? "text-violet-500 border-violet-500 bg-violet-100"
              : "text-gray-400"
          } border-2  p-2  rounded-3xl text-sm sm:text-base md:text-lg`}
        >
          <span className="step-number">2.</span>Address
        </div>
        <span className="hidden text-gray-400 sm:inline">{">"}</span>
        <div
          className={`step ${
            currentStep === 3
              ? "text-violet-500 border-violet-500 bg-violet-100"
              : "text-gray-400"
          } border-2  p-2  rounded-3xl text-sm sm:text-base md:text-lg`}
        >
          <span className="step-number">3.</span> Slot
        </div>
        <span className="hidden text-gray-400 sm:inline">{">"}</span>
        <div
          className={`step ${
            currentStep === 4
              ? "text-violet-500 border-violet-500 bg-violet-100"
              : "text-gray-400"
          } border-2 p-2  rounded-3xl text-sm sm:text-base md:text-lg`}
        >
          <span className="step-number">4.</span>Overview
        </div>
      </div>

      {/* Steps */}
      {currentStep === 1 && (
        <>
          <div className="md:ml-64">
            <h2 className="mb-4 ml-5 text-xl font-semibold">Vehicles</h2>
            <div className="grid grid-cols-1 gap-3 m-5 md:grid-cols-2 lg:grid-cols-4">
              {vehicle_data.map((vehicle) => (
                <div
                  key={vehicle._id}
                  onClick={() => handleVehicleSelect(vehicle)}
                  className={`relative flex w-auto gap-3 p-5 border rounded-lg shadow-md cursor-pointer 
                    text-sm sm:text-base md:text-md
                  ${
                    selectedVehicle?._id === vehicle._id
                      ? "bg-violet-100"
                      : "bg-white"
                  }`}
                >
                  <img
                    src={vehicle.category === "car" ? car : bike}
                    alt={vehicle.category}
                    className="object-cover w-20 h-20 drop-shadow-2xl md:h-32 md:w-32"
                  />
                  <div className="p-1 space-y-2">
                    <p className="font-semibold uppercase">
                      {vehicle.vehicle_number}
                    </p>
                    <p className="">{vehicle.brand}</p>
                    <p className="">{vehicle.model}</p>
                    <p>{vehicle.variant}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end md:mr-96">
            <Button
              onClick={handleNextStep}
              disabled={!selectedVehicle}
              className="mt-4 bg-violet-500 hover:bg-violet-400"
            >
              Next
            </Button>
          </div>
        </>
      )}

      {currentStep === 2 && (
        <>
          <div className="md:ml-64">
            <h2 className="mb-4 ml-5 text-xl font-semibold">Address</h2>
            <div className="grid grid-cols-1 gap-3 m-5 md:grid-cols-2 lg:grid-cols-4">
              {address_data.map((address) => (
                <div
                  key={address._id}
                  onClick={() => handleAddressSelect(address)}
                  className={`relative flex w-auto gap-3 p-6 border rounded-lg shadow-md cursor-pointer 
                    text-sm sm:text-base md:text-md
                  ${
                    selectedAddress?._id === address._id
                      ? "bg-violet-100"
                      : "bg-white"
                  }`}
                >
                  <div className="p-1 space-y-2">
                    <p className="font-semibold uppercase">
                      Flat No: {address.flat_no}
                    </p>
                    <p>Block No: {address.block_no}</p>
                    <p>Parking No: {address.parking_no}</p>
                    <p>Landmark: {address.landmark}</p>
                    <p>Category: {address.address_category}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end md:mr-96">
            <Button
              onClick={handleNextStep}
              disabled={!selectedAddress}
              className="mt-4 bg-violet-500 hover:bg-violet-400"
            >
              Next
            </Button>
          </div>
        </>
      )}

      {currentStep === 3 && (
        <>
          <div className="md:ml-56">
            <h2 className="mb-4 ml-5 text-xl font-semibold">Slot</h2>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-auto ml-5 text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="w-4 h-4 mr-2 " />
                  {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateChange}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          {timeSlots.length > 0 && (
            <div className="mt-5 ">
              <h4 className="mb-2 font-semibold text-md">
                Available Time Slots:
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {timeSlots.map((slot, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedTimeSlot(slot)}
                    className={`p-2 border rounded-lg cursor-pointer 
                      ${
                        selectedTimeSlot === slot
                          ? "bg-violet-100 text-base"
                          : "bg-white"
                      }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="flex justify-end md:mr-52">
            <Button
              onClick={handleNextStep}
              disabled={!selectedDate || !selectedTimeSlot}
              className="mt-6 bg-violet-500 hover:bg-violet-400"
            >
              Next
            </Button>
          </div>
        </>
      )}

      {currentStep === 4 && <Summary />}
    </>
  );
};

export default Card;
