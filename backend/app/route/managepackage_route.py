import os
from flask import Flask, request, jsonify, send_from_directory
from werkzeug.utils import secure_filename
from app import app
from sqlalchemy import text
from dbconfig import db


# Configure upload folder
IMAGE_FOLDER = os.path.abspath(os.path.join(app.root_path, '../image'))  # Adjust path
app.config["IMAGE_FOLDER"] = IMAGE_FOLDER

# Ensure the upload folder exists
if not os.path.exists(IMAGE_FOLDER):
    os.makedirs(IMAGE_FOLDER)

# Get All Packages (Including Image path)
@app.route('/packages', methods=['GET'])
def get_packages():
    try:
        sql = text("""
            SELECT tp.package_id, tp.package_name, tp.description, tp.price, tp.duration, 
                   tp.availability_status, tp.image, tp.destination_id, dm.destination_name 
            FROM tms_oltp.tour_package_m tp
            LEFT JOIN tms_oltp.destination_m dm ON tp.destination_id = dm.destination_id
            ORDER BY tp.package_id ASC
        """)
        result = db.session.execute(sql)
        packages = []
        for row in result.fetchall():
            image_filename = row[6] if row[6] else "default-image.jpg"  # Ensure default image if none
            image_path = f"../image/{image_filename}" 
            packages.append({
                'package_id': row[0],
                'package_name': row[1],
                'description': row[2],
                'price': row[3],
                'duration': row[4],
                'availability_status': row[5],
                'image': image_path,
                'destination_id': row[7],
                'destination_name': row[8]  # Include Destination Name
            })
        return jsonify(packages), 200
    except Exception as e:
        return jsonify({'message': 'Error fetching packages', 'error': str(e)}), 500    

@app.route('/packages', methods=['POST'])
def add_package():
    try:
        # Retrieve form data correctly
        package_name = request.form.get("package_name")
        description = request.form.get("description")
        price = request.form.get("price")
        duration = request.form.get("duration")
        availability_status = request.form.get("availability_status")
        created_by = 2
        updated_by = 1
        destination_id = request.form.get("destination_id")

        # Handle Image Upload
        image = request.files.get("image")
        filename = None
        if image:
            filename = secure_filename(image.filename)
            image_path = os.path.join(app.config["IMAGE_FOLDER"], filename)
            image.save(image_path)

        # Insert into database
        sql = text("""
            INSERT INTO tms_oltp.tour_package_m 
            (package_name, description, price, duration, availability_status, created_by, updated_by, image, destination_id)
            VALUES (:package_name, :description, :price, :duration, :availability_status, :created_by, :updated_by, :image, :destination_id)
        """)

        db.session.execute(sql, {
            'package_name': package_name,
            'description': description,
            'price': price,
            'duration': duration,
            'availability_status': availability_status,
            'created_by': created_by,
            'updated_by': updated_by,
            'image': filename,
            'destination_id': destination_id
        })
        db.session.commit()

        return jsonify({'message': 'Package added successfully'}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Error adding package', 'error': str(e)}), 500

    
@app.route('/packages/<int:package_id>', methods=['PUT'])
def update_package(package_id):
    try:
        sql_select = text("SELECT image FROM tms_oltp.tour_package_m WHERE package_id = :package_id")
        result = db.session.execute(sql_select, {'package_id': package_id}).fetchone()

        if not result:
            return jsonify({'message': 'Package not found'}), 404

        current_image = result[0] if result[0] else None

        # Get form data
        package_name = request.form.get("package_name")
        description = request.form.get("description")
        price = request.form.get("price")
        duration = request.form.get("duration")
        availability_status = request.form.get("availability_status")
        destination_id = request.form.get("destination_id")

        # Handle Image Update
        image = request.files.get("image")
        filename = current_image
        if image:
            filename = secure_filename(image.filename)
            image.save(os.path.join(app.config["IMAGE_FOLDER"], filename))

        # Update database
        sql_update = text("""
            UPDATE tms_oltp.tour_package_m
            SET package_name = :package_name, description = :description, price = :price, 
                duration = :duration, availability_status = :availability_status, image = :image, destination_id = :destination_id
            WHERE package_id = :package_id
        """)

        db.session.execute(sql_update, {
            'package_id': package_id,
            'package_name': package_name,
            'description': description,
            'price': price,
            'duration': duration,
            'availability_status': availability_status,
            'image': filename,
            'destination_id': destination_id
        })
        db.session.commit()

        return jsonify({'message': 'Package updated successfully', 'image': filename}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Error updating package', 'error': str(e)}), 500


@app.route('/packages/<int:package_id>', methods=['DELETE'])
def delete_package(package_id):
    sql = text("DELETE FROM tms_oltp.tour_package_m WHERE package_id = :package_id")
    try:
        result = db.session.execute(sql, {'package_id': package_id})
        if result.rowcount == 0:
            return jsonify({'message': 'Package not found'}), 404
        db.session.commit()
        return jsonify({'message': 'Package deleted successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Error deleting package', 'error': str(e)}), 500
    



@app.route('/destinationsP', methods=['GET'])
def get_destinations_p():
    try:
        sql = text("SELECT destination_id, destination_name FROM tms_oltp.destination_m")
        result = db.session.execute(sql)
        destinations = [{"destination_id": row[0], "d_name": row[1]} for row in result.fetchall()]
        return jsonify(destinations), 200
    except Exception as e:
        return jsonify({'message': 'Error fetching destinations', 'error': str(e)}), 500



@app.route('/api/packages/filter', methods=['POST'])
def filter_packages():
    data = request.get_json()
    dest = data.get('destination', '')
    min_price = data.get('min_price')
    max_price = data.get('max_price')
    conn = db
    query = """
        SELECT tp.package_id, tp.package_name, tp.description AS package_desc, tp.price, tp.duration, tp.availability_status, tp.image,
               d.d_name, d.longitude, d.latitude, d.description AS destination_desc, d.price AS destination_price
        FROM tour_package_m tp
        JOIN destination_m d ON tp.d_name = d.d_name
        WHERE 1=1
    """
    params = []

    if dest:
        query += " AND d.d_name ILIKE %s"
        params.append(f"%{dest}%")

    if min_price:
        query += " AND tp.price >= %s"
        params.append(min_price)

    if max_price:
        query += " AND tp.price <= %s"
        params.append(max_price)

    cur = conn.cursor()
    cur.execute(query, params)
    rows = cur.fetchall()

    # Convert to list of dicts
    packages = []
    for row in rows:
        package = {
            "package_id": row[0],
            "package_name": row[1],
            "package_description": row[2],
            "price": float(row[3]),
            "duration": row[4],
            "availability_status": row[5],
            "image": row[6],
            "destination": {
                "d_name": row[7],
                "longitude": row[8],
                "latitude": row[9],
                "description": row[10],
                "price": float(row[11])
            }
        }
        packages.append(package)

    return jsonify({"packages": packages})