from flask import Flask, request, jsonify
from datetime import datetime
from dbconfig import db
from sqlalchemy import text
from app import app


@app.route("/contact", methods=['POST'])
def submit_contact():
    conn = db
    data = request.json
    name = data.get('name')
    email = data.get('email')
    phone = data.get('phone')
    message = data.get('message')
    created_by = 2  # Change as required
    updated_by = 1  # Change as required

    # Validate input fields
    if not all([name, email, phone, message]):
        return jsonify({"message": "All fields are required"}), 400

    insert_query = text("""
        INSERT INTO tms_oltp.contact_m(name, email, phone, message, created_by, updated_by) 
        VALUES(:name, :email, :phone, :message, :created_by, :updated_by)
    """)

    try:
        conn.session.execute(insert_query, {
            'name': name,
            'email': email,
            'phone': phone,
            'message': message,
            'created_by': created_by,
            'updated_by': updated_by
        })
        conn.session.commit()
        return jsonify({"message": "Contact submitted successfully"}), 200
    except Exception as e:
        conn.session.rollback()
        return jsonify({"message": "Error submitting contact", "error": str(e)}), 500


