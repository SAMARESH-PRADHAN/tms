from app import app
from flask import request, jsonify
from dbconfig import db
from sqlalchemy import text
from datetime import datetime

# ✅ GET all feedbacks
@app.route('/admin/feedbacks', methods=['GET'])
def get_feedbacks():
    try:
        query = text("""
            SELECT id, name, email, rate_us, comments, created_on 
            FROM tms_oltp.feedback_m
            WHERE is_active = true
            ORDER BY created_on DESC
        """)
        
        result = db.session.execute(query)
        feedbacks = []

        for row in result.mappings():
            created_on = row.get("created_on")
            feedbacks.append({
                "feedback_id": row["id"],  # alias for frontend
                "name": row["name"],
                "email": row["email"],
                "rate_us": row["rate_us"],
                "comments": row["comments"],
                "created_on": created_on.strftime("%Y-%m-%d %H:%M:%S") if created_on else None
            })

        return jsonify(feedbacks)

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"message": "Error retrieving feedbacks", "error": str(e)}), 500

# ✅ DELETE a feedback by ID (Soft delete: optional)
@app.route('/admin/feedbacks/<int:feedback_id>', methods=['DELETE'])
def delete_feedback(feedback_id):
    try:
        # If you prefer soft delete (mark as inactive), use the next line instead:
        # query = text("UPDATE tms_oltp.feedback_m SET is_active = false WHERE id = :fid")
        query = text("DELETE FROM tms_oltp.feedback_m WHERE id = :fid")
        
        db.session.execute(query, {"fid": feedback_id})
        db.session.commit()
        return jsonify({"message": "Feedback deleted successfully"})
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error deleting feedback", "error": str(e)}), 500
