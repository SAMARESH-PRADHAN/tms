from app import app
from flask import request, jsonify
from dbconfig import db
from sqlalchemy import text
from datetime import datetime


# Get all contacts
@app.route('/admin/contacts', methods=['GET'])
def get_contacts():
    try:
        query = text("""SELECT contact_id, name, email, phone, message, created_on, is_read FROM tms_oltp.contact_m WHERE is_active = true ORDER BY created_on DESC""")

        result = db.session.execute(query)
        contacts = []

        for row in result.mappings():
            created_on = row.get("created_on")
            contacts.append({
                "contact_id": row["contact_id"],
                "name": row["name"],
                "email": row["email"],
                "phone": row["phone"],
                "message": row["message"],
                   "created_on": created_on.strftime("%Y-%m-%d %H:%M:%S") if created_on else None,
                     "is_read": row["is_read"]
            })

        return jsonify(contacts)
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"message": "Error retriving contacts", "error": str(e)}), 500
    


@app.route('/admin/contact/read/<int:contact_id>', methods=['POST'])
def mark_as_read(contact_id):
    try:
        query = text("""
            UPDATE tms_oltp.contact_m
            SET is_read = true, updated_on = now()
            WHERE contact_id = :contact_id
        """)
        db.session.execute(query, {'contact_id': contact_id})
        db.session.commit()
        return jsonify({"message": "Marked as read"}), 200
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
