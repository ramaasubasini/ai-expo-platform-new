import os
import sys
from pymongo import MongoClient # type: ignore
from config import Config

class MockCollection:
    def __init__(self, name):
        self.name = name
        self.data = []

    def find_one(self, query, projection=None):
        for doc in self.data:
            match = True
            for k, v in query.items():
                if doc.get(k) != v:
                    match = False
                    break
            if match:
                return doc.copy()
        return None

    def find(self, query={}, projection=None):
        results = []
        for doc in self.data:
            match = True
            for k, v in query.items():
                if doc.get(k) != v:
                    match = False
                    break
            if match:
                results.append(doc.copy())
        return results

    def insert_one(self, doc):
        self.data.append(doc.copy())
        return doc
        
    def insert_many(self, docs):
        for doc in docs:
            self.data.append(doc.copy())
        
    def count_documents(self, query):
        return len(self.find(query))
        
    def update_one(self, filter, update_doc, upsert=False):
        doc = None
        for d in self.data:
            match = True
            for k, v in filter.items():
                if d.get(k) != v:
                    match = False
                    break
            if match:
                doc = d
                break
                
        class UpdateResult:
            def __init__(self, matched_count):
                self.matched_count = matched_count
                
        if doc and isinstance(doc, dict):
            if '$set' in update_doc:
                for k, v in update_doc['$set'].items():
                    keys = str(k).split('.')
                    last_key = keys.pop()
                    target = doc
                    for part in keys:
                        if isinstance(target, dict):
                            if not isinstance(target.get(part), dict):
                                target[part] = {}
                            target = target.get(part)
                    if isinstance(target, dict):
                        target[last_key] = v
            if '$inc' in update_doc:
                for k, v in update_doc['$inc'].items():
                    doc[k] = int(doc.get(k, 0)) + int(v)
            return UpdateResult(1)
        elif upsert:
            new_doc = filter.copy()
            if '$set' in update_doc:
                for k, v in update_doc['$set'].items():
                    keys = str(k).split('.')
                    last_key = keys.pop()
                    target = new_doc
                    for part in keys:
                        if isinstance(target, dict):
                            if not isinstance(target.get(part), dict):
                                target[part] = {}
                            target = target.get(part)
                    if isinstance(target, dict):
                        target[last_key] = v
            self.data.append(new_doc)
            return UpdateResult(0)
        return UpdateResult(0)
            
    def delete_one(self, filter):
        for d in self.data:
            match = True
            for k, v in filter.items():
                if d.get(k) != v:
                    match = False
                    break
            if match:
                self.data.remove(d)
                break

# Database initialization
db_type = "Mock"
db = None

if Config.MONGO_URI and ("localhost" not in Config.MONGO_URI or os.environ.get('FLASK_ENV') == 'production'):
    try:
        client = MongoClient(Config.MONGO_URI, serverSelectionTimeoutMS=5000)
        # Check connection
        client.server_info()
        db = client.get_default_database() or client['ai_expo_platform']
        db_type = "MongoDB"
        print(f"[INFO] Connected to MongoDB Atlas successfully!")
    except Exception as e:
        print(f"[WARNING] MongoDB connection failed: {e}. Falling back to In-Memory Mock.")

if db_type == "MongoDB" and db is not None:
    users_collection = db['users']
    otp_collection = db['otp']
    profiles_collection = db['profiles']
    courses_collection = db['courses']
    moods_collection = db['moods']
    notes_collection = db['notes']
    study_rooms_collection = db['study_rooms']
    interview_collection = db['interviews']
    leaderboard_collection = db['leaderboard']
else:
    users_collection = MockCollection('users')
    otp_collection = MockCollection('otp')
    profiles_collection = MockCollection('profiles')
    courses_collection = MockCollection('courses')
    moods_collection = MockCollection('moods')
    notes_collection = MockCollection('notes')
    study_rooms_collection = MockCollection('study_rooms')
    interview_collection = MockCollection('interviews')
    leaderboard_collection = MockCollection('leaderboard')
    print("[INFO] Using Ultra-Fast In-Memory Database! (Data will reset on restart)")

# Automatically seed the courses on backend restart using direct import
try:
    from seed_courses import COURSES  # type: ignore
    if courses_collection.count_documents({}) == 0:
        courses_collection.insert_many(COURSES)
        print(f"[INFO] Seeded {len(COURSES)} courses successfully!")
except Exception as e:
    print("Warning: Skipping in-memory seeding.", e)
