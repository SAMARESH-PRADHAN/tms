from flask import Flask, request, jsonify
from flask_mail import Mail, Message
from sqlalchemy import text
import random
import string
import bcrypt
from dbconfig import db
from app import app
from config import Config  # Import config file
from sqlalchemy.sql import text  # Ensure text is imported


app.config["DEBUG"] = True  # Enable debug mode
app.config.from_object(Config)  # ✅ Load config settings


mail = Mail(app)



# Generate OTP
def generate_otp():
    return ''.join(random.choices(string.digits, k=6))

# Store OTPs temporarily (use DB in production)
otp_store = {}

# 📌 1️⃣ Request OTP for Password Reset
@app.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.json
    email = data.get('email')

    if not email:
        return jsonify({'message': 'Email is required'}), 400

    try:
        # 🔹 FIXED: Use text() for raw SQL queries
        print("🔍 Checking database connection...")
        db.session.execute(text("SELECT 1"))  # Test DB connection
        print("✅ Database connection successful")

        # Check if email exists
        select_query = text("SELECT user_id FROM tms_oltp.user_m WHERE email = :email")
        result = db.session.execute(select_query, {'email': email}).fetchone()

        if not result:
            return jsonify({'message': 'Email not found'}), 404

        # Generate OTP
        otp = generate_otp()
        otp_store[email] = otp
        print(f"📩 OTP generated: {otp} for {email}")

        # Send OTP via email
        msg = Message('Your OTP for Password Reset', recipients=[email])
        msg.body = f'Your OTP is: {otp}'
        mail.send(msg)

        return jsonify({'message': 'OTP sent successfully'}), 200

    except Exception as e:
        print(f"❌ Error in forgot_password: {str(e)}")
        return jsonify({'message': 'Failed to send OTP', 'error': str(e)}), 500


# 📌 2️⃣ Verify OTP
@app.route('/verify-otp', methods=['POST'])
def verify_otp():
    data = request.json
    email = data.get('email')
    otp = data.get('otp')

    if not email or not otp:
        return jsonify({'message': 'Email and OTP are required'}), 400

    if otp_store.get(email) == otp:
        del otp_store[email]  # Remove OTP after successful verification
        return jsonify({'message': 'OTP verified successfully'}), 200
    else:
        return jsonify({'message': 'Invalid OTP'}), 400

# 📌 3️⃣ Reset Password
@app.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.json
    email = data.get('email')
    new_password = data.get('new_password')

    if not email or not new_password:
        return jsonify({'message': 'Email and new password are required'}), 400

    try:
        # Check if email exists
        select_query = text("SELECT user_id FROM tms_oltp.user_m WHERE email = :email")
        result = db.session.execute(select_query, {'email': email}).fetchone()

        if not result:
            return jsonify({'message': 'User not found'}), 404

        # Hash the new password
        hashed_password = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

        # Update password in DB
        update_query = text("UPDATE tms_oltp.user_m SET password = :password WHERE email = :email")
        db.session.execute(update_query, {'password': hashed_password, 'email': email})
        db.session.commit()

        print(f"✅ Password reset successful for {email}")

        return jsonify({'message': 'Password reset successful'}), 200

    except Exception as e:
        print(f"❌ Error in reset_password: {str(e)}")
        return jsonify({'message': 'Password reset failed', 'error': str(e)}), 500
