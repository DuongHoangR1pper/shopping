import React from "react";
import { Outlet } from 'react-router-dom';
import Header from "../theme/header/header";
import Footer from "../theme/footer/footer";
import "./rootLayout.scss"
export default function RootLayout(){
    return (
        <>
          <Header />
          <main>
            <Outlet />  {/* Đây là nơi các trang con sẽ được hiển thị */}
          </main>
          <Footer />
        </>
      );
}