import "./paymentFailed.scss"
export function PaymentFailed() {
    return (
      <div className="payment-result">
        <h2>Thanh toán thất bại!</h2>
        <p>Vui lòng thử lại hoặc liên hệ hỗ trợ.</p>
        <a href="/">Quay về trang chủ</a>
      </div>
    );
  }