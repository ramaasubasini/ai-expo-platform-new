import re
import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from flask import Blueprint, request, jsonify  # type: ignore
from flask_jwt_extended import jwt_required, get_jwt_identity  # type: ignore
from datetime import datetime
from textblob import TextBlob  # type: ignore

from database import moods_collection, profiles_collection  # type: ignore

ai_bp = Blueprint('ai', __name__)

@ai_bp.route('/mood/text', methods=['POST'])
@jwt_required()
def analyze_text_mood():
    data = request.get_json(silent=True) or {}
    text = data.get('text', '')
    
    # text sentiment analysis
    blob = TextBlob(text)
    polarity = blob.sentiment.polarity
    
    if polarity > 0.5:
        mood = "Excited"
    elif polarity > 0.1:
        mood = "Happy"
    elif polarity < -0.5:
        mood = "Angry"
    elif polarity < -0.1:
        mood = "Sad"
    else:
        lower_text = text.lower()
        if "confused" in lower_text or "help" in lower_text:
            mood = "Confused"
        elif "stress" in lower_text or "hard" in lower_text:
            mood = "Stress"
        else:
            mood = "Neutral"

    current_user_email = get_jwt_identity()
    mood_entry = {
        "email": current_user_email,
        "mood": mood,
        "source": "text",
        "text_analyzed": text,
        "timestamp": datetime.utcnow()
    }
    moods_collection.insert_one(mood_entry)
    
    profiles_collection.update_one(
        {"email": current_user_email},
        {"$set": {"latest_mood": mood}}
    )

    return jsonify({"mood": mood, "message": f"Mood detected as {mood}"}), 200

@ai_bp.route('/mood/camera', methods=['POST'])
@jwt_required()
def log_camera_mood():
    data = request.get_json(silent=True) or {}
    detected_mood = data.get('mood', 'Neutral')
    current_user_email = get_jwt_identity()
    
    mood_entry = {
        "email": current_user_email,
        "mood": detected_mood,
        "source": "camera",
        "timestamp": datetime.utcnow()
    }
    moods_collection.insert_one(mood_entry)
    
    profiles_collection.update_one(
        {"email": current_user_email},
        {"$set": {"latest_mood": detected_mood}}
    )
    
    return jsonify({"message": "Camera mood logged successfully", "mood": detected_mood}), 200

@ai_bp.route('/tutor/chat', methods=['POST'])
@jwt_required()
def tutor_chat():
    data = request.json
    message = data.get('message', '').lower()
    
    reply = "I'm your AI Expo Tutor! How can I help you today?"
    suggested_course = None
    
    if "python" in message:
        reply = "Python is a great language for AI! It emphasizes readability and has powerful libraries like Pandas and TensorFlow."
        suggested_course = "Python"
    elif "java" in message:
        reply = "Java is strongly typed and perfect for enterprise systems."
        suggested_course = "Java"
    elif "web" in message or "html" in message:
        reply = "Web development usually starts with HTML, CSS, and JavaScript. You should check out our React or Next.js courses."
        suggested_course = "React JS"
    elif "ai" in message or "machine learning" in message:
        reply = "Artificial Intelligence concepts cover neural networks, classification, regression, and more. Highly recommended for the future!"
        suggested_course = "Machine Learning"
    elif "error" in message or "bug" in message or "help" in message:
        reply = "Don't stress! Debugging is normal. Try checking your error message on StackOverflow or let me know the specific error."
    else:
        reply = f"That's an interesting point about '{message}'. Make sure to keep up your daily streak and explore our extensive course catalog!"
        
    response_data = {"reply": reply}
    if suggested_course:
        response_data["suggested_course"] = suggested_course
        
    return jsonify(response_data), 200

