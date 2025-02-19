import React from "react";
import { Link } from "react-router-dom";
import { AiOutlineFacebook, AiOutlineInstagram, AiOutlineLinkedin } from "react-icons/ai";
import "./footer.scss";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer_about">
          <h1 className="footer_about_logo">Shop</h1>
          <ul>
            <li>Địa chỉ: Hà Lâm 2, Thuỵ Lâm, Đông Anh, Hà Nội</li>
            <li>Số điện thoại: 0971918803</li>
            <li>Email: duonghoangripper25@gmail.com</li>
          </ul>
        </div>
        <div className="footer_widget">
          <h6>Cửa hàng</h6>
          <ul>
            <li><Link to="">Liên hệ</Link></li>
            <li><Link to="">Thông tin về chúng tôi</Link></li>
            <li><Link to="">Sản phẩm kinh doanh</Link></li>
          </ul>
          <ul>
            <li><Link to="">Thông tin tài khoản</Link></li>
            <li><Link to="">Giỏ hàng</Link></li>
            <li><Link to="">Danh sách ưa thích</Link></li>
          </ul>
        </div>
        <div className="footer_widget promo">
          <h6>Khuyến mãi & Ưu đãi</h6>
          <p>Đăng ký nhận thông tin tại đây</p>
          <form action="#">
            <div className="input-group">
              <input type="email" placeholder="Nhập email" />
              <button type="submit" className="button-submit">Đăng ký</button>
            </div>
            <div className="footer_widget_social">
              <AiOutlineFacebook />
              <AiOutlineInstagram />
              <AiOutlineLinkedin />
            </div>
          </form>
        </div>
      </div>
    </footer>
  );
}
