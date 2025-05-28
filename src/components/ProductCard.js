import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const productData = {
  id: "p001",
  title: "Converse Chuck Taylor All Star",
  description: "High-top sneakers with classic design and comfort.",
  price: 59.99,
  variants: ["Red", "Blue", "Black"],
  image: "https://via.placeholder.com/300x300?text=Converse+Shoes",
};

const ProductCard = () => {
  const [variant, setVariant] = useState(productData.variants[0]);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  const handleBuyNow = () => {
    const order = {
      ...productData,
      selectedVariant: variant,
      quantity,
    };
    localStorage.setItem("order", JSON.stringify(order));
    navigate("/checkout");
  };

  return (
    <div className="product-card">
      <img src={productData.image} alt={productData.title} />
      <h2>{productData.title}</h2>
      <p>{productData.description}</p>
      <p>
        <strong>Price: ${productData.price}</strong>
      </p>

      <label>Variant:</label>
      <select value={variant} onChange={(e) => setVariant(e.target.value)}>
        {productData.variants.map((v) => (
          <option key={v}>{v}</option>
        ))}
      </select>

      <label>Quantity:</label>
      <input
        type="number"
        value={quantity}
        min="1"
        max="10"
        onChange={(e) => setQuantity(Number(e.target.value))}
      />

      <br />
      <button onClick={handleBuyNow}>Buy Now</button>
    </div>
  );
};

export default ProductCard;
