import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from flask import Blueprint, request, jsonify  # type: ignore
from datetime import datetime, timedelta
from flask_jwt_extended import create_access_token  # type: ignore

from database import users_collection, otp_collection, profiles_collection  # type: ignore
from utils import hash_password, verify_password, generate_otp, send_dummy_email  # type: ignore

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json(silent=True) or {}
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    phone = data.get('phone')

    if not name or not email or not password or not phone:
        return jsonify({"error": "Missing required fields"}), 400

    if users_collection.find_one({"email": email}):
        return jsonify({"error": "Email already registered"}), 400

    hashed_pw = hash_password(password)
    
    # Create unverified user
    new_user = {
        "name": name,
        "email": email,
        "password": hashed_pw,
        "phone": phone,
        "is_verified": False,
        "created_at": datetime.utcnow()
    }
    users_collection.insert_one(new_user)

    # Generate OTP
    otp = generate_otp()
    expiry = datetime.utcnow() + timedelta(minutes=5)
    
    otp_collection.update_one(
        {"email": email},
        {"$set": {"otp": otp, "expiry": expiry}},
        upsert=True
    )

    send_dummy_email(email, "AI EXPO - Registration OTP", f"Your verification code is: {otp}\nIt will expire in 5 minutes.")

    return jsonify({
        "message": "Registration successful. Please verify OTP sent to your email.",
        "dummy_otp": otp
    }), 201

@auth_bp.route('/verify-otp', methods=['POST'])
def verify_otp():
    data = request.get_json(silent=True) or {}
    email = data.get('email')
    otp = data.get('otp')

    record = otp_collection.find_one({"email": email})
    if not record:
        return jsonify({"error": "No OTP found for this email"}), 400

    if not isinstance(record, dict):
        return jsonify({"error": "Invalid record format"}), 500

    if datetime.utcnow() > record.get('expiry', datetime.utcnow()):
        return jsonify({"error": "OTP has expired"}), 400

    if record.get('otp') != otp:
        return jsonify({"error": "Invalid OTP"}), 400

    # Mark user as verified
    user = users_collection.find_one({"email": email})
    users_collection.update_one({"email": email}, {"$set": {"is_verified": True}})
    otp_collection.delete_one({"email": email})
    
    if not isinstance(user, dict):
        user = {}

    # Initialize an empty profile for the new user if it doesn't exist
    if not profiles_collection.find_one({"email": email}):
        profiles_collection.insert_one({
            "email": email,
            "name": user.get('name', ''),
            "gender": "",
            "dob": "",
            "age": None,
            "phone": user.get('phone', ''),
            "address": "",
            "profile_photo": "",
            "academic_info": {
                "college_name": "",
                "department": "",
                "year": "",
                "cgpa": ""
            },
            "skills": {
                "technical": [],
                "soft": [],
                "level": ""
            },
            "learning_stats": {
                "courses_completed": 0,
                "ongoing_courses": 0,
                "projects_completed": 0,
                "certificates_count": 0,
                "hackathons_participated": 0,
                "xp": 0
            },
            "interests": [],
            "achievements": [],
            "ai_insights": {
                "learning_speed": "Calculating...",
                "career_recommendation": "Not enough data",
                "weakness": "None detected",
                "strength": "None detected"
            }
        })

    return jsonify({"message": "Email verified successfully"}), 200

@auth_bp.route('/resend-otp', methods=['POST'])
def resend_otp():
    email = (request.get_json(silent=True) or {}).get('email')
    if not users_collection.find_one({"email": email}):
        return jsonify({"error": "User not found"}), 404

    otp = generate_otp()
    expiry = datetime.utcnow() + timedelta(minutes=5)
    
    otp_collection.update_one(
        {"email": email},
        {"$set": {"otp": otp, "expiry": expiry}},
        upsert=True
    )
    
    send_dummy_email(email, "AI EXPO - New OTP", f"Your new verification code is: {otp}\nIt will expire in 5 minutes.")
    return jsonify({"message": "New OTP sent to email", "dummy_otp": otp}), 200

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json(silent=True) or {}
    email = data.get('email')
    password = data.get('password')

    user = users_collection.find_one({"email": email})
    if not user or not isinstance(user, dict):
        return jsonify({"error": "Invalid email or password"}), 401

    if not verify_password(user.get('password', ''), password):
        return jsonify({"error": "Invalid email or password"}), 401

    if not user.get('is_verified', False):
        return jsonify({"error": "Please verify your email first", "requires_verification": True}), 403

    access_token = create_access_token(identity=email)
    return jsonify({
        "message": "Login successful",
        "access_token": access_token,
        "name": user.get('name'),
        "email": user.get('email')
    }), 200

@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    email = (request.get_json(silent=True) or {}).get('email')
    user = users_collection.find_one({"email": email})
    if not user:
        # Avoid user enumeration by returning a generic success message
        return jsonify({"message": "If that email exists, a reset link/OTP has been sent."}), 200

    otp = generate_otp()
    expiry = datetime.utcnow() + timedelta(minutes=5)
    
    otp_collection.update_one(
        {"email": email, "type": "password_reset"},
        {"$set": {"otp": otp, "expiry": expiry}},
        upsert=True
    )
    
    send_dummy_email(email, "AI EXPO - Password Reset", f"Your password reset code is: {otp}\nExpires in 5 mins.")
    return jsonify({"message": "If that email exists, a reset link/OTP has been sent.", "dummy_otp": otp}), 200

@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json(silent=True) or {}
    email = data.get('email')
    otp = data.get('otp')
    new_password = data.get('new_password')

    record = otp_collection.find_one({"email": email, "type": "password_reset"})
    if not record or not isinstance(record, dict):
        return jsonify({"error": "Invalid or expired OTP"}), 400

    if record.get('otp') != otp:
        return jsonify({"error": "Invalid or expired OTP"}), 400
        
    if datetime.utcnow() > record.get('expiry', datetime.utcnow()):
        return jsonify({"error": "OTP has expired"}), 400

    hashed_pw = hash_password(new_password)
    users_collection.update_one({"email": email}, {"$set": {"password": hashed_pw}})
    otp_collection.delete_one({"email": email, "type": "password_reset"})

    return jsonify({"message": "Password reset successfully"}), 200
