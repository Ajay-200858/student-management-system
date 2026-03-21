# backend/app.py
from flask import Flask
from flask_cors import CORS
from routes.auth import auth_bp
from routes.students import students_bp
from routes.marks import marks_bp
from routes.admin import admin_bp
from routes.Feedback import feedback_bp

app = Flask(__name__)
CORS(app)  # Allow React frontend to talk to Flask

# Register all route groups
app.register_blueprint(auth_bp,      url_prefix='/api/auth')
app.register_blueprint(students_bp,  url_prefix='/api/students')
app.register_blueprint(marks_bp,     url_prefix='/api/marks')
app.register_blueprint(admin_bp,     url_prefix='/api/admin')
app.register_blueprint(feedback_bp,  url_prefix='/api/feedback')

if __name__ == '__main__':
    app.run(debug=True, port=5000)