import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from flask import Blueprint, jsonify  # type: ignore
from flask_jwt_extended import jwt_required, get_jwt_identity  # type: ignore

from database import profiles_collection, users_collection  # type: ignore

dashboard_bp = Blueprint('dashboard', __name__)

def calculate_badges(xp, courses_completed):
    badges = ["Beginner"]
    if xp >= 500:
        badges.append("Intermediate")
    if xp >= 1000:
        badges.append("Advanced")
    if courses_completed >= 5:
        badges.append("AI Explorer")
    if xp >= 5000:
        badges.append("Top Learner")
    return badges

@dashboard_bp.route('/', methods=['GET'])
@jwt_required()
def get_dashboard():
    current_user_email = get_jwt_identity()
    user = users_collection.find_one({"email": current_user_email})
    profile = profiles_collection.find_one({"email": current_user_email})
    
    if not profile or not isinstance(profile, dict):
        profile = {"email": current_user_email, "courses_progress": {}, "streak": 1, "latest_mood": "Neutral"}

    if not isinstance(user, dict):
        user = {"name": "Student", "email": current_user_email}

    courses_progress = profile.get("courses_progress", {})
    if not isinstance(courses_progress, dict):
        courses_progress = {}

    completed_count = 0
    ongoing_count = 0
    xp = 0

    for c_val in courses_progress.values():
        if isinstance(c_val, dict):
            if c_val.get("status") == "Completed":
                completed_count += 1
            elif c_val.get("status") == "Ongoing":
                ongoing_count += 1
    
    # Simple XP logic: 100 XP per completed course + 10 XP per ongoing % progress
    xp = completed_count * 100
    for c_val in courses_progress.values():
        if isinstance(c_val, dict) and c_val.get("status") == "Ongoing":
            xp = xp + int(c_val.get("percentage", 0)) // 10
            
    # Update profile stats
    profiles_collection.update_one(
        {"email": current_user_email},
        {"$set": {
            "learning_stats.courses_completed": completed_count,
            "learning_stats.ongoing_courses": ongoing_count,
            "learning_stats.xp": xp
        }}
    )
    
    badges = calculate_badges(xp, completed_count)
    streak = profile.get("streak", 1)

    return jsonify({
        "name": user.get("name"),
        "total_courses_completed": completed_count,
        "ongoing_courses": ongoing_count,
        "xp": xp,
        "badges": badges,
        "current_streak": streak,
        "recent_mood": profile.get("latest_mood", "Neutral")
    }), 200
