import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from flask import Blueprint, request, jsonify  # type: ignore
from flask_jwt_extended import jwt_required, get_jwt_identity  # type: ignore

from database import profiles_collection  # type: ignore

profile_bp = Blueprint('profile', __name__)

@profile_bp.route('/', methods=['GET'])
@jwt_required()
def get_profile():
    current_user_email = get_jwt_identity()
    profile = profiles_collection.find_one({"email": current_user_email}, {"_id": 0})
    
    if not profile:
        return jsonify({"error": "Profile not found"}), 404
        
    return jsonify({"profile": profile}), 200

@profile_bp.route('/', methods=['PUT'])
@jwt_required()
def update_profile():
    current_user_email = get_jwt_identity()
    data = request.get_json(silent=True) or {}
    
    # Prevent email from being overwritten in profile
    if isinstance(data, dict):
        data.pop('email', None)
        
    result = profiles_collection.update_one(
        {"email": current_user_email},
        {"$set": data}
    )
    
    if result.matched_count == 0:
        return jsonify({"error": "Profile not found"}), 404
        
    updated_profile = profiles_collection.find_one({"email": current_user_email}, {"_id": 0})
    return jsonify({"message": "Profile updated successfully", "profile": updated_profile}), 200
