import os
from flask import Flask, jsonify, send_from_directory  # type: ignore
from flask_cors import CORS  # type: ignore
from flask_jwt_extended import JWTManager  # type: ignore
from config import Config

FRONTEND_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'frontend')

app = Flask(__name__, static_folder=FRONTEND_DIR, static_url_path='')
app.config.from_object(Config)

# Enable CORS for frontend integration
CORS(app, supports_credentials=True)
jwt = JWTManager(app)

# Serve all static files (js, css, images, etc.)
@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory(FRONTEND_DIR, path)

@app.route('/health')
def health_check():
    return jsonify({"status": "healthy", "message": "AI Expo Platform API is running!"}), 200

@app.route('/')
def serve_frontend():
    return send_from_directory(FRONTEND_DIR, 'index.html')

from routes.auth_routes import auth_bp  # type: ignore
app.register_blueprint(auth_bp, url_prefix='/api/auth')

from routes.profile_routes import profile_bp  # type: ignore
app.register_blueprint(profile_bp, url_prefix='/api/profile')

from routes.course_routes import course_bp  # type: ignore
app.register_blueprint(course_bp, url_prefix='/api/courses')

from routes.dashboard_routes import dashboard_bp  # type: ignore
app.register_blueprint(dashboard_bp, url_prefix='/api/dashboard')

from routes.ai_routes import ai_bp  # type: ignore
app.register_blueprint(ai_bp, url_prefix='/api/ai')

from routes.features_routes import features_bp  # type: ignore
app.register_blueprint(features_bp, url_prefix='/api/features')

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    debug = os.environ.get('FLASK_ENV', 'development') == 'development'
    app.run(debug=debug, host='0.0.0.0', port=port)
