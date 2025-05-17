import os
from app import app
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.pool import NullPool
import urllib.parse

POSTGRES_URL="localhost"
POSTGRES_USER="postgres"

POSTGRES_PASSWORD="saswat@123"
encoded_password = urllib.parse.quote(POSTGRES_PASSWORD)
POSTGRES_DB="tms"
DB_URL = 'postgresql+psycopg2://{user}:{pw}@{url}/{db}'.format(user=POSTGRES_USER,pw=encoded_password,url=POSTGRES_URL,db=POSTGRES_DB)
app.config['SQLALCHEMY_DATABASE_URI']=DB_URL
app.config['SQLALCHEMY_Track_MODIFICATIONS']=False
app.config['SQLALCHEMY_ENGINE_OPTIONS']={'poolclass':NullPool}
#app.secret_key = 'manas'
db=  SQLAlchemy(app)


