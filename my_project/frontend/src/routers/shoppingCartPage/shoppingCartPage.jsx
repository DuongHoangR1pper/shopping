import React, { useState, useEffect } from "react";
import { formatter } from "../../utils/format/formatter";
import { AiOutlineClose } from "react-icons/ai";
import "./shoppingCartPage.scss";

export default function ShoppingCartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [buyerInfo, setBuyerInfo] = useState({ name: "", email: "", address: "", phone: "" });

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(cart);
  }, []);

  const updateCart = (newCart) => {
    setCartItems(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const handleInputChange = (e) => {
    setBuyerInfo({ ...buyerInfo, [e.target.name]: e.target.value });
  };

  const handleRemoveItem = (name) => {
    updateCart(cartItems.filter(item => item.name !== name));
  };

  const handleQuantityChange = (name, delta) => {
    updateCart(
      cartItems.map(item =>
        item.name === name ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      )
    );
  };

  // const handleCheckout = async () => {
  //   try {
  //     const payload = {
  //       buyerName: buyerInfo.name,
  //       buyerEmail: buyerInfo.email,
  //       buyerPhone: buyerInfo.phone,
  //       cartItems
  //     };
  
  //     console.log("Payload gửi lên backend:", payload); // Debug trước khi gửi
  
  //     const response = await fetch("http://localhost:5000/payment", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(payload)
  //     });
  
  //     const textResponse = await response.text(); 
  //     console.log("Raw response từ backend:", textResponse); // Kiểm tra phản hồi
  
  //     const data = JSON.parse(textResponse); // Chuyển đổi JSON
  //     if (data.checkoutUrl) {
  //       window.open(data.checkoutUrl, "_blank");
  //     } else {
  //       alert("Không thể tạo liên kết thanh toán");
  //     }
  //   } catch (error) {
  //     console.error("Error processing payment:", error);
  //   }
  // };

  const handleCheckout = async () => {
    try {
      localStorage.setItem("buyerInfo", JSON.stringify(buyerInfo)); // Lưu thông tin người mua
  
      const payload = {
        buyerName: buyerInfo.name,
        buyerEmail: buyerInfo.email,
        buyerPhone: buyerInfo.phone,
        cartItems
      };
  
      const response = await fetch("http://localhost:5000/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
  
      const data = await response.json();
      if (data.checkoutUrl) {
        window.location.href = `/payment?checkoutUrl=${encodeURIComponent(data.checkoutUrl)}`;
      } else {
        alert("Không thể tạo liên kết thanh toán");
      }
    } catch (error) {
      console.error("Error processing payment:", error);
    }
  };
  
  

  return (
    <div className="container_cart">
      <div className="user_input">
        <h3>Thông tin người dùng</h3>
        <input type="text" name="name" placeholder="Tên" value={buyerInfo.name} onChange={handleInputChange} />
        <input type="email" name="email" placeholder="Gmail" value={buyerInfo.email} onChange={handleInputChange} />
        <input type="text" name="address" placeholder="Địa chỉ" value={buyerInfo.address} onChange={handleInputChange} />
        <input type="tel" name="phone" placeholder="Số điện thoại" value={buyerInfo.phone} onChange={handleInputChange} />
      </div>
      
      <div className="table_cart">
        <table>
          <thead>
            <tr>
              <th>Tên sản phẩm</th>
              <th>Đơn giá</th>
              <th>Số lượng</th>
              <th>Thành tiền</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
  {cartItems.length > 0 ? (
    cartItems.map((item) => (
      <tr key={item.name}>
        <td>{item.name}</td>
        <td>{formatter(item.price)}</td>
        <td>
          <div className="quantity">
            <span className="quantity-btn" onClick={() => handleQuantityChange(item.name, -1)}>-</span>
            <span className="cart-quantity">{item.quantity}</span>
            <span className="quantity-btn" onClick={() => handleQuantityChange(item.name, 1)}>+</span>
          </div>
        </td>
        <td>{formatter(item.price * item.quantity)}</td>
        <td className="icon_close" onClick={() => handleRemoveItem(item.name)}>
          <AiOutlineClose />
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="5" style={{ textAlign: "center" }}>Giỏ hàng trống</td>
    </tr>
  )}
</tbody>

        </table>
      </div>
      
      <div className="shopping_checkout">
        <h2>Tổng đơn:</h2>
        <ul>
          <li>Số lượng: <span>{cartItems.reduce((total, item) => total + item.quantity, 0)}</span></li>
          <li>Thành tiền: <span>{formatter(cartItems.reduce((total, item) => total + item.price * item.quantity, 0))}</span></li>
        </ul>
        <button type="button" className="button-submit" onClick={handleCheckout}>Thanh toán</button>
      </div>
    </div>
  );
}
