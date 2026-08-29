import { useEffect, useState } from "react";
import Nav from "../Nav";
import instance from "../../api/api_Instance";
import useAuth from "../../Context/useAuth";

const Dashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await instance.get("/booking", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings(res.data.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchBookings();
  }, [token]);

  const handleCancel = async (id) => {
    try {
      await instance.patch(
        `/booking/${id}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setBookings(
        bookings.map((b) => (b._id === id ? { ...b, status: "cancelled" } : b)),
      );
    } catch (error) {
      console.error("Error cancelling booking:", error);
    }
  };

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    assigned: "bg-indigo-100 text-indigo-800",
    "in-progress": "bg-orange-100 text-orange-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  if (loading) return <div>Loading your dashboard...</div>;

  return (
    <div>
      <Nav />
      <div className="p-6">
        <h1 className="mb-6 text-2xl font-semibold">My Bookings</h1>
        {bookings.length === 0 ? (
          <p className="text-gray-500">
            No bookings yet. Book a service to get started!
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="p-5 bg-white border rounded-lg shadow-md"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold">
                    {booking.service_Id?.service_name}
                  </h3>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      statusColors[booking.status]
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  <strong>Vehicle:</strong> {booking.vehicle_Id?.brand}{" "}
                  {booking.vehicle_Id?.model} (
                  {booking.vehicle_Id?.vehicle_number})
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Address:</strong> {booking.address_Id?.flat_no},{" "}
                  {booking.address_Id?.block_no}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Date:</strong>{" "}
                  {new Date(booking.date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Time:</strong> {booking.time_slot}
                </p>
                <p className="mt-2 text-lg font-bold">₹{booking.total_price}</p>
                {(booking.status === "pending" ||
                  booking.status === "confirmed") && (
                  <button
                    onClick={() => handleCancel(booking._id)}
                    className="px-4 py-1 mt-3 text-sm text-white bg-red-500 rounded hover:bg-red-400"
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
