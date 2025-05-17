from flask import Flask, request, jsonify, session
from dbconfig import db
from sqlalchemy import text
from datetime import datetime
from app import app





# Create a new booking
@app.route('/book', methods=['POST'])
def create_booking():
    
    
    data = request.json
    user_id = data.get("user_id")
    package_id = data.get("package_id")
    booking_date = datetime.today().date()
    travel_date = data.get("travel_date")
    num_people = data.get("num_people")
    total_price = data.get("total_price")

    try:
        insert_query = text("""
            INSERT INTO tms_oltp.booking_m (booking_date, travel_date, num_people, total_price, user_id, package_id)
            VALUES (:booking_date, :travel_date, :num_people, :total_price, :user_id, :package_id)
        """)
        
        db.session.execute(insert_query, {
            "booking_date": booking_date,
            "travel_date": travel_date,
            "num_people": num_people,
            "total_price": total_price,
            "user_id": user_id,
            "package_id": package_id
        })
        db.session.commit()
        
        return jsonify({"success": True, "message": "Booking confirmed!"}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "message": str(e)}), 500


@app.route('/packagesss/<int:package_id>', methods=['GET'])
def get_package_details(package_id):
    try:
        sql = text("""
            SELECT package_name, price 
            FROM tms_oltp.tour_package_m 
            WHERE package_id = :package_id
        """)
        result = db.session.execute(sql, {"package_id": package_id}).fetchone()

        if result:
            return jsonify({
                "success": True,
                "message": "Package details fetched successfully",  # Added success message
                "package_name": result[0],
                "price": float(result[1])  # Ensure price is sent as a number
            }), 200
        else:
            return jsonify({"success": False, "message": "Package not found"}), 404

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

from sqlalchemy import text
from flask import jsonify

@app.route("/admin/bookingss", methods=["GET"])
def get_all_bookings():
    try:
        sql = text("""
            SELECT 
                b.booking_id, b.booking_date, b.travel_date, b.num_people, b.total_price,
                json_build_object(
                    'user_id', u.user_id,
                    'user_name', u.user_name,
                    'email', u.email,
                    'mobile', u.mobile,
                    'address', u.address
                ) AS user_info,
                json_build_object(
                    'package_id', p.package_id,
                    'package_name', p.package_name,
                    'description', p.description,
                    'price', p.price,
                    'duration', p.duration,
                    'image', p.image
                ) AS package_info
            FROM tms_oltp.booking_m b
            JOIN tms_oltp.user_m u ON u.user_id = b.user_id
            JOIN tms_oltp.tour_package_m p ON p.package_id = b.package_id
            ORDER BY b.booking_id DESC;
        """)

        result = db.session.execute(sql).fetchall()

        if result:
            bookings = []
            for row in result:
                bookings.append({
                    "booking_id": row[0],
                    "booking_date": str(row[1]),
                    "travel_date": str(row[2]),
                    "num_people": row[3],
                    "total_price": float(row[4]),
                    "user_info": row[5],
                    "package_info": row[6]
                })

            return jsonify({
                "success": True,
                "message": "All booking details fetched successfully",
                "data": bookings
            }), 200
        else:
            return jsonify({"success": False, "message": "No bookings found"}), 404

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
