from app import create_app
from extensions import db
from models import QuestionAnswer

app = create_app()

with app.app_context():
    db.create_all()
    print("Tables created successfully")
