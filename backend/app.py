import os
from flask import Flask
from flask_cors import CORS
from extensions import db  
from config import Config



def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app)

    db.init_app(app)

    
    from routes import routes
    app.register_blueprint(routes)

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
