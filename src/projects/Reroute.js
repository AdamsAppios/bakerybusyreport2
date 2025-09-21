import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./home/Home";
import SendReport from "./sendreport/SendReport";
import GloryBee from "./glorybee/GloryBee"
const Reroute = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sendreport" element={<SendReport />} />
        <Route path="/glorybee" element={<GloryBee />} />
      </Routes>
    </Router>
  );
};

export default Reroute;