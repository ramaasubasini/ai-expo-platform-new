import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from flask import Blueprint, request, jsonify  # type: ignore
from flask_jwt_extended import jwt_required, get_jwt_identity, verify_jwt_in_request  # type: ignore

from database import courses_collection, profiles_collection  # type: ignore

course_bp = Blueprint('course', __name__)

@course_bp.route('/', methods=['GET'])
def get_courses():
    """Get all courses - works both with and without login"""
    courses_cursor = courses_collection.find({}, {"_id": 0})
    courses = list(courses_cursor)
    
    # Try to get user progress if logged in, but don't fail if not
    user_progress = {}
    try:
        verify_jwt_in_request(optional=True)
        current_user_email = get_jwt_identity()
        if current_user_email:
            profile = profiles_collection.find_one({"email": current_user_email})
            if profile and isinstance(profile, dict):
                user_progress = profile.get("courses_progress", {})
    except Exception:
        pass  # No valid token - just show courses without progress
    
    if not isinstance(user_progress, dict):
        user_progress = {}
        
    for course in courses:
        title = course.get("title", "")
        course_data = user_progress.get(title, {})
        
        if isinstance(course_data, dict) and course_data:
            course["progress"] = course_data.get("percentage", 0)
            course["status"] = course_data.get("status", "Not Started")
        else:
            course["progress"] = 0
            course["status"] = "Not Started"
    
    return jsonify({"courses": courses}), 200

@course_bp.route('/progress', methods=['POST'])
@jwt_required()
def update_progress():
    data = request.get_json(silent=True) or {}
    course_title = data.get('course_title')
    progress_percentage = data.get('progress')
    
    if not course_title or progress_percentage is None:
        return jsonify({"error": "Missing course_title or progress"}), 400
        
    current_user_email = get_jwt_identity()
    
    status = "Ongoing"
    if int(progress_percentage) >= 100:
        status = "Completed"
        
    profiles_collection.update_one(
        {"email": current_user_email},
        {"$set": {f"courses_progress.{course_title}": {
            "percentage": progress_percentage,
            "status": status
        }}},
        upsert=True
    )
    
    # Also update user XP and completed courses count
    from database import users_collection  # type: ignore
    if status == "Completed":
        user = users_collection.find_one({"email": current_user_email})
        if isinstance(user, dict):
            users_collection.update_one(
                {"email": current_user_email},
                {"$inc": {"xp": 100, "completed_courses": 1}}
            )
    
    return jsonify({"message": f"Progress updated for {course_title}"}), 200
