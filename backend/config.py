import os
from datetime import timedelta

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'super-secret-expo-key'
    MONGO_URI = os.environ.get('MONGO_URI') or 'mongodb://localhost:27017/ai_expo_platform'
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'jwt-secret-expo-key'
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)
    GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY')
