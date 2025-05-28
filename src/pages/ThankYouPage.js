// import React from "react";
// import { useParams } from "react-router-dom";

// const ThankYouPage = () => {
//   const { orderId } = useParams();

//   return (
//     <div>
//       <h1>Thank You!</h1>
//       <p>
//         Your order ID is: <strong>{orderId}</strong>
//       </p>
//       <p>We'll display full order details here soon.</p>
//     </div>
//   );
// };

// export default ThankYouPage;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ThankYouPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(
          `https://e-com-backend-thhn.onrender.com/api/orders/${orderId}`
        );
        setOrder(res.data);
      } catch (err) {
        console.error("Failed to fetch order");
      }
    };

    fetchOrder();
  }, [orderId]);

  if (!order) return <p>Loading...</p>;

  const { orderNumber, product, customer, status } = order;
  const total = product.price * product.quantity;

  return (
    <div>
      <h1>
        {status === "approved"
          ? "Thank you for your purchase!"
          : "Transaction Failed"}
      </h1>
      <p>
        <strong>Order ID:</strong> {orderNumber}
      </p>

      <h2>Order Summary</h2>
      <p>
        <strong>Product:</strong> {product.title}
      </p>
      <p>
        <strong>Variant:</strong> {product.selectedVariant}
      </p>
      <p>
        <strong>Quantity:</strong> {product.quantity}
      </p>
      <p>
        <strong>Total:</strong> ${total.toFixed(2)}
      </p>

      <h2>Customer Information</h2>
      <p>
        <strong>Name:</strong> {customer.fullName}
      </p>
      <p>
        <strong>Email:</strong> {customer.email}
      </p>
      <p>
        <strong>Phone:</strong> {customer.phone}
      </p>
      <p>
        <strong>Address:</strong> {customer.address}, {customer.city},{" "}
        {customer.state}, {customer.zip}
      </p>

      <p
        style={{
          marginTop: "1rem",
          color: status === "approved" ? "green" : "red",
        }}
      >
        {status === "approved"
          ? "A confirmation email has been sent to your inbox."
          : "Unfortunately, your transaction was declined or failed. Please try again."}
      </p>
    </div>
  );
};

export default ThankYouPage;
