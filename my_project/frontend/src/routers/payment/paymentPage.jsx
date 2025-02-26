import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";
import axios from "axios";
import "./paymentPage.scss";

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [checkoutUrl, setCheckoutUrl] = useState("");
  const [orderInfo, setOrderInfo] = useState({ cartItems: [], buyerInfo: {} });
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const url = params.get("checkoutUrl");
    setCheckoutUrl(url);

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const buyer = JSON.parse(localStorage.getItem("buyerInfo")) || {};
    setOrderInfo({ cartItems: cart, buyerInfo: buyer });
  }, [location]);

  const handleConfirmPayment = async () => {
    setChecking(true);
    try {
      const response = await axios.post("/api/check-payment-status", {
        orderCode: orderInfo.orderCode,
      });
      if (response.data.status === "PAID") {
        navigate("/payment-success");
      } else {
        navigate("/payment-failed");
      }
    } catch (error) {
      console.error("Error checking payment status:", error);
      navigate("/payment-failed");
    }
    setChecking(false);
  };

  return (
    <div className="payment-container">
      <h2>Thanh toán đơn hàng</h2>
      <div className="payment-content">
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

        <div className="qr-container">
          {checkoutUrl ? (
            <>
              <QRCode value={checkoutUrl} size={200} />
              <p>Quét mã QR để thanh toán</p>
              <a href={checkoutUrl} target="_blank" rel="noopener noreferrer">
                Hoặc bấm vào đây để mở PayOS
              </a>
              <button onClick={handleConfirmPayment} disabled={checking}>
                {checking ? "Đang kiểm tra..." : "Xác nhận giao dịch"}
              </button>
            </>
          ) : (
            <p>Đang tải thông tin thanh toán...</p>
          )}
        </div>
      </div>
    </div>
  );
}