@ai_bp.route('/resume/analyze', methods=['POST'])
@jwt_required()
def analyze_resume():
    data = request.get_json(silent=True) or {}
    text = data.get('text', '')
    
    if not text or len(text.strip()) < 30:
        return jsonify({"error": "Please paste your full resume text (minimum 30 characters)."}), 400
    
    score: int = 100
    suggestions = []
    lower: str = str(text).lower()
    lines = text.strip().split('\n')
    words = text.split()
    word_count = len(words)
    
    # ──── 1. SECTION CHECKS (deduct up to 40 points) ────
    critical_sections = {
        'education': ['education', 'academic', 'university', 'college', 'degree', 'b.tech', 'b.e', 'bsc', 'msc', 'mba'],
        'experience': ['experience', 'work history', 'employment', 'intern', 'internship', 'worked at', 'role'],
        'skills': ['skills', 'technical skills', 'technologies', 'proficiency', 'competencies'],
        'projects': ['project', 'projects', 'portfolio', 'built', 'developed', 'created'],
        'contact': ['email', 'phone', 'linkedin', 'github', '@', '+91', '+1']
    }
    
    for section, keywords in critical_sections.items():
        found = any(kw in lower for kw in keywords)
        if not found:
            score -= 8
            suggestions.append({
                "type": "critical",
                "text": f"Missing '{section.upper()}' section — Add a clear {section} section to your resume."
            })
    
    # ──── 2. ACTION VERBS CHECK (deduct up to 15 points) ────
    action_verbs = ['developed', 'designed', 'implemented', 'managed', 'led', 'created',
                    'built', 'launched', 'optimized', 'improved', 'reduced', 'increased',
                    'achieved', 'delivered', 'automated', 'architected', 'collaborated',
                    'spearheaded', 'engineered', 'deployed', 'maintained', 'analyzed',
                    'resolved', 'streamlined', 'mentored', 'executed', 'integrated']
    
    found_verbs = [v for v in action_verbs if v in lower]
    verb_count = len(found_verbs)
    
    if verb_count == 0:
        score -= 15
        suggestions.append({
            "type": "critical",
            "text": "No action verbs found! Use strong verbs like 'Developed', 'Designed', 'Led', 'Optimized' to describe your achievements."
        })
    elif verb_count < 3:
        score -= 8
        suggestions.append({
            "type": "warning",
            "text": f"Only {verb_count} action verb(s) detected. Professional resumes typically use 5+ varied action verbs. Try: 'Implemented', 'Architected', 'Streamlined'."
        })
    elif verb_count >= 5:
        suggestions.append({
            "type": "good",
            "text": f"Excellent! {verb_count} strong action verbs detected ({', '.join(list(found_verbs)[:5])})."
        })
    
    # ──── 3. QUANTIFIABLE METRICS (deduct up to 12 points) ────
    numbers = re.findall(r'\d+[%+xX]|\d+\s*(?:users|customers|requests|projects|clients|team|members|months|years)', text)
    percentage_matches = re.findall(r'\d+\s*%', text)
    
    if len(numbers) == 0 and len(percentage_matches) == 0:
        score -= 12
        suggestions.append({
            "type": "critical",
            "text": "No quantifiable metrics found. Add numbers like 'Reduced load time by 40%', 'Served 10K+ users', 'Led a team of 5'."
        })
    elif len(numbers) + len(percentage_matches) < 3:
        score -= 5
        suggestions.append({
            "type": "warning",
            "text": "Only a few metrics detected. Try adding more quantifiable achievements to stand out."
        })
    else:
        suggestions.append({
            "type": "good",
            "text": f"Good use of metrics! {len(numbers) + len(percentage_matches)} quantifiable data points found."
        })
    
    # ──── 4. LENGTH CHECK (deduct up to 10 points) ────
    if word_count < 80:
        score -= 10
        suggestions.append({
            "type": "critical",
            "text": f"Resume is too short ({word_count} words). A strong resume typically has 300-700 words covering all key sections."
        })
    elif word_count < 200:
        score -= 5
        suggestions.append({
            "type": "warning",
            "text": f"Resume is brief ({word_count} words). Consider expanding your experience and project descriptions."
        })
    elif word_count > 1000:
        score -= 5
        suggestions.append({
            "type": "warning",
            "text": f"Resume is quite long ({word_count} words). Consider trimming to 1-2 pages for maximum recruiter impact."
        })
    else:
        suggestions.append({
            "type": "good",
            "text": f"Good length ({word_count} words) — fits the ideal 1-2 page range."
        })
    
    # ──── 5. FORMATTING & STRUCTURE (deduct up to 8 points) ────
    has_bullets = any(line.strip().startswith(('•', '-', '*', '▸', '►')) for line in lines)
    if not has_bullets:
        score -= 5
        suggestions.append({
            "type": "warning",
            "text": "No bullet points detected. Use bullet points (•, -) to list achievements for better readability."
        })
    
    has_headers = any(line.strip().isupper() and len(line.strip()) > 3 for line in lines)
    if not has_headers:
        score -= 3
        suggestions.append({
            "type": "warning",
            "text": "No clear section headers detected. Use UPPERCASE headers like 'EDUCATION', 'EXPERIENCE', 'SKILLS'."
        })
    
    # ──── 6. TECH KEYWORDS (bonus check) ────
    tech_keywords = ['python', 'java', 'javascript', 'react', 'node', 'sql', 'git', 'docker',
                     'aws', 'azure', 'flask', 'django', 'html', 'css', 'mongodb', 'kubernetes',
                     'tensorflow', 'api', 'rest', 'agile', 'scrum', 'ci/cd', 'linux', 'typescript']
    found_tech = [t for t in tech_keywords if t in lower]
    
    if len(found_tech) >= 5:
        suggestions.append({
            "type": "good",
            "text": f"Strong technical vocabulary! {len(found_tech)} tech keywords detected: {', '.join(list(found_tech)[:8])}."
        })
    elif len(found_tech) == 0:
        score -= 5
        suggestions.append({
            "type": "warning",
            "text": "No technology keywords found. Include tools/languages you know (Python, React, AWS, etc.)."
        })
    
    # ──── 7. SPELLING CHECK (basic via TextBlob) ────
    try:
        blob = TextBlob(text)
        corrected = str(blob.correct())
        # Count differences as potential typos (rough estimate)
        orig_words = set(text.lower().split())
        corr_words = set(corrected.lower().split())
        diff_count = len(orig_words.symmetric_difference(corr_words))
        if diff_count > 10:
            score -= 3
            suggestions.append({
                "type": "warning",
                "text": f"Potential spelling/grammar issues detected (~{diff_count} differences). Proofread carefully before submitting."
            })
    except Exception:
        pass
    
    # ──── CLAMP & RATE ────
    score = max(0, min(100, score))
    
    if score >= 90:
        rating = "🏆 Perfect Resume — Ready to apply for top jobs!"
    elif score >= 80:
        rating = "✅ Good Resume — Strong foundation, minor tweaks needed."
    elif score >= 60:
        rating = "⚠️ Average Resume — Needs improvement in key areas."
    else:
        rating = "❌ Weak Resume — Significant gaps. Follow the suggestions below."
    
    return jsonify({
        "score": score,
        "rating": rating,
        "suggestions": suggestions,
        "word_count": word_count,
        "action_verbs_found": verb_count,
        "tech_keywords_found": len(found_tech)
    }), 200
