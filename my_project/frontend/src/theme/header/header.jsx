import React, { useState } from "react";
import {
  AiOutlineUser,
  AiOutlineShoppingCart,
  AiOutlineMenu,
  AiOutlineSearch,
} from "react-icons/ai";
import { Link } from "react-router-dom";
import "./header.scss";

export default function Header() {
  const [isShowMenu, setShowMenu] = useState(false);

  const menus = [
    { name: "Best Sellers", path: "/" },
    { name: "Gift Ideas", path: "/gift-ideas" },
    { name: "New Releases", path: "/new-releases" },
    { name: "Today's Deals", path: "/deals" },
    { name: "Customer Service", path: "/customer-service" },
  ];

  return (
    <>
      {/* Menu mobile overlay */}
      {/* <div
        className={`menu_overlay ${isShowMenu ? "active" : ""}`}
        onClick={() => setShowMenu(false)}
      /> */}

      {/* Header chính */}
      <header className="header">
        <div className="container">
          <div className="header_wrapper">
            {/* Logo */}
            <div className="header_logo">
              <h1>Shop</h1>
            </div>

            {/* Menu */}
            <nav className="header_menu ">
              <ul>
                {menus.map((menu, key) => (
                  <li key={key}>
                    <Link to={menu.path}>{menu.name}</Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Ô tìm kiếm */}
            <div className="header_search">
              <input type="text" placeholder="Search for products" />
              <button>
                <AiOutlineSearch />
              </button>
            </div>

            {/* Giỏ hàng và đăng nhập */}
            <div className="header_right">
              <Link to="/cart" className="cart">
                <AiOutlineShoppingCart />
                {/* <span>2</span> */}
              </Link>
              <Link to="/login" className="login">
                <AiOutlineUser />
                <span>Login</span>
              </Link>
            </div>

            {/* Menu icon cho mobile */}
            <div className="menu_toggle">
              <AiOutlineMenu onClick={() => setShowMenu(!isShowMenu)} />
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
