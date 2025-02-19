import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import QRCode from "react-qr-code";
import "./paymentPage.scss";

export default function PaymentPage() {
  const location = useLocation();
  const [checkoutUrl, setCheckoutUrl] = useState("");
  const [orderInfo, setOrderInfo] = useState({ cartItems: [], buyerInfo: {} });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const url = params.get("checkoutUrl");
    setCheckoutUrl(url);

    // Lấy thông tin đơn hàng từ localStorage
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const buyer = JSON.parse(localStorage.getItem("buyerInfo")) || {};
    setOrderInfo({ cartItems: cart, buyerInfo: buyer });
  }, [location]);

  return (
    <div className="payment-container">
      <h2>Thanh toán đơn hàng</h2>
      <div className="payment-content">
        {/* Cột bên trái: Thông tin đơn hàng và người mua */}
        <div className="order-info">
          <h3>Thông tin người mua</h3>
          <p><strong>Tên:</strong> {orderInfo.buyerInfo.name}</p>
          <p><strong>Email:</strong> {orderInfo.buyerInfo.email}</p>
          <p><strong>Địa chỉ:</strong> {orderInfo.buyerInfo.address}</p>
          <p><strong>Số điện thoại:</strong> {orderInfo.buyerInfo.phone}</p>

          <h3>Chi tiết đơn hàng</h3>
          <ul>
            {orderInfo.cartItems.map((item, index) => (
              <li key={index}>
                {item.name} - {item.quantity} x {item.price}₫ = {item.quantity * item.price}₫
              </li>
            ))}
          </ul>
          <h3>Tổng tiền: {orderInfo.cartItems.reduce((total, item) => total + item.quantity * item.price, 0)}₫</h3>
        </div>

        {/* Cột bên phải: QR Code */}
        <div className="qr-container">
          {checkoutUrl ? (
            <>
              <QRCode value={checkoutUrl} size={200} />
              <p>Quét mã QR để thanh toán</p>
              <a href={checkoutUrl} target="_blank" rel="noopener noreferrer">
                Hoặc bấm vào đây để mở PayOS
              </a>
            </>
          ) : (
            <p>Đang tải thông tin thanh toán...</p>
          )}
        </div>
      </div>
    </div>
  );
}
