from app import app
from flask import request, jsonify
from dbconfig import db
from sqlalchemy import text

# 📌 Fetch destinations with package count
@app.route('/destinationss', methods=['GET'])
def get_destinationss():
    query = text("""
        SELECT d.destination_id, d.destination_name, d.longitude, d.latitude, 
               COUNT(t.package_id) AS package_count
        FROM tms_oltp.destination_m d
        LEFT JOIN tms_oltp.tour_package_m t ON d.destination_id = t.destination_id
        WHERE d.is_active = true
        GROUP BY d.destination_id, d.destination_name, d.longitude, d.latitude
    """)

    try:
        result = db.session.execute(query)
        locations = [
            {
                "destination_id": row[0],
                "name": row[1],
                "coords": [row[2], row[3]],
                "package_count": row[4]
            } for row in result
        ]
        return jsonify({"message": "Destinations fetched successfully", "data": locations}), 200
    except Exception as e:
        return jsonify({"message": "Failed to fetch destinations", "error": str(e)}), 500


# 📌 Fetch packages for a specific destination
@app.route('/packagess/<int:destination_id>', methods=['GET'])
def get_packagess(destination_id):
    query = text("""
        SELECT package_id, package_name, description, price, duration, image  
        FROM tms_oltp.tour_package_m
        WHERE destination_id = :destination_id AND availability_status = true
    """)

    try:
        result = db.session.execute(query, {"destination_id": destination_id})
        
        
        packages = [
            {
                "package_id": row[0],
                "package_name": row[1],
                "description": row[2],
                "price": row[3],
                "duration": row[4],
                "image": f"../image/{row[5] if row[5] else 'default-image.jpg'}"
            } for row in result
        ]
        return jsonify({"message": "Packages fetched successfully", "data": packages}), 200
    except Exception as e:
        return jsonify({"message": "Failed to fetch packages", "error": str(e)}), 500
