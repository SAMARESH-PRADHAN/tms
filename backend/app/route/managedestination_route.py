from flask import Flask, request, jsonify
from app import app
from sqlalchemy import text
from dbconfig import db

# Get All Destinations
@app.route('/destinations', methods=['GET'])
def get_destinations():
    try:
        sql = text("SELECT destination_id, destination_name, longitude, latitude, is_active FROM tms_oltp.destination_m")
        result = db.session.execute(sql)
        destinations = [{
            'destination_id': row.destination_id,
            'destination_name': row.destination_name,
            'longitude': row.longitude,
            'latitude': row.latitude,
            'is_active': row.is_active
        } for row in result]
        return jsonify(destinations), 200
    except Exception as e:
        return jsonify({'message': 'Error fetching destinations', 'error': str(e)}), 500

# Add a Destination
@app.route('/destinations', methods=['POST'])
def add_destination():
    data = request.json
    print("Received Data:", data)
    sql = text("""
        INSERT INTO tms_oltp.destination_m (destination_name, longitude, latitude, is_active)
        VALUES (:destination_name, :longitude, :latitude, :is_active)
        RETURNING destination_id
    """)
    try:
        result = db.session.execute(sql, {
            'destination_name': data['destination_name'],
            'longitude': float(data['longitude']),
            'latitude': float(data['latitude']),
            'is_active': data.get('is_active', True)
        })
        destination_id = result.fetchone()[0]  # Get newly inserted ID
        db.session.commit()
        return jsonify({'message': 'Destination added successfully', 'destination_id': destination_id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Error adding destination', 'error': str(e)}), 500


# Update a Destination
@app.route('/destinations/<int:destination_id>', methods=['PUT'])
def update_destination(destination_id):
    data = request.json
    sql = text("""
        UPDATE tms_oltp.destination_m SET
        destination_name = :destination_name,
        longitude = :longitude,
        latitude = :latitude
        WHERE destination_id = :destination_id
    """)
    try:
        result = db.session.execute(sql, {
            'destination_id': destination_id,  # FIXED
            'destination_name': data['destination_name'],
            'longitude': data['longitude'],
            'latitude': data['latitude']
        })
        if result.rowcount == 0:
            return jsonify({'message': 'Destination not found'}), 404
        db.session.commit()
        return jsonify({'message': 'Destination updated successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Error updating destination', 'error': str(e)}), 500


# Activate/Deactivate a Destination
@app.route('/destinations/<int:destination_id>/toggle', methods=['PUT'])
def toggle_active_status(destination_id):
    data = request.json
    is_active = data.get('is_active')
    sql = text("""
        UPDATE tms_oltp.destination_m
        SET is_active = :is_active
        WHERE destination_id = :destination_id
    """)
    try:
        db.session.execute(sql, {'is_active': is_active, 'destination_id': destination_id})
        db.session.commit()
        return jsonify({'message': f"Destination {'activated' if is_active else 'deactivated'} successfully"})
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Error toggling destination status', 'error': str(e)}), 500

# Delete a Destination
# @app.route('/destinations/<int:destination_id>', methods=['DELETE'])
# def delete_destination(destination_id):
#     sql = text("DELETE FROM tms_oltp.destination_m WHERE destination_id = :destination_id")
#     try:
#         result = db.session.execute(sql, {'destination_id': destination_id})
#         if result.rowcount == 0:
#             return jsonify({'message': 'Destination not found'}), 404
#         db.session.commit()
#         return jsonify({'message': 'Destination deleted successfully'})
#     except Exception as e:
#         db.session.rollback()
#         return jsonify({'message': 'Error deleting destination', 'error': str(e)}), 500
