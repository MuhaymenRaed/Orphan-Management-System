import { Routes, Route } from "react-router-dom";

import Orphans from "../pages/Orphans";
import Sponsors from "../pages/Sponsors";
import Overview from "../pages/Overview";
import Settings from "../pages/Settings";
import SponserShips from "../pages/SponserShips";
import Salaries from "../pages/Salaries";
import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";
import Users from "../pages/Users";
import Header from "../ui/Header";
import Navbar from "../ui/Navbar";
import { useState } from "react";
import { GlobalToaster } from "../utils/toast";
function App() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <GlobalToaster />
      <Header isOpen={isOpen} setIsOpen={setIsOpen} />
      <Routes>
        <Route path="/Sponsors" element={<Sponsors />} />
        <Route path="/Settings" element={<Settings />} />
        <Route path="/Overview" element={<Overview />} />
        <Route index path="/Orphans" element={<Orphans />} />
        <Route path="/sponsorships" element={<SponserShips />} />
        <Route path="/salaries" element={<Salaries />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/users" element={<Users />} />
      </Routes>
      <Navbar isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
}

export default App;
