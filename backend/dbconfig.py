# import os
# from app import app
# from flask_sqlalchemy import SQLAlchemy
# from sqlalchemy.pool import NullPool
# import urllib.parse

# POSTGRES_URL="localhost"
# POSTGRES_USER="postgres"

# POSTGRES_PASSWORD="saswat@123"
# encoded_password = urllib.parse.quote(POSTGRES_PASSWORD)
# POSTGRES_DB="tms"
# DB_URL = 'postgresql+psycopg2://{user}:{pw}@{url}/{db}'.format(user=POSTGRES_USER,pw=encoded_password,url=POSTGRES_URL,db=POSTGRES_DB)
# app.config['SQLALCHEMY_DATABASE_URI']=DB_URL
# app.config['SQLALCHEMY_Track_MODIFICATIONS']=False
# app.config['SQLALCHEMY_ENGINE_OPTIONS']={'poolclass':NullPool}
# db=  SQLAlchemy(app)




import os
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.pool import NullPool
from dotenv import load_dotenv

load_dotenv()

db = SQLAlchemy()

def init_db(app):
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("DATABASE_URL")
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
        "poolclass": NullPool
    }
    db.init_app(app)


  # Optional: test connection
    with app.app_context():
        try:
            conn = db.engine.connect()
            print("✅ Connected to Neon successfully!")
            conn.close()
        except Exception as e:
            print("❌ Failed to connect to Neon:", e)