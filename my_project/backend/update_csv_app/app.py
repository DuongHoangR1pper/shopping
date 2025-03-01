import pandas as pd
import os
import time
from flask_cors import CORS
from dotenv import load_dotenv
from flask import Flask, jsonify, render_template, request, redirect, url_for
from payos import PayOS, ItemData, PaymentData

load_dotenv()
BASE_ANALYSIS_DIR = os.getenv(r'BASE_ANALYSIS_DIR')
PAYOS_CLIENT_ID = os.getenv("PAYOS_CLIENT_ID")
PAYOS_API_KEY = os.getenv("PAYOS_API_KEY")
PAYOS_CHECKSUM_KEY = os.getenv("PAYOS_CHECKSUM_KEY")
PAYOS_PARTNER_CODE = os.getenv("PAYOS_PARTNER_CODE")
WEB_DOMAIN = os.getenv("WEB_DOMAIN")

payos = PayOS(PAYOS_CLIENT_ID, PAYOS_API_KEY, PAYOS_CHECKSUM_KEY, PAYOS_PARTNER_CODE)
BASE_PROJECT_DIR = os.getenv("BASE_PROJECT_DIR")
app = Flask(__name__)
app.config['TEMPLATES_AUTO_RELOAD'] = True
CORS(app, resources={r"/*": {"origins": "*"}})


# @app.route("/")
# def display_products():
#     products = []
#     try:
#         data = pd.read_csv(os.path.join(BASE_ANALYSIS_DIR, 'analysis.csv'))

#         if not {'product_name', 'discount_percentage', 'current_price', 'original_price', 'product_image_url'}.issubset(data.columns):
#             return "The CSV file must contain 'product_name', 'discount_percentage', 'current_price', 'original_price', 'product_image_url', and columns.", 400

#         products = data.to_dict(orient="records")
#     except Exception as e:
#         return f"An error occurred while processing the file: {e}", 500


#     return render_template("index.html", products=products)


@app.route("/", methods=["GET"])
def display_products():
    products = []
    try:
        data = pd.read_csv(os.path.join(BASE_ANALYSIS_DIR, "analysis.csv"))
        required_columns = {
            "product_name",
            "discount_percentage",
            "current_price",
            "original_price",
            "product_image_url",
        }
        if not required_columns.issubset(data.columns):
            return (
                "The CSV file must contain 'product_name', 'discount_percentage', 'current_price', "
                "'original_price', 'product_image_url' and columns."
            ), 400
        products = data.to_dict(orient="records")
        return jsonify(products), 200
    except Exception as e:
        return f"An error occurred while processing the file: {e}", 500


@app.route("/payment", methods=["POST"])
def create_payment_link():
    try:
        product_name = request.form.get("product_name")
        current_price = int(float(request.form.get("current_price")))
        item = ItemData(name=product_name, quantity=1, price=current_price)
        payment_data = PaymentData(
            orderCode=int(time.time()),
            amount=current_price,
            description="Thanh toan don hang",
            items=[item],
            cancelUrl=WEB_DOMAIN,
            returnUrl=WEB_DOMAIN
            # cancelUrl=WEB_DOMAIN + "/cancel.html",
            # returnUrl=WEB_DOMAIN + "/payment_status"
        )
        payment_link_response = payos.createPaymentLink(payment_data)
    except Exception as e:
        return str(e)

    return redirect(payment_link_response.checkoutUrl)

if __name__ == "__main__":
    app.run(debug=True)
