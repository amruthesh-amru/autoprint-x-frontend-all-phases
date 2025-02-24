import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setCustomer } from "@/app/slices/userSlice"; // Import the Redux action
import { API } from "@/utils/api";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "customer",
    address: "",
    password: "",
    confirmPassword: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    console.log(formData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple client-side validation for password confirmation
    if (formData.password !== formData.confirmPassword) {
      setErrorMsg("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(
        API.REGISTER,
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          role: formData.role,
          address: formData.address,
          password: formData.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      console.log("Registration successful:", response.data);

      const customerData = {
        id: response.data.userId,
        role: response.data.role,
        email: formData.email,
      };
      dispatch(setCustomer(customerData));

      // Optionally clear the form or show a success message
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Registration failed:", error);
      if (error.response) {
        setErrorMsg(error.response.data.message);
        console.error("Response data:", error.response.data);
      } else if (error.request) {
        setErrorMsg("No response from server. Please try again later.");
        console.error("Request:", error.request);
      } else {
        setErrorMsg("An error occurred. Please try again.");
        console.error("Error message:", error.message);
      }
    }
  };

  return (
    <div>
      <section className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-4xl bg-white rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700 p-6">
          {/* Brand / Title */}
          <div className="text-center pb-6">
            <Link to="/" className="flex justify-center items-center space-x-2">
              <span className="text-3xl font-bold text-indigo-600">Auto</span>
              <span className="text-3xl font-bold text-gray-800">Print X</span>
            </Link>
          </div>

          <h1 className="text-xl font-bold text-gray-900 dark:text-white text-center pb-4">
            Create an account
          </h1>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white">
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="mt-1 w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white">
                    Your Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="name@company.com"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phone"
                    placeholder="9784561230"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="mt-1 w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white">
                    Role
                  </label>
                  <select
                    name="role"
                    required
                    value={formData.role}
                    onChange={handleChange}
                    className="mt-1 w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="customer">Customer</option>
                    <option value="vendor">Vendor</option>
                  </select>
                </div>
              </div>

              {/* Right Column */}
              <div className="flex-1 space-y-4">
                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="123 Street, City, Country"
                    required
                    className="mt-1 w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="mt-1 w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="mt-1 w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="text-red-600 text-center">{errorMsg}</div>
            )}

            {/* Terms & Conditions + Submit Button */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  className="w-4 h-4 border rounded dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  htmlFor="terms"
                  className="ml-2 text-sm text-gray-500 dark:text-gray-300"
                >
                  I accept the{" "}
                  <a href="#" className="text-primary-600 hover:underline">
                    Terms and Conditions
                  </a>
                </label>
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white p-2 rounded font-medium hover:bg-indigo-700"
              >
                Create an account
              </button>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-indigo-600 font-medium hover:underline"
                >
                  Login here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Signup;
