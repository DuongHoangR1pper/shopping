import React, { useState } from "react";
import { AiOutlineEye, AiOutlineShoppingCart } from "react-icons/ai";
import { formatter } from "../../utils/format/formatter";
import { Link, useNavigate } from "react-router-dom";
import "./productCard.scss";

export default function ProductCard({ name, img, price }) {
  const [notification, setNotification] = useState("");
  const [fadeOut, setFadeOut] = useState(false);
  const navigate = useNavigate(); // Hook để điều hướng trang

  const handleAddToCart = (buyNow = false) => {
    const newProduct = { name, img, price, quantity: 1 };

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingProduct = cart.find(item => item.name === name);

    let updatedCart;

    if (existingProduct) {
      updatedCart = cart.map(item =>
        item.name === name ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      updatedCart = [...cart, newProduct];
    }

    localStorage.setItem("cart", JSON.stringify(updatedCart));

    if (buyNow) {
      navigate("/cart"); // Chuyển đến trang giỏ hàng ngay lập tức
    } else {
      // Hiển thị thông báo thêm vào giỏ hàng
      setNotification(`${name} đã thêm vào giỏ hàng!`);
      setFadeOut(false);

      setTimeout(() => {
        setFadeOut(true);
        setTimeout(() => {
          setNotification("");
        }, 1000);
      }, 3000);
    }
  };

  return (
    <div className="featured_item">
      {notification && (
        <div className={`notification ${fadeOut ? "fade-out" : ""}`}>
          {notification}
        </div>
      )}
      <div className="featured_item_pic" style={{ backgroundImage: `url(${img})` }}>
        <ul className="featured_item_pic_hover">
          <li><AiOutlineEye /></li>
          <li onClick={() => handleAddToCart(false)}><AiOutlineShoppingCart /></li>
        </ul>
      </div>
      <div className="featured_item_text">
        <h6>{name}</h6>
        <h5>{formatter(price)}</h5>
      </div>
      <div className="featured_buy">
        <button onClick={() => handleAddToCart(true)}>Mua ngay</button>
      </div>
    </div>
  );
}
