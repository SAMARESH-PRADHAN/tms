# from flask import Flask, request, jsonify
# from app import app
# from sqlalchemy import text
# from dbconfig import db
# import bcrypt


# # Route to get all users
# @app.route('/users', methods=['GET'])
# def get_users():
#     try:
#         sql = text("SELECT user_id, user_name, email FROM tms_oltp.user_m")
#         result = db.session.execute(sql)
#         users = [{ 'user_id': row.user_id, 'user_name': row.user_name, 'email': row.email } for row in result]
#         return jsonify(users), 200
#     except Exception as e:
#         return jsonify({'message': 'Error fetching users', 'error': str(e)}), 500

# # Route to add a user
# @app.route('/users', methods=['POST'])
# def add_user():
#     data = request.json
#     role_id = 2
#     created_by = 2
#     updated_by = 1
#     hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
#     sql = text("""
#         INSERT INTO tms_oltp.user_m (user_name, email, password, mobile, address, role_id, created_by, updated_by)
#         VALUES (:user_name, :email, :password, :mobile, :address, :role_id, :created_by, :updated_by)
#     """)
#     try:
#         db.session.execute(sql, {'user_name': data['user_name'], 'email': data['email'], 'password': hashed_password, 'mobile': data['mobile'], 'address': data['address'], 'role_id': role_id, 'created_by': created_by, 'updated_by': updated_by})
#         db.session.commit()
#         return jsonify({'message': 'User added successfully'}), 201
#     except Exception as e:
#         db.session.rollback()
#         return jsonify({'message': 'Error adding user', 'error': str(e)}), 500

# # Route to update a user
# @app.route('/users/<int:user_id>', methods=['PUT'])
# def update_user(user_id):
#     data = request.json
#     sql = text("""
#         UPDATE tms_oltp.user_m SET user_name = :user_name, email = :email WHERE user_id = :user_id
#     """)
#     try:
#         result = db.session.execute(sql, {'user_id': user_id, 'user_name': data['user_name'], 'email': data['email']})
#         if result.rowcount == 0:
#             return jsonify({'message': 'User not found'}), 404
#         db.session.commit()
#         return jsonify({'message': 'User updated successfully'})
#     except Exception as e:
#         db.session.rollback()
#         return jsonify({'message': 'Error updating user', 'error': str(e)}), 500

# # Route to delete a user
# @app.route('/users/<int:user_id>', methods=['DELETE'])
# def delete_user(user_id):
#     sql = text("DELETE FROM tms_oltp.user_m WHERE user_id = :user_id")
#     try:
#         result = db.session.execute(sql, {'user_id': user_id})
#         if result.rowcount == 0:
#             return jsonify({'message': 'User not found'}), 404
#         db.session.commit()
#         return jsonify({'message': 'User deleted successfully'})
#     except Exception as e:
#         db.session.rollback()
#         return jsonify({'message': 'Error deleting user', 'error': str(e)}), 500



from flask import Flask, request, jsonify
from app import app
from sqlalchemy import text
from dbconfig import db
import bcrypt

# Route to get all users
@app.route('/users', methods=['GET'])
def get_users():
    try:
        sql = text("SELECT user_id, user_name, email, is_active FROM tms_oltp.user_m")
        result = db.session.execute(sql)
        users = [{
            'user_id': row.user_id,
            'user_name': row.user_name,
            'email': row.email,
            'status': 'Active' if row.is_active else 'Deactivated'
        } for row in result]
        return jsonify(users), 200
    except Exception as e:
        return jsonify({'message': 'Error fetching users', 'error': str(e)}), 500

# Route to add a user
@app.route('/users', methods=['POST'])
def add_user():
    data = request.json
    role_id = 2
    created_by = 2
    updated_by = 1
    hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    sql = text("""
        INSERT INTO tms_oltp.user_m (user_name, email, password, mobile, address, role_id, created_by, updated_by, is_active)
        VALUES (:user_name, :email, :password, :mobile, :address, :role_id, :created_by, :updated_by, :is_active)
    """)
    try:
        db.session.execute(sql, {
            'user_name': data['user_name'], 'email': data['email'], 'password': hashed_password,
            'mobile': data['mobile'], 'address': data['address'], 'role_id': role_id,
            'created_by': created_by, 'updated_by': updated_by, 'is_active': True
        })
        db.session.commit()
        return jsonify({'message': 'User added successfully'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Error adding user', 'error': str(e)}), 500

# Route to update a user
@app.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    data = request.json
    sql = text("""
        UPDATE tms_oltp.user_m SET user_name = :user_name, email = :email WHERE user_id = :user_id
    """)
    try:
        result = db.session.execute(sql, {'user_id': user_id, 'user_name': data['user_name'], 'email': data['email']})
        if result.rowcount == 0:
            return jsonify({'message': 'User not found'}), 404
        db.session.commit()
        return jsonify({'message': 'User updated successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Error updating user', 'error': str(e)}), 500

# Route to activate or deactivate a user
@app.route('/users/<int:user_id>/status', methods=['PUT'])
def update_user_status(user_id):
    data = request.json
    new_status = data.get('is_active', None)
    if new_status is None:
        return jsonify({'message': 'Missing is_active value'}), 400
    
    sql = text("""
        UPDATE tms_oltp.user_m SET is_active = :is_active WHERE user_id = :user_id
    """)
    try:
        result = db.session.execute(sql, {'user_id': user_id, 'is_active': new_status})
        if result.rowcount == 0:
            return jsonify({'message': 'User not found'}), 404
        db.session.commit()
        status_message = 'activated' if new_status else 'deactivated'
        return jsonify({'message': f'User {status_message} successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Error updating user status', 'error': str(e)}), 500
