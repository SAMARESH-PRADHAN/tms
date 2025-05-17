from app import app
from flask import Flask,request,jsonify,send_file, render_template,Response
from datetime import datetime
from dbconfig import db
from sqlalchemy import text
import json
import bcrypt




@app.route("/login", methods=['POST'])
def login():
    conn = db
    data = request.json
    email = data.get('email')
    password = data.get('password')

    select_query = text("""
        SELECT user_id, user_name, email, mobile, password, address, role_id, is_active 
        FROM tms_oltp.user_m 
        WHERE email = :email
    """)

    try:
        result = conn.session.execute(select_query, {'email': email}).fetchone()

        if result is None:
            return jsonify({"message": "Invalid email or password"}), 401

        user_details = {
            "user_id": result[0],
            "user_name": result[1],
            "email": result[2],
            "mobile": result[3],
            "address": result[5],
            "role_id": result[6]
        }

        stored_password = result[4]
        is_active = result[7]

        if not is_active:
            return jsonify({"message": "Account is deactivated. Contact support."}), 403

        if bcrypt.checkpw(password.encode('utf-8'), stored_password.encode('utf-8')):
            return jsonify({"message": "Login Successful", "user_details": user_details})
        else:
            return jsonify({"message": "Invalid email or password"}), 401

    except Exception as e:
        return jsonify({"message": "Login Failed", "error": str(e)})
