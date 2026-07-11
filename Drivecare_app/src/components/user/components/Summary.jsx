import instance from "../../api/api_Instance";
import useAuth from "../../Context/useAuth";
import { Button } from "@/components/ui/button";
import PropTypes from "prop-types";
import { useState } from "react";
import { format } from "date-fns";
const Summary = ({
  Service,
  selectedAddress,
  selectedTimeSlot,
  selectedVehicle,
  selectedDate,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const { user, token } = useAuth();
  const handleBooking = async () => {
    setIsSubmitting(true);
    try {
      const res = await instance.post(
        "/booking",
        {
          user_Id: user.id,
          service_Id: Service?._id,
          vehicle_Id: selectedVehicle?._id,
          address_Id: selectedAddress?._id,
          date: selectedDate,
          time: selectedTimeSlot,
          total_price: Service?.price,
          payment_method: "cod",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (res.status === 200) {
        setIsBooked(true);
      }
    } catch (error) {
      console.error("Booking failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isBooked) {
    return (
      <div className="p-5 m-5 text-center bg-white border rounded-lg shadow-md">
        <h3 className="mb-4 text-2xl font-semibold text-green-600">
          Booking Confirmed!
        </h3>
        <p className="text-gray-600">
          Your {Service?.service_name} has been booked.
        </p>
        <p className="mt-2 text-gray-600">Payment: Cash on Delivery</p>
        <p className="mt-1 text-sm text-gray-400">
          You&apos;ll receive updates on your booking status.
        </p>
      </div>
    );
  }
  return (
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
        <strong>Price:</strong> ₹{Service?.price}
      </p>
      <p>
        <strong>Payment:</strong> Cash on Delivery
      </p>
      <Button
        onClick={handleBooking}
        disabled={isSubmitting}
        className="mt-4 bg-violet-500 hover:bg-violet-400"
      >
        {isSubmitting ? "Booking..." : "Confirm Booking"}
      </Button>
    </div>
  );
};

Summary.propTypes = {
  Service: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    service_name: PropTypes.string.isRequired,
  }),
  selectedAddress: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    flat_no: PropTypes.string.isRequired,
    block_no: PropTypes.string.isRequired,
  }),
  selectedTimeSlot: PropTypes.string.isRequired,
  selectedVehicle: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    vehicle_number: PropTypes.string.isRequired,
  }),
  selectedDate: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Date),
  ]).isRequired,
};

export default Summary;
