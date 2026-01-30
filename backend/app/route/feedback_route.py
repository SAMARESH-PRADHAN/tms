from app import app
from flask import Flask,request,jsonify,send_file, render_template,Response
from datetime import datetime
from dbconfig import db
from sqlalchemy import text
import json


# Route to submit feedback
@app.route('/feedback', methods=['POST'])
def submit_feedback():
    conn = db
    data = request.json
    name = data.get('name')
    email = data.get('email')
    rate_us = data.get('rating')
    comments = data.get('comments')

    if not all([name, email, rate_us, comments]):
        return jsonify({"message": "All fields are required"}), 400
    insert_query = text("""INSERT INTO public.feedback_m(name, email, rate_us, comments)
                      VALUES (:name, :email, :rate_us, :comments)""")
    
    try:
      conn.session.execute(insert_query, {'name' : name, 'email': email, 'rate_us' : rate_us, 'comments': comments })
      conn.session.commit()
      return jsonify({"message": "Feddback submited  Successfully"})
    except Exception as e:
     conn.session.rollback()
     return jsonify({"message": "Feddback submited Unsuccessful", "error": str(e)})