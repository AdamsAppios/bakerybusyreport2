import React from "react";
import { Link } from "react-router-dom";

const Home = () => (
  <div>
    <h2>Home Page</h2>
    <nav>
      <ul>
        <li>
          <Link to="/sendreport">Go to Send Report</Link>
        </li>
        <li>
          <Link to="/glorybee">Go to Glorybee</Link>
        </li>
      </ul>
    </nav>
  </div>
);

export default Home;
