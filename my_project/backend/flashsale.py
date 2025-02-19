import pandas as pd
import os
import time
from flask_cors import CORS
from dotenv import load_dotenv
from flask import Flask, jsonify, render_template, request, redirect, url_for
from payos import PayOS, ItemData, PaymentData  # Your PayOS API integration


load_dotenv()
BASE_ANALYSIS_DIR = os.getenv('BASE_ANALYSIS_DIR')
PAYOS_CLIENT_ID = os.getenv("PAYOS_CLIENT_ID")
PAYOS_API_KEY = os.getenv("PAYOS_API_KEY")
PAYOS_CHECKSUM_KEY = os.getenv("PAYOS_CHECKSUM_KEY")
WEB_DOMAIN = os.getenv("WEB_DOMAIN")

payos = PayOS(PAYOS_CLIENT_ID, PAYOS_API_KEY, PAYOS_CHECKSUM_KEY)

app = Flask(__name__)
app.config['TEMPLATES_AUTO_RELOAD'] = True
CORS(app, resources={r"/*": {"origins": "*"}})

# Set the uploads folder (used when handling file uploads).
# IMPORTANT: For serving static files, Flask uses the 'static' folder located relative to your app.
# app.config['UPLOAD_FOLDER'] = r'C:\Users\Cuong Do\Desktop\agritech\my_project\static\uploads'
app.config['UPLOAD_FOLDER'] = r'D:\agritech\my_project\static\uploads'


# Ensure that the UPLOAD_FOLDER exists.
if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])

@app.route("/", methods=["GET"])
def display_products():
    products = []
    try:
        data = pd.read_csv(os.path.join(BASE_ANALYSIS_DIR, 'analysis.csv'))
        required_columns = {
            'product_name', 
            'discount_percentage', 
            'current_price', 
            'original_price', 
            'product_image_url'
        }
        if not required_columns.issubset(data.columns):
            return ("The CSV file must contain 'product_name', 'discount_percentage', 'current_price', "
                    "'original_price', 'product_image_url' and columns."), 400
        products = data.to_dict(orient="records")
        return jsonify(products), 200
    except Exception as e:
        return f"An error occurred while processing the file: {e}", 500

    # return render_template("index.html", products=products)

# @app.route("/", methods=["GET"])
# def api_display_products():
#     try:
#         data = pd.read_csv(os.path.join(BASE_ANALYSIS_DIR, 'analysis.csv'))
#         required_columns = {'product_name', 'discount_percentage', 'current_price', 'original_price', 'product_image_url'}
        
#         if not required_columns.issubset(data.columns):
#             return jsonify({"error": "CSV file must contain the required columns."}), 400
        
#         products = data.to_dict(orient="records")
#         return jsonify(products), 200
#     except Exception as e:
#         return jsonify({"error": f"Error processing file: {e}"}), 500


# @app.route("/payment", methods=["POST"])
# def create_payment_link():
#     try:
#         # Retrieve product information.
#         product_name = request.form.get("product_name")
#         current_price = int(float(request.form.get("current_price")))
        
#         # Retrieve buyer information from the form fields.
#         buyerName = request.form.get("buyerName")
#         buyerEmail = request.form.get("buyerEmail")
#         buyerPhone = request.form.get("buyerPhone")
        
#         # Build a raw description including buyerName, buyerPhone, and product_name.
#         # Truncate to 25 characters as required.
#         raw_description = f"{buyerName}-{buyerPhone}-{product_name}"
#         description = raw_description[:25]
        
#         # Create the payment item and payment data.
#         item = ItemData(name=product_name, quantity=1, price=current_price)
#         payment_data = PaymentData(
#             orderCode=int(time.time()),
#             amount=current_price,
#             description=description,
#             buyerName=buyerName,
#             buyerEmail=buyerEmail,
#             buyerPhone=buyerPhone,
#             items=[item],
#             cancelUrl=WEB_DOMAIN,
#             returnUrl=WEB_DOMAIN
#         )
        
#         # Call your PayOS API to create a payment link.
#         payment_link_response = payos.createPaymentLink(payment_data)
#     except Exception as e:
#         return str(e)
    
#     # Immediately redirect the user to the checkout URL.
#     return redirect(payment_link_response.checkoutUrl)

# @app.route("/payment", methods=["POST"])
# def create_payment_link():
#     try:
#         data = request.get_json()  # Lấy dữ liệu từ JSON thay vì form
#         print("Received data:", data)  # Debug dữ liệu

#         # Kiểm tra dữ liệu có hợp lệ không
#         if not data or "cartItems" not in data or not data["cartItems"]:
#             return jsonify({"error": "Invalid request data"}), 400

#         cart_items = data["cartItems"]
#         buyerName = data["buyerName"]
#         buyerEmail = data["buyerEmail"]
#         buyerPhone = data["buyerPhone"]

#         total_amount = sum(item["price"] * item["quantity"] for item in cart_items)  # Tính tổng tiền
#         print("Total amount:", total_amount)  # Debug số tiền

#         # Chuẩn bị danh sách sản phẩm cho PayOS
#         items = [ItemData(name=item["name"], quantity=item["quantity"], price=int(item["price"])) for item in cart_items]

#         payment_data = PaymentData(
#             orderCode=int(time.time()),
#             amount=total_amount,
#             description=f"{buyerName}-{buyerPhone}"[:25],
#             buyerName=buyerName,
#             buyerEmail=buyerEmail,
#             buyerPhone=buyerPhone,
#             items=items,
#             cancelUrl=WEB_DOMAIN,
#             returnUrl=WEB_DOMAIN
#         )

#         payment_link_response = payos.createPaymentLink(payment_data)
#         return jsonify({"checkoutUrl": payment_link_response.checkoutUrl})

#     except Exception as e:
#         print("Error:", e)
#         return jsonify({"error": str(e)}), 400


@app.route("/payment", methods=["POST"])
def create_payment_link():
    try:
        data = request.get_json()
        cart_items = data["cartItems"]
        buyerName = data["buyerName"]
        buyerEmail = data["buyerEmail"]
        buyerPhone = data["buyerPhone"]

        total_amount = sum(item["price"] * item["quantity"] for item in cart_items)

        items = [ItemData(name=item["name"], quantity=item["quantity"], price=int(item["price"])) for item in cart_items]

        payment_data = PaymentData(
            orderCode=int(time.time()),
            amount=total_amount,
            description=f"{buyerName}-{buyerPhone}"[:25],
            buyerName=buyerName,
            buyerEmail=buyerEmail,
            buyerPhone=buyerPhone,
            items=items,
            cancelUrl=WEB_DOMAIN + "/payment-failed",
            returnUrl=WEB_DOMAIN + "/payment-success"
        )

        payment_link_response = payos.createPaymentLink(payment_data)
        return jsonify({"checkoutUrl": payment_link_response.checkoutUrl})

    except Exception as e:
        return jsonify({"error": str(e)}), 400


# (Optional) Debug route to list files in your uploads folder
@app.route("/check_uploads")
def check_uploads():
    try:
        files = os.listdir(app.config['UPLOAD_FOLDER'])
        return "Files in uploads: " + ", ".join(files)
    except Exception as e:
        return str(e)

if __name__ == "__main__":
    app.run(debug=True)
