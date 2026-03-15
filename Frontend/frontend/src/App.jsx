import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Products from "./pages/Products.jsx";
import Addproduct from "./pages/Addproduct.jsx";
import Login from "./pages/login.jsx";
import Register from "./pages/Register.jsx";

function App() {
  return (
    <Router>

      {/* Navbar */}
      <nav className="bg-gray-900 text-white shadow-lg">
        <div className="max-w-6xl mx-auto flex justify-between items-center p-4">

          <h1 className="text-2xl font-bold text-blue-400">
            Secondhand Marketplace
          </h1>

          <div className="flex gap-6 font-medium">
            <Link className="hover:text-blue-400 transition" to="/">Products</Link> {"| "}
            <Link className="hover:text-blue-400 transition" to="/add-product">Add Product</Link> {"| "}
            <Link className="hover:text-blue-400 transition" to="/login">Login</Link> {"| "}
            <Link className="hover:text-blue-400 transition" to="/register">Register</Link>
          </div>

        </div>
      </nav>

      {/* Main Page Area */}
      <div className="max-w-6xl mx-auto p-6">

        <Routes>
          <Route path="/" element={<Products />} />
          <Route path="/add-product" element={<Addproduct />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>

      </div>

    </Router>
  );
}

export default App;