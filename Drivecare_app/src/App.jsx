import Home from "./components/Home";
import { Route, Routes } from "react-router-dom";
import Contact from "./components/Nav/Contact";
import Login from "./components/Nav/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Pricing from "./components/Nav/Pricing";
import Services from "./components/Nav/Services";
import Admin_Home from "./components/admin/Admin_Home";
import Admin_Services from "./components/admin/Admin_Services";
import User_Home from "./components/user/User_Home";
import Vehicle from "./components/user/Vehicle";
import Address from "./components/user/Address";
import SingleService from "./components/user/SingleService";
import Payment from "./components/user/Payment";
import DataProvider from "./components/Context/DataContext";
import Dashboard from "./components/user/components/Dashboard";
function App() {
  return (
    <div>
      <DataProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/Contact" element={<Contact />} />
          <Route path="/Services" element={<Services />} />
          <Route path="/Login" element={<Login />} />
          <Route element={<ProtectedRoute allowedroles={["user", "admin"]} />}>
            <Route path="/user" element={<User_Home />} />
            <Route path="/vehicles" element={<Vehicle />} />
            <Route path="/address" element={<Address />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/service/:id" element={<SingleService />} />
            <Route path="/payment/:id" element={<Payment />} />
          </Route>
          <Route element={<ProtectedRoute allowedroles={["admin"]} />}>
            <Route path="/admin" element={<Admin_Home />} />
            <Route path="/admin/service" element={<Admin_Services />} />
          </Route>
        </Routes>
      </DataProvider>
    </div>
  );
}

export default App;
