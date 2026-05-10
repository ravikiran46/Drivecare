import Navbar from "./Navbar";

const Admin_Home = () => {
  return (
    <>
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-semibold">Welcome to Drivecare Admin</h1>
        <p className="mt-2 text-gray-600">Manage your services, agents, and bookings from here.</p>
      </div>
    </>
  );
};

export default Admin_Home;
