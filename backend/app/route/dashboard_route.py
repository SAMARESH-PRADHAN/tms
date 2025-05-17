from app import app
from flask import jsonify
from dbconfig import db
from sqlalchemy import text
from flask import request
from datetime import datetime
from sqlalchemy import text

@app.route("/admin/stats", methods=['GET'])
def get_admin_stats():
    conn = db
    select_query = text("""
        SELECT 
            (SELECT COUNT(*) FROM tms_oltp.user_m) AS total_users,
            (SELECT COUNT(*) FROM tms_oltp.tour_package_m) AS total_packages,
            (SELECT COUNT(*) FROM tms_oltp.destination_m) AS total_destinations,
            (SELECT COUNT(*) FROM tms_oltp.booking_m) AS total_booking
    """)

    try:
        result = conn.session.execute(select_query).fetchone()
        
        stats = {
            "total_users": result[0],
            "total_packages": result[1],
            "total_destinations": result[2],
            "total_booking": result[3]
        }

        return jsonify(stats)

    except Exception as e:
        return jsonify({"message": "Failed to fetch admin stats", "error": str(e)}), 500


@app.route("/admin/user_registrations", methods=["GET"])
def user_registrations():
    conn = db
    start = request.args.get("start")
    end = request.args.get("end")

    try:
        if start and end:
            query = text("""
                SELECT 
                    TO_CHAR(created_on, 'YYYY-MM-DD') AS date,
                    COUNT(*) AS count
                FROM tms_oltp.user_m
                WHERE created_on::date BETWEEN :start AND :end
                GROUP BY TO_CHAR(created_on, 'YYYY-MM-DD')
                ORDER BY date
            """)
            result = conn.session.execute(query, {"start": start, "end": end}).fetchall()
        else:
            query = text("""
                SELECT 
                    TO_CHAR(created_on, 'YYYY-MM-DD') AS date,
                    COUNT(*) AS count
                FROM tms_oltp.user_m
                GROUP BY TO_CHAR(created_on, 'YYYY-MM-DD')
                ORDER BY date
            """)
            result = conn.session.execute(query).fetchall()

        dates = [row[0] for row in result]
        counts = [row[1] for row in result]
        return jsonify({"dates": dates, "counts": counts})

    except Exception as e:
        return jsonify({"message": "Failed to fetch registration data", "error": str(e)}), 500
    




@app.route("/admin/feedback_ratings", methods=["GET"])
def feedback_ratings():
    conn = db
    try:
        query = text("""
            SELECT rate_us, COUNT(*) as count
            FROM tms_oltp.feedback_m
            GROUP BY rate_us
            ORDER BY rate_us
        """)
        result = conn.session.execute(query).fetchall()

        labels = [row[0] for row in result]
        counts = [row[1] for row in result]

        return jsonify({"labels": labels, "counts": counts})
    except Exception as e:
        return jsonify({"message": "Failed to fetch feedback data", "error": str(e)}), 500
