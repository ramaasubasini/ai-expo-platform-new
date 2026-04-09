
COURSES = [
    {"title": "Python", "description": "Master Python programming starting from fundamentals to advanced concepts.", "difficulty": "Beginner"},
    {"title": "Java", "description": "Learn object-oriented programming with Java, one of the most popular enterprise languages.", "difficulty": "Intermediate"},
    {"title": "C", "description": "Understand the roots of programming and memory management with C.", "difficulty": "Intermediate"},
    {"title": "C++", "description": "Dive deep into performance tuning, STL, and complex OOP with C++.", "difficulty": "Advanced"},
    {"title": "HTML", "description": "Build the structure of the web using modern HTML5 standards.", "difficulty": "Beginner"},
    {"title": "CSS", "description": "Design beautiful, responsive web pages.", "difficulty": "Beginner"},
    {"title": "JavaScript", "description": "Add interactivity to your web pages using Vanilla JS and ES6+.", "difficulty": "Intermediate"},
    {"title": "React JS", "description": "Build single-page applications with reusable components.", "difficulty": "Intermediate"},
    {"title": "Node JS", "description": "Create scalable backend services and RESTful APIs.", "difficulty": "Intermediate"},
    {"title": "Express JS", "description": "A fast, unopinionated, minimalist web framework for Node.js.", "difficulty": "Intermediate"},
    {"title": "MongoDB", "description": "Master NoSQL database concepts.", "difficulty": "Intermediate"},
    {"title": "SQL", "description": "Learn relational databases and complex queries.", "difficulty": "Beginner"},
    {"title": "Data Structures", "description": "Deep dive into arrays, linked lists, trees, and graphs.", "difficulty": "Intermediate"},
    {"title": "Algorithms", "description": "Learn sorting, searching, and dynamic programming.", "difficulty": "Advanced"},
    {"title": "OOP", "description": "Master Object-Oriented Programming principles.", "difficulty": "Intermediate"},
    {"title": "Operating Systems", "description": "Understand processes, memory management, and file systems.", "difficulty": "Advanced"},
    {"title": "Computer Networks", "description": "Learn OSI model, TCP/IP, routing, and switching.", "difficulty": "Intermediate"},
    {"title": "AI Basics", "description": "Introduction to Artificial Intelligence concepts.", "difficulty": "Beginner"},
    {"title": "Machine Learning", "description": "Learn regression, classification, and evaluating models.", "difficulty": "Intermediate"},
    {"title": "Deep Learning", "description": "Build neural networks using TensorFlow/Keras.", "difficulty": "Advanced"},
    {"title": "Data Science", "description": "Extract insights from data using Pandas & NumPy.", "difficulty": "Intermediate"},
    {"title": "UI/UX Design", "description": "Principles of user interface design and UX research.", "difficulty": "Beginner"},
    {"title": "Git & GitHub", "description": "Version control for tracking code changes.", "difficulty": "Beginner"},
    {"title": "Cloud Computing", "description": "Learn AWS, Azure, and GCP basics.", "difficulty": "Intermediate"},
    {"title": "Cyber Security", "description": "Understand network defense and ethical hacking.", "difficulty": "Advanced"},
    {"title": "DevOps", "description": "Master CI/CD pipelines and Docker.", "difficulty": "Advanced"},
    {"title": "Mobile App Development", "description": "Build native applications using React Native or Flutter.", "difficulty": "Intermediate"},
    {"title": "Flask", "description": "Create lightweight Python web microservices.", "difficulty": "Intermediate"},
    {"title": "Django", "description": "A high-level Python web framework.", "difficulty": "Advanced"},
    {"title": "API Development", "description": "Design secure RESTful APIs.", "difficulty": "Intermediate"},
    {"title": "System Design", "description": "Architect large-scale resilient applications.", "difficulty": "Advanced"}
]

from database import courses_collection

def seed():
    if courses_collection.count_documents({}) == 0:
        courses_collection.insert_many(COURSES)
        print("Courses seeded successfully!")
    else:
        print("Courses already exist. Skipping seed.")

if __name__ == '__main__':
    seed()
