import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "../../components/productCard/productCard";
import "./homePage.scss";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get("http://127.0.0.1:5000")
      .then(response => {
        const updatedProducts = response.data.map(product => {
          let imgUrl = product.product_image_url;
          if (!imgUrl.startsWith('http')) {
            if (imgUrl.startsWith('C:') || imgUrl.includes('\\')) {
              imgUrl = `http://127.0.0.1:5000/static/${imgUrl.replace(/\\/g, '/').split('static/').pop()}`;
            } else if (imgUrl.startsWith('uploads/')) {
              imgUrl = `http://127.0.0.1:5000/static/${imgUrl}`;
            }
          }
          return { ...product, product_image_url: imgUrl };
        });
        setProducts(updatedProducts);
      })
      .catch(() => setError("Failed to load products"));
  }, []);

  return (
    <div className="content">
      <h2>Sản phẩm nổi bật</h2>
      <div className="row">
        {products.map((item, index) => (
          <div className="card" key={index}>
            <ProductCard
              name={item.product_name}
              img={item.product_image_url}
              price={item.current_price}
              originalPrice={item.original_price}
              discount={item.discount_percentage}
            />
          </div>
        ))}
      </div>
    </div>
  );
}