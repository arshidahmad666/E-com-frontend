import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("");

  useEffect(() => {
    const savedOrder = JSON.parse(localStorage.getItem("order"));
    if (!savedOrder) return navigate("/");
    setOrder(savedOrder);
  }, [navigate]);

  const validate = () => {
    const newErrors = {};
    const emailRegex = /\S+@\S+\.\S+/;
    const phoneRegex = /^\d{10}$/;
    const cardRegex = /^\d{16}$/;
    const cvvRegex = /^\d{3}$/;

    if (!emailRegex.test(form.email)) newErrors.email = "Invalid email";
    if (!phoneRegex.test(form.phone))
      newErrors.phone = "Phone must be 10 digits";
    if (!cardRegex.test(form.cardNumber))
      newErrors.cardNumber = "Card must be 16 digits";
    if (!cvvRegex.test(form.cvv)) newErrors.cvv = "CVV must be 3 digits";
    if (!form.expiry || new Date(form.expiry) <= new Date())
      newErrors.expiry = "Expiry must be in the future";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const simulateStatus = () => {
    const cvv = form.cvv;
    if (cvv === "1") return "approved";
    if (cvv === "2") return "declined";
    if (cvv === "3") return "error";
    return "approved";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const customer = { ...form };
    const status = simulateStatus();
    setStatus(status);

    try {
      const res = await axios.post("http://localhost:5000/api/orders", {
        product: order,
        customer,
        status,
      });

      localStorage.removeItem("order");
      navigate(`/thank-you/${res.data._id}`);
    } catch (err) {
      alert("Something went wrong!");
    }
  };

  if (!order) return null;

  const subtotal = order.price * order.quantity;

  return (
    <div>
      <h1>Checkout</h1>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Full Name"
          value={form.fullName}
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
        />
        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}
        <input
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        {errors.phone && <p style={{ color: "red" }}>{errors.phone}</p>}
        <input
          placeholder="Address"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />
        <input
          placeholder="City"
          value={form.city}
          onChange={(e) => setForm({ ...form, city: e.target.value })}
        />
        <input
          placeholder="State"
          value={form.state}
          onChange={(e) => setForm({ ...form, state: e.target.value })}
        />
        <input
          placeholder="Zip Code"
          value={form.zip}
          onChange={(e) => setForm({ ...form, zip: e.target.value })}
        />
        <input
          placeholder="Card Number"
          value={form.cardNumber}
          onChange={(e) => setForm({ ...form, cardNumber: e.target.value })}
        />
        {errors.cardNumber && (
          <p style={{ color: "red" }}>{errors.cardNumber}</p>
        )}
        <input
          type="month"
          placeholder="Expiry Date"
          value={form.expiry}
          onChange={(e) => setForm({ ...form, expiry: e.target.value })}
        />
        {errors.expiry && <p style={{ color: "red" }}>{errors.expiry}</p>}
        <input
          placeholder="CVV"
          value={form.cvv}
          onChange={(e) => setForm({ ...form, cvv: e.target.value })}
        />
        {errors.cvv && <p style={{ color: "red" }}>{errors.cvv}</p>}

        <button type="submit">Place Order</button>
      </form>

      <hr />
      <h2>Order Summary</h2>
      <p>
        <strong>Product:</strong> {order.title}
      </p>
      <p>
        <strong>Variant:</strong> {order.selectedVariant}
      </p>
      <p>
        <strong>Quantity:</strong> {order.quantity}
      </p>
      <p>
        <strong>Subtotal:</strong> ${subtotal.toFixed(2)}
      </p>
      <p>
        <strong>Total:</strong> ${subtotal.toFixed(2)}
      </p>
    </div>
  );
};

export default CheckoutPage;
