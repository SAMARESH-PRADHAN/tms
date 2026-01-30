from flask import Flask
from flask_cors import CORS
from dbconfig import init_db

app = Flask(__name__)
CORS(app)

# ✅ initialize database (Supabase)
init_db(app)

from app.route import login_route
from app.route import registration_route
from app.route import userdetail_route
from app.route import managepackage_route
from app.route import feedback_route
from app.route import point_route
from app.route import managedestination_route
from app.route import dashboard_route
from app.route import booking_route
from app.route import forgot_route
from app.route import contact_route
from app.route import sfeedback_route
from app.route import scontact_route