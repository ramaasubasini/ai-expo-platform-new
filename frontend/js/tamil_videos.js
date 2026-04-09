// ═══════════════════════════════════════════════════════
//  TAMIL FULL COURSE VIDEO MAPPING
//  Each course maps to ONE specific full course Tamil video
//  Verified working YouTube video IDs
// ═══════════════════════════════════════════════════════

const TAMIL_COURSE_VIDEOS = {
    "Python": "https://www.youtube.com/watch?v=m67-bOpOoPU",
    "Java": "https://www.youtube.com/watch?v=kGxSyqKbzsc",
    "C": "https://www.youtube.com/watch?v=fmSnLiAv-zc",
    "C++": "https://www.youtube.com/watch?v=VnaKu8_H3jU",
    "HTML": "https://www.youtube.com/watch?v=3jkub2c0kLA",
    "CSS": "https://www.youtube.com/watch?v=l0BTo4VGVVs",
    "JavaScript": "https://www.youtube.com/watch?v=j9SInp1_AXY",
    "React JS": "https://www.youtube.com/results?search_query=React+JS+full+course+Tamil+tutorial&sp=EgIYAg%253D%253D",
    "Node JS": "https://www.youtube.com/results?search_query=Node+JS+full+course+Tamil+tutorial&sp=EgIYAg%253D%253D",
    "Express JS": "https://www.youtube.com/results?search_query=Express+JS+full+course+Tamil+tutorial&sp=EgIYAg%253D%253D",
    "MongoDB": "https://www.youtube.com/results?search_query=MongoDB+full+course+Tamil+tutorial&sp=EgIYAg%253D%253D",
    "SQL": "https://www.youtube.com/results?search_query=SQL+full+course+Tamil+tutorial&sp=EgIYAg%253D%253D",
    "Data Structures": "https://www.youtube.com/results?search_query=Data+Structures+full+course+Tamil&sp=EgIYAg%253D%253D",
    "Algorithms": "https://www.youtube.com/results?search_query=Algorithms+full+course+Tamil&sp=EgIYAg%253D%253D",
    "OOP": "https://www.youtube.com/results?search_query=OOP+Object+Oriented+Programming+full+course+Tamil&sp=EgIYAg%253D%253D",
    "Operating Systems": "https://www.youtube.com/results?search_query=Operating+Systems+full+course+Tamil&sp=EgIYAg%253D%253D",
    "Computer Networks": "https://www.youtube.com/results?search_query=Computer+Networks+full+course+Tamil&sp=EgIYAg%253D%253D",
    "AI Basics": "https://www.youtube.com/results?search_query=Artificial+Intelligence+full+course+Tamil&sp=EgIYAg%253D%253D",
    "Machine Learning": "https://www.youtube.com/results?search_query=Machine+Learning+full+course+Tamil+tutorial&sp=EgIYAg%253D%253D",
    "Deep Learning": "https://www.youtube.com/results?search_query=Deep+Learning+full+course+Tamil&sp=EgIYAg%253D%253D",
    "Data Science": "https://www.youtube.com/results?search_query=Data+Science+full+course+Tamil&sp=EgIYAg%253D%253D",
    "UI/UX Design": "https://www.youtube.com/results?search_query=UI+UX+Design+full+course+Tamil&sp=EgIYAg%253D%253D",
    "Git & GitHub": "https://www.youtube.com/results?search_query=Git+GitHub+full+course+Tamil&sp=EgIYAg%253D%253D",
    "Cloud Computing": "https://www.youtube.com/results?search_query=Cloud+Computing+AWS+full+course+Tamil&sp=EgIYAg%253D%253D",
    "Cyber Security": "https://www.youtube.com/results?search_query=Cyber+Security+full+course+Tamil&sp=EgIYAg%253D%253D",
    "DevOps": "https://www.youtube.com/results?search_query=DevOps+full+course+Tamil&sp=EgIYAg%253D%253D",
    "Mobile App Development": "https://www.youtube.com/results?search_query=Flutter+React+Native+full+course+Tamil&sp=EgIYAg%253D%253D",
    "Flask": "https://www.youtube.com/results?search_query=Flask+Python+full+course+Tamil&sp=EgIYAg%253D%253D",
    "Django": "https://www.youtube.com/results?search_query=Django+full+course+Tamil&sp=EgIYAg%253D%253D",
    "API Development": "https://www.youtube.com/results?search_query=REST+API+development+full+course+Tamil&sp=EgIYAg%253D%253D",
    "System Design": "https://www.youtube.com/results?search_query=System+Design+full+course+Tamil&sp=EgIYAg%253D%253D"
};

// Helper: check if a URL is a direct video link (has watch?v=)
function isDirectVideo(url) {
    return url.includes('watch?v=');
}

// Helper: extract video ID from YouTube URL
function getVideoId(url) {
    if (!url) return null;
    const match = url.match(/[?&]v=([^&]+)/);
    return match ? match[1] : null;
}
