import bcrypt
from app import app
from flask import Flask,request,jsonify,send_file, render_template,Response
from datetime import datetime
from dbconfig import db
from sqlalchemy import text
import json


@app.route("/registration", methods=['POST'])
def registration():
  conn = db
  data = request.json
  user_name = data.get('user_name')
  print(user_name)
  email = data.get('email')
  password = data.get('password')
  mobile = data.get('mobile')
  address = data.get('address')
  # role_id = 1 #zaqaqzkebnlbktnl
  role_id = 2
  created_by = 2
  updated_by = 1

  if not all([user_name, email, password, mobile, address]):
        return jsonify({"message": "All fields are required"}), 400
  hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

  insert_query = text("""INSERT INTO tms_oltp.user_m(user_name, email, password, mobile, address, role_id, created_by, updated_by)
                      VALUES (:user_name, :email, :password, :mobile, :address, :role_id, :created_by, :updated_by)""")
  
  try:
      conn.session.execute(insert_query, {'user_name': user_name, 'email': email, 'password': hashed_password, 'mobile': mobile, 'address': address, 'role_id': role_id, 'created_by': created_by, 'updated_by': updated_by })
      conn.session.commit()
      return jsonify({"message": "Register Successfully"})
  except Exception as e:
     conn.session.rollback()
     return jsonify({"message": "Register Unsuccessful", "error": str(e)})