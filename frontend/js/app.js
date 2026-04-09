let currentEmail = '';
let currentVideoCourse = '';
let currentUserName = '';

function toggleAuth(type) {
    document.getElementById('login-form').style.display = type === 'login' ? 'block' : 'none';
    document.getElementById('register-form').style.display = type === 'register' ? 'block' : 'none';
    document.getElementById('otp-form').style.display = type === 'otp' ? 'block' : 'none';
    showMessage('');
}

function showMessage(msg, color='#f87171') {
    const el = document.getElementById('auth-message');
    if(el) {
        el.innerHTML = msg;
        el.style.color = color;
    }
}

let registeredPassword = '';

async function register() {
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const phone = document.getElementById('reg-phone').value;

    if (!name || !email || !password || !phone) {
        showMessage('Please fill in all fields.');
        return;
    }

    const res = await apiCall('/auth/register', 'POST', { name, email, password, phone });
    if (res.ok) {
        currentEmail = email;
        registeredPassword = password;
        const generatedOtp = res.data.dummy_otp;
        showMessage(`✅ Registration successful! OTP sent to <b>${email}</b><br>📧 <b>Your OTP: ${generatedOtp}</b> (auto-filled below)`, '#4ade80');
        document.getElementById('otp-email-display').textContent = email;
        document.getElementById('otp-code').value = generatedOtp;
        toggleAuth('otp');
        
        // Auto-verify after 2 seconds for seamless flow
        setTimeout(async () => {
            await verifyOtp();
        }, 2000);
    } else {
        showMessage(res.data.error || 'Server error.');
    }
}

async function verifyOtp() {
    const otp = document.getElementById('otp-code').value;
    if (!otp) {
        showMessage('Please enter the OTP code.');
        return;
    }
    
    showMessage('🔄 Verifying OTP...', '#fcd34d');
    const res = await apiCall('/auth/verify-otp', 'POST', { email: currentEmail, otp });
    
    if (res.ok) {
        showMessage('✅ Email verified successfully! Logging you in...', '#4ade80');
        
        // Auto-login after verification
        if (registeredPassword) {
            document.getElementById('login-email').value = currentEmail;
            document.getElementById('login-password').value = registeredPassword;
            registeredPassword = '';
            setTimeout(() => login(), 1500);
        } else {
            toggleAuth('login');
            document.getElementById('login-email').value = currentEmail;
        }
    } else {
        showMessage(res.data.error || 'Invalid OTP. Please try again.');
    }
}

async function resendOtp() {
    showMessage('🔄 Sending new OTP...', '#fcd34d');
    const res = await apiCall('/auth/resend-otp', 'POST', { email: currentEmail });
    if (res.ok) {
        document.getElementById('otp-code').value = res.data.dummy_otp || '';
        showMessage(`✅ New OTP sent to <b>${currentEmail}</b>: <b>${res.data.dummy_otp}</b>`, '#4ade80');
    } else {
        showMessage(res.data.error || 'Failed to resend OTP.');
    }
}

async function login() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    if (!email || !password) {
        showMessage('Please enter email and password.');
        return;
    }

    const res = await apiCall('/auth/login', 'POST', { email, password });
    if (res.ok) {
        localStorage.setItem('token', res.data.access_token);
        localStorage.setItem('userEmail', res.data.email);
        if(res.data.name) {
            currentUserName = res.data.name;
            localStorage.setItem('userName', res.data.name);
        }
        currentEmail = res.data.email;
        document.getElementById('sidebar').style.display = 'block';
        navigate('dashboard');
    } else {
        if (res.data && res.data.requires_verification) {
            currentEmail = email;
            showMessage('⚠️ Email not verified yet. Enter your OTP below.');
            toggleAuth('otp');
        } else {
            showMessage(res.data ? res.data.error : 'Invalid email or password.');
        }
    }
}

function logout() {
    localStorage.removeItem('token');
    document.getElementById('sidebar').style.display = 'none';
    navigate('auth');
}

function navigate(viewId) {
    const views = ['auth', 'dashboard', 'profile', 'courses', 'roadmap', 'resume', 'mood', 'tutor', 'leaderboard', 'notes', 'studyroom', 'analytics', 'interview'];
    views.forEach(v => {
        const el = document.getElementById(`${v}-view`);
        if(el) el.style.display = (v === viewId) ? 'block' : 'none'; 
        
        if(v === viewId && v === 'tutor') {
            if(el) el.style.display = 'flex';
        }
    });
    
    if (viewId === 'dashboard') loadDashboard();
    if (viewId === 'courses') loadCourses();
    if (viewId === 'roadmap') loadRoadmap();
    if (viewId === 'profile') loadProfile();
    if (viewId === 'leaderboard') loadLeaderboard();
    if (viewId === 'notes') loadSavedNotes();
    if (viewId === 'studyroom') loadStudyRooms();
    if (viewId === 'analytics') loadAnalytics();
}

// RESUME SCORE ANALYZER
async function analyzeResume() {
    const text = document.getElementById('resume-text').value;
    if (!text || text.trim().length < 30) {
        alert('Please paste at least 30 characters of your resume text.');
        return;
    }
    
    // Show loading state
    document.getElementById('score-number').textContent = '...';
    document.getElementById('score-label').textContent = 'Analyzing...';
    document.getElementById('score-label').style.color = '#fcd34d';
    document.getElementById('resume-suggestions').innerHTML = '';
    
    const res = await apiCall('/ai/resume/analyze', 'POST', { text });
    
    if (res.ok) {
        const { score, rating, suggestions } = res.data;
        
        // Animate score number counting up
        const scoreEl = document.getElementById('score-number');
        const ringEl = document.getElementById('score-ring');
        let current = 0;
        const increment = Math.ceil(score / 40);
        
        // Determine color based on score
        let color;
        if (score >= 90) color = '#34d399';
        else if (score >= 80) color = '#4ade80';
        else if (score >= 60) color = '#fcd34d';
        else color = '#ef4444';
        
        scoreEl.style.color = color;
        ringEl.style.stroke = color;
        
        // Animate ring (circumference = 2 * π * 85 ≈ 534)
        const offset = 534 - (534 * score / 100);
        ringEl.style.strokeDashoffset = offset;
        
        // Count-up animation
        const counter = setInterval(() => {
            current += increment;
            if (current >= score) {
                current = score;
                clearInterval(counter);
            }
            scoreEl.textContent = current;
        }, 30);
        
        // Rating label
        const labelEl = document.getElementById('score-label');
        labelEl.textContent = rating;
        labelEl.style.color = color;
        
        // Render suggestions
        const sugBox = document.getElementById('resume-suggestions');
        sugBox.innerHTML = '';
        
        suggestions.forEach(s => {
            const div = document.createElement('div');
            let icon, bgColor, borderColor;
            if (s.type === 'critical') {
                icon = '❌'; bgColor = 'rgba(239,68,68,0.1)'; borderColor = '#ef4444';
            } else if (s.type === 'warning') {
                icon = '⚠️'; bgColor = 'rgba(252,211,77,0.1)'; borderColor = '#fcd34d';
            } else {
                icon = '✅'; bgColor = 'rgba(52,211,153,0.1)'; borderColor = '#34d399';
            }
            div.style.cssText = `background:${bgColor}; border-left:4px solid ${borderColor}; padding:10px 14px; border-radius:6px; margin-bottom:8px; font-size:0.85rem; color:#e2e8f0; line-height:1.5;`;
            div.innerHTML = `${icon} ${s.text}`;
            sugBox.appendChild(div);
        });
        
        // Stats summary
        const statsDiv = document.createElement('div');
        statsDiv.style.cssText = 'margin-top:15px; padding:12px; background:rgba(0,0,0,0.3); border-radius:8px; font-size:0.8rem; color:#94a3b8; display:flex; justify-content:space-around;';
        statsDiv.innerHTML = `
            <span>📝 ${res.data.word_count} words</span>
            <span>💪 ${res.data.action_verbs_found} verbs</span>
            <span>💻 ${res.data.tech_keywords_found} tech terms</span>
        `;
        sugBox.appendChild(statsDiv);
        
    } else {
        document.getElementById('score-label').textContent = res.data.error || 'Analysis failed.';
        document.getElementById('score-label').style.color = '#ef4444';
    }
}

// DASHBOARD & BADGES
async function loadDashboard() {
    const res = await apiCall('/dashboard/');
    if (res.ok) {
        document.getElementById('dash-xp').textContent = res.data.xp;
        document.getElementById('dash-completed').textContent = res.data.total_courses_completed;
        document.getElementById('dash-streak').textContent = res.data.current_streak;
        document.getElementById('dash-mood').textContent = res.data.recent_mood || 'Neutral';
        
        const badgeContainer = document.getElementById('dash-badges');
        badgeContainer.innerHTML = '';
        
        // Manual local calculation to ensure badges display PERFECTLY based on API data
        let comp = parseInt(res.data.total_courses_completed);
        let xp = parseInt(res.data.xp);
        let streak = parseInt(res.data.current_streak) || 0;
        
        // ALL available badges with unlock conditions
        const ALL_BADGES = [
            { id: 'starter', emoji: '🔰', name: 'Quick Starter', desc: 'Complete your first course', unlocked: comp > 0 },
            { id: 'triple', emoji: '🥉', name: 'Triple Threat', desc: 'Complete 3 courses', unlocked: comp >= 3 },
            { id: 'five', emoji: '⭐', name: 'High Five', desc: 'Complete 5 courses', unlocked: comp >= 5 },
            { id: 'ten', emoji: '🏅', name: 'Tenacious Ten', desc: 'Complete 10 courses', unlocked: comp >= 10 },
            { id: 'twenty', emoji: '💎', name: 'Diamond Scholar', desc: 'Complete 20 courses', unlocked: comp >= 20 },
            { id: 'master', emoji: '🥇', name: 'Supreme Master', desc: 'Complete all 31 courses', unlocked: comp === 31 },
            { id: 'xp500', emoji: '🔥', name: 'XP Earner', desc: 'Earn 500 XP', unlocked: xp >= 500 },
            { id: 'xp2k', emoji: '💥', name: 'XP Champion', desc: 'Earn 2000 XP', unlocked: xp >= 2000 },
            { id: 'xp5k', emoji: '🏆', name: 'XP Grandmaster', desc: 'Earn 5000 XP', unlocked: xp >= 5000 },
            { id: 'streak3', emoji: '🔥', name: '3-Day Streak', desc: 'Maintain a 3 day streak', unlocked: streak >= 3 },
            { id: 'streak7', emoji: '⚡', name: 'Week Warrior', desc: '7 day learning streak', unlocked: streak >= 7 },
            { id: 'streak30', emoji: '🌟', name: 'Monthly Master', desc: '30 day learning streak', unlocked: streak >= 30 },
            { id: 'mood', emoji: '😊', name: 'Mood Aware', desc: 'Use AI Mood Detector', unlocked: (res.data.recent_mood || 'Neutral') !== 'Neutral' },
            { id: 'explorer', emoji: '🧭', name: 'AI Explorer', desc: 'Earn 1000 XP', unlocked: xp >= 1000 },
            { id: 'coder', emoji: '💻', name: 'Code Ninja', desc: 'Complete 15 courses', unlocked: comp >= 15 },
        ];
        
        ALL_BADGES.forEach(badge => {
            const span = document.createElement('span');
            span.style.cssText = badge.unlocked 
                ? 'padding:10px 18px; background:linear-gradient(45deg,#fcd34d,#fb923c); color:#000; font-weight:bold; border-radius:25px; box-shadow:0 4px 10px rgba(251,191,36,0.3); cursor:pointer; transition:all 0.3s; font-size:0.9rem;'
                : 'padding:10px 18px; background:rgba(255,255,255,0.03); color:#64748b; border:1px dashed rgba(255,255,255,0.1); border-radius:25px; cursor:pointer; transition:all 0.3s; font-size:0.9rem; filter:grayscale(100%);';
            span.textContent = `${badge.emoji} ${badge.name}`;
            span.title = badge.unlocked ? `✅ Unlocked: ${badge.desc}` : `🔒 Locked: ${badge.desc}`;
            span.onclick = () => showBadgeDetail(badge);
            badgeContainer.appendChild(span);
        });
    }
}

function showBadgeDetail(badge) {
    const detail = document.getElementById('badge-detail');
    detail.style.display = 'block';
    const status = badge.unlocked ? '✅ UNLOCKED' : '🔒 LOCKED';
    const statusColor = badge.unlocked ? '#34d399' : '#ef4444';
    detail.innerHTML = `
        <div style="display:flex; align-items:center; gap:15px;">
            <span style="font-size:3rem;">${badge.emoji}</span>
            <div>
                <h3 style="color:#fbbf24; margin:0;">${badge.name}</h3>
                <p style="color:${statusColor}; font-weight:700; margin:5px 0;">${status}</p>
                <p style="color:#cbd5e1; margin:0; font-size:0.9rem;">📋 Requirement: ${badge.desc}</p>
            </div>
        </div>
    `;
}

// COURSES (Tamil & Certifications) — with Difficulty Filters & Search
let allCoursesCache = [];
let currentCourseFilter = 'all';

async function loadCourses() {
    const container = document.getElementById('courses-list');
    container.innerHTML = '<div class="glass-card" style="grid-column:1/-1; text-align:center; padding:40px;"><p style="color:#fcd34d; font-size:1.1rem;">⏳ Loading courses...</p></div>';
    
    const res = await apiCall('/courses/');
    if (res.ok) {
        allCoursesCache = res.data.courses || [];
        filterCourses('all');
    } else {
        container.innerHTML = `<div class="glass-card" style="grid-column:1/-1; text-align:center; padding:50px;">
            <p style="font-size:1.3rem; color:#ef4444;">❌ Failed to load courses</p>
            <p style="color:#94a3b8; margin-top:10px;">${res.data?.error || 'Please check your connection and try again.'}</p>
            <button onclick="loadCourses()" style="width:auto; padding:10px 30px; margin-top:15px; background:linear-gradient(135deg,#6366f1,#4f46e5); border-radius:25px;">🔄 Retry</button>
        </div>`;
    }
}

function filterCourses(difficulty) {
    currentCourseFilter = difficulty;
    const searchQuery = (document.getElementById('course-search')?.value || '').toLowerCase().trim();
    
    // Update filter button styles
    const filterBtns = document.querySelectorAll('.course-filter-btn');
    filterBtns.forEach(btn => {
        btn.classList.remove('active-filter');
        // Reset to default styles
        btn.style.boxShadow = 'none';
        btn.style.transform = 'none';
    });
    
    const activeId = difficulty === 'all' ? 'filter-all' : 
                     difficulty === 'Beginner' ? 'filter-beginner' : 
                     difficulty === 'Intermediate' ? 'filter-intermediate' : 'filter-advanced';
    const activeBtn = document.getElementById(activeId);
    if (activeBtn) {
        activeBtn.classList.add('active-filter');
        if (difficulty === 'all') {
            activeBtn.style.background = 'linear-gradient(135deg,#6366f1,#4f46e5)';
            activeBtn.style.color = '#fff';
            activeBtn.style.boxShadow = '0 4px 15px rgba(99,102,241,0.4)';
        } else if (difficulty === 'Beginner') {
            activeBtn.style.background = 'linear-gradient(135deg,#34d399,#10b981)';
            activeBtn.style.color = '#fff';
            activeBtn.style.boxShadow = '0 4px 15px rgba(52,211,153,0.4)';
        } else if (difficulty === 'Intermediate') {
            activeBtn.style.background = 'linear-gradient(135deg,#fbbf24,#f59e0b)';
            activeBtn.style.color = '#000';
            activeBtn.style.boxShadow = '0 4px 15px rgba(251,191,36,0.4)';
        } else if (difficulty === 'Advanced') {
            activeBtn.style.background = 'linear-gradient(135deg,#ef4444,#dc2626)';
            activeBtn.style.color = '#fff';
            activeBtn.style.boxShadow = '0 4px 15px rgba(239,68,68,0.4)';
        }
        activeBtn.style.transform = 'translateY(-2px)';
    }
    
    // Reset non-active buttons to their default styles
    filterBtns.forEach(btn => {
        if (!btn.classList.contains('active-filter')) {
            if (btn.id === 'filter-all') {
                btn.style.background = 'rgba(99,102,241,0.1)';
                btn.style.color = '#818cf8';
            } else if (btn.id === 'filter-beginner') {
                btn.style.background = 'rgba(52,211,153,0.1)';
                btn.style.color = '#34d399';
            } else if (btn.id === 'filter-intermediate') {
                btn.style.background = 'rgba(251,191,36,0.1)';
                btn.style.color = '#fbbf24';
            } else if (btn.id === 'filter-advanced') {
                btn.style.background = 'rgba(239,68,68,0.1)';
                btn.style.color = '#ef4444';
            }
        }
    });

    // Filter courses
    let filtered = allCoursesCache;
    if (difficulty !== 'all') {
        filtered = filtered.filter(c => c.difficulty === difficulty);
    }
    if (searchQuery) {
        filtered = filtered.filter(c => 
            c.title.toLowerCase().includes(searchQuery) || 
            c.description.toLowerCase().includes(searchQuery)
        );
    }

    // Update count
    const countEl = document.getElementById('course-count');
    if (countEl) {
        const total = allCoursesCache.length;
        if (difficulty === 'all' && !searchQuery) {
            countEl.textContent = `Showing all ${total} courses`;
        } else {
            countEl.textContent = `Showing ${filtered.length} of ${total} courses${searchQuery ? ` matching "${searchQuery}"` : ''}`;
        }
    }

    renderCourseCards(filtered);
}

function renderCourseCards(courses) {
    const container = document.getElementById('courses-list');
    container.innerHTML = '';

    if (courses.length === 0) {
        container.innerHTML = `<div class="glass-card" style="grid-column:1/-1; text-align:center; padding:50px;">
            <p style="font-size:1.3rem; color:#64748b;">😕 No courses found matching your filter.</p>
            <button onclick="filterCourses('all')" style="width:auto; padding:10px 30px; margin-top:15px; background:linear-gradient(135deg,#6366f1,#4f46e5); border-radius:25px;">Show All Courses</button>
        </div>`;
        return;
    }

    courses.forEach((c, index) => {
        const card = document.createElement('div');
        card.className = 'glass-card hover-glow';
        card.style.cssText = `animation: fadeInUp 0.4s ease forwards; animation-delay: ${index * 0.04}s; opacity: 0; transition: all 0.3s ease;`;

        // Difficulty badge colors
        let diffColor, diffBg, diffIcon;
        if (c.difficulty === 'Beginner') {
            diffColor = '#34d399'; diffBg = 'rgba(52,211,153,0.15)'; diffIcon = '🟢';
        } else if (c.difficulty === 'Intermediate') {
            diffColor = '#fbbf24'; diffBg = 'rgba(251,191,36,0.15)'; diffIcon = '🟡';
        } else {
            diffColor = '#ef4444'; diffBg = 'rgba(239,68,68,0.15)'; diffIcon = '🔴';
        }

        // Status styling
        let statusColor = '#94a3b8';
        let statusIcon = '⏳';
        if (c.status === 'Completed') { statusColor = '#34d399'; statusIcon = '✅'; }
        else if (c.status === 'Ongoing') { statusColor = '#fbbf24'; statusIcon = '🔄'; }

        // Progress bar color
        let progressColor = c.status === 'Completed' ? '#34d399' : (c.status === 'Ongoing' ? '#fbbf24' : '#818cf8');

        let btnText = c.status === 'Completed' ? '✔ Done (Re-Watch)' : '▶ Watch in Tamil';
        let btnStyle = c.status === 'Completed' ? 'background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15);' : 'background: linear-gradient(135deg, #e11d48, #be123c);';
        let certBtn = c.status === 'Completed' ? `<button onclick="downloadCertificate('${c.title}')" style="margin-top: 8px; background: linear-gradient(45deg, #fbbf24, #d97706); color: black; font-weight:700;">🎓 Download Certificate</button>` : '';

        card.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
                <h3 style="margin:0; font-size:1.15rem; color:#f8fafc;">${c.title}</h3>
                <span style="font-size:0.75rem; background:${diffBg}; color:${diffColor}; padding:4px 12px; border-radius:20px; font-weight:600; white-space:nowrap; border:1px solid ${diffColor}30;">${diffIcon} ${c.difficulty}</span>
            </div>
            <p style="font-size:0.9rem; color:#cbd5e1; margin:0 0 15px 0; line-height:1.5;">${c.description}</p>
            <div style="background: rgba(255,255,255,0.08); border-radius:6px; height:8px; overflow:hidden;">
                <div style="background:${progressColor}; height:100%; border-radius:6px; width:${c.progress}%; transition:width 0.8s ease; box-shadow:0 0 8px ${progressColor}60;"></div>
            </div>
            <div style="margin:10px 0; font-size:0.85rem; display:flex; justify-content:space-between; align-items:center;">
                <span style="color:#94a3b8;">Progress: <strong style="color:#f8fafc;">${c.progress}%</strong></span>
                <span style="color:${statusColor}; font-weight:600;">${statusIcon} ${c.status}</span>
            </div>
            <button onclick="openVideo('${c.title}')" style="padding:10px; ${btnStyle}">${btnText}</button>
            ${certBtn}
        `;
        container.appendChild(card);
    });
}

async function loadRoadmap() {
    const res = await apiCall('/courses/');
    if (res.ok) {
        const container = document.getElementById('roadmap-timeline');
        container.innerHTML = '';
        res.data.courses.forEach((c, index) => {
            const item = document.createElement('div');
            item.className = 'timeline-item';
            // Mathematical stagger effect for dropping the nodes
            item.style.animationDelay = `${index * 0.12}s`;
            
            let dotClass = '';
            if (c.status === 'Completed') dotClass = 'Completed';
            else if (c.status === 'Ongoing') dotClass = 'Ongoing';
            
            item.innerHTML = `
                <div class="timeline-dot ${dotClass}"></div>
                <div class="timeline-content">
                    <h3 style="margin-top:0; color: #f8fafc;">${index + 1}. ${c.title}</h3>
                    <span style="font-size: 0.8rem; background: rgba(0,0,0,0.5); padding: 3px 8px; border-radius: 5px; color: #cbd5e1;">${c.difficulty}</span>
                    <div style="margin-top: 15px; background: rgba(255,255,255,0.1); border-radius: 5px; height: 6px;">
                        <div style="background: ${c.status === 'Completed' ? '#34d399' : (c.status === 'Ongoing' ? '#fcd34d' : '#818cf8')}; height: 100%; border-radius: 5px; width: ${c.progress}%;"></div>
                    </div>
                    <p style="margin-top: 8px; margin-bottom: 0; font-size: 0.85rem; color: ${c.status === 'Completed' ? '#34d399' : (c.status === 'Ongoing' ? '#fcd34d' : '#94a3b8')}; font-weight: bold;">
                        ${c.status} (${c.progress}%)
                    </p>
                </div>
            `;
            container.appendChild(item);
        });
    }
}

function openVideo(title) {
    currentVideoCourse = title;
    const videoUrl = TAMIL_COURSE_VIDEOS[title];
    
    if (videoUrl && isDirectVideo(videoUrl)) {
        // Direct video — embed it in the modal
        const videoId = getVideoId(videoUrl);
        document.getElementById('video-modal').style.display = 'flex';
        document.getElementById('video-title').textContent = title + " — Full Course (Tamil)";
        document.getElementById('video-container').innerHTML = `
            <iframe width="100%" height="400" src="https://www.youtube.com/embed/${videoId}?autoplay=1" 
                frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen style="border-radius: 12px;"></iframe>
            <p style="margin-top: 15px; color: #94a3b8; font-size: 0.9rem;">🎓 Full ${title} Course in Tamil</p>
        `;
    } else if (videoUrl) {
        // Filtered search link — open directly in new tab
        window.open(videoUrl, '_blank');
    } else {
        // Fallback
        window.open('https://www.youtube.com/results?search_query=' + encodeURIComponent(title + ' full course Tamil') + '&sp=EgIYAg%253D%253D', '_blank');
    }
}

function closeVideo() {
    document.getElementById('video-modal').style.display = 'none';
}

async function completeCurrentVideo() {
    await apiCall('/courses/progress', 'POST', { course_title: currentVideoCourse, progress: 100 });
    closeVideo();
    loadCourses(); 
    loadDashboard();
}

function downloadCertificate(courseTitle) {
    document.getElementById('certificate-modal').style.display = 'flex';
    document.getElementById('cert-course').textContent = courseTitle;
    
    // Load Name from DOM profile or login memory
    const displayedName = document.getElementById('prof-name').value || currentUserName || currentEmail.split('@')[0];
    document.getElementById('cert-name').textContent = displayedName.toUpperCase();
    
    const d = new Date();
    document.getElementById('cert-date').textContent = `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`;
}

// PROFILE (Comprehensive Details)
async function loadProfile() {
    const res = await apiCall('/profile/');
    if (res.ok) {
        document.getElementById('prof-name').value = res.data.profile.name || '';
        document.getElementById('prof-email').value = res.data.profile.email;
        document.getElementById('prof-regno').value = res.data.profile.reg_no || '';
        document.getElementById('prof-profession').value = res.data.profile.profession || '';
        document.getElementById('prof-bio').value = res.data.profile.bio || '';
        if (res.data.profile.name) currentUserName = res.data.profile.name;
    }
}

async function saveProfile() {
    const payload = {
        name: document.getElementById('prof-name').value,
        reg_no: document.getElementById('prof-regno').value,
        profession: document.getElementById('prof-profession').value,
        bio: document.getElementById('prof-bio').value
    };
    
    const msgEl = document.getElementById('profile-msg');
    msgEl.textContent = "Saving...";
    msgEl.style.color = "#f8fafc";
    
    const res = await apiCall('/profile/', 'PUT', payload);
    if(res.ok) {
        msgEl.textContent = "Profile details saved successfully! ✔";
        msgEl.style.color = "#34d399";
        currentUserName = payload.name;
    }
}

// ═══════════════════════════════════════════════════════
//  AI MOOD DETECTOR WITH MOTIVATIONAL ENGINE
// ═══════════════════════════════════════════════════════

const MOTIVATION_QUOTES = {
    happy: [
        "🌟 You're glowing! This positive energy will help you absorb concepts faster. Keep going!",
        "😊 Your happy mood is the perfect state for learning. Tackle that challenging topic now!",
        "🎉 Fantastic mood detected! Students who study happy retain 40% more. You're crushing it!",
        "💪 Your enthusiasm is contagious! Channel this energy into completing your next course module."
    ],
    neutral: [
        "📚 Steady and focused — the ideal learner's state. You're in the zone, keep studying!",
        "🎯 Calm and collected. This is when deep understanding happens. Push through one more topic!",
        "💡 Your balanced mindset is perfect for problem-solving. Try a coding challenge now!",
        "⚡ Consistent effort beats talent. You're doing great — keep that steady pace!"
    ],
    sad: [
        "💙 It's okay to feel down. Remember: every expert was once a beginner. Take a short break, then come back stronger!",
        "🌈 Tough times don't last, but tough learners do. Watch a fun tutorial video to lift your spirits!",
        "🤗 You're not alone in your learning journey. Try the AI Tutor for some friendly guidance!",
        "☕ Take a 5-minute break, grab a drink, and remember why you started. You've got this!"
    ],
    angry: [
        "🧘 Frustration is part of learning! Take 3 deep breaths. That bug you're stuck on? You'll solve it.",
        "💪 Channel that energy! Angry coders often write their best solutions after a short walk.",
        "🎮 Step away for 10 minutes. Play a quick game, then come back with fresh eyes.",
        "🔥 Debugging frustration = growth happening. Every error teaches you something new!"
    ],
    fearful: [
        "🛡️ Don't be afraid of complex topics! Break them into small steps. You CAN do this!",
        "🌟 Imposter syndrome is real, but remember: you belong here. Every expert started where you are.",
        "📝 Start with what you know, then expand gradually. Small wins build confidence!",
        "💡 Fear means you're pushing your boundaries. That's exactly where growth happens!"
    ],
    surprised: [
        "🎊 Surprised? Learning is full of exciting discoveries! Write down what amazed you!",
        "🤩 That 'aha!' moment is precious. You just leveled up your understanding!",
        "📖 Surprise means you're learning something truly new. Embrace the curiosity!",
        "⭐ Your brain just made a new connection! Review this topic to cement it."
    ],
    disgusted: [
        "😤 Some code is ugly, but it works! Focus on understanding the logic first, clean up later.",
        "🎨 Not every concept is elegant at first. Beauty comes with mastery. Keep practicing!",
        "🔧 Messy code today → clean architecture tomorrow. You're learning the building blocks!",
        "💎 Even diamonds look like rocks before polishing. Your skills are being refined!"
    ]
};

let moodCheckInterval = null;
let lastDetectedMood = 'neutral';

function getMotivation(mood) {
    const moodKey = mood.toLowerCase();
    const quotes = MOTIVATION_QUOTES[moodKey] || MOTIVATION_QUOTES['neutral'];
    return quotes[Math.floor(Math.random() * quotes.length)];
}

function showMoodNotification(mood, quote) {
    // Remove existing notification
    const existing = document.getElementById('mood-notification');
    if (existing) existing.remove();
    
    const moodColors = {
        happy: '#34d399', neutral: '#60a5fa', sad: '#818cf8',
        angry: '#ef4444', fearful: '#f97316', surprised: '#fef08a', disgusted: '#84cc16'
    };
    const color = moodColors[mood.toLowerCase()] || '#60a5fa';
    
    const notif = document.createElement('div');
    notif.id = 'mood-notification';
    notif.style.cssText = `position:fixed;bottom:20px;right:20px;max-width:380px;background:rgba(15,23,42,0.95);border:2px solid ${color};border-radius:16px;padding:20px;z-index:9999;backdrop-filter:blur(20px);box-shadow:0 8px 32px rgba(0,0,0,0.5);animation:slideInRight 0.5s ease;`;
    notif.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
            <span style="font-size:1.2rem;font-weight:700;color:${color};">🧠 AI Mood: ${mood.toUpperCase()}</span>
            <button onclick="this.parentElement.parentElement.remove()" style="background:none;border:none;color:#94a3b8;font-size:1.2rem;cursor:pointer;">✕</button>
        </div>
        <p style="color:#e2e8f0;font-size:0.9rem;line-height:1.5;margin:0;">${quote}</p>
    `;
    document.body.appendChild(notif);
    
    // Auto-remove after 12 seconds
    setTimeout(() => { if (notif.parentNode) notif.remove(); }, 12000);
}

function startAutoMoodDetection() {
    if (moodCheckInterval) return; // Already running
    
    // Show first motivation on dashboard load
    setTimeout(() => {
        const quote = getMotivation('neutral');
        showMoodNotification('Neutral', quote);
        updateDashboardMood('Neutral', quote);
    }, 3000);
    
    // Check mood every 45 seconds
    moodCheckInterval = setInterval(() => {
        if (!localStorage.getItem('token')) {
            clearInterval(moodCheckInterval);
            moodCheckInterval = null;
            return;
        }
        detectAndMotivate();
    }, 45000);
}

async function detectAndMotivate() {
    // Use time-based + activity-based mood inference
    const hour = new Date().getHours();
    const token = localStorage.getItem('token');
    if (!token) return;
    
    // Infer mood from time of day and study patterns
    let inferredMood;
    if (hour >= 5 && hour < 9) inferredMood = 'neutral';     // Early morning
    else if (hour >= 9 && hour < 12) inferredMood = 'happy';  // Peak study hours
    else if (hour >= 12 && hour < 14) inferredMood = 'neutral'; // Post-lunch
    else if (hour >= 14 && hour < 17) inferredMood = 'happy';  // Afternoon study
    else if (hour >= 17 && hour < 20) inferredMood = 'neutral'; // Evening
    else if (hour >= 20 && hour < 23) inferredMood = 'surprised'; // Late study = dedication!
    else inferredMood = 'fearful'; // Very late = might be stressed
    
    // If camera mood is available, use that instead
    const faceMoodEl = document.getElementById('face-mood-result');
    if (faceMoodEl && faceMoodEl.textContent && !['AWAITING...', 'SCANNING...', 'NO FACE DETECTED', 'FAILED'].includes(faceMoodEl.textContent)) {
        inferredMood = faceMoodEl.textContent.toLowerCase();
    }
    
    lastDetectedMood = inferredMood;
    const quote = getMotivation(inferredMood);
    showMoodNotification(inferredMood, quote);
    updateDashboardMood(inferredMood, quote);
    
    // Log mood to backend
    await apiCall('/ai/mood/text', 'POST', { text: `Auto-detected mood: ${inferredMood}` });
}

function updateDashboardMood(mood, quote) {
    const el = document.getElementById('dash-mood');
    if (el) el.textContent = mood.charAt(0).toUpperCase() + mood.slice(1);
    
    const motivEl = document.getElementById('dash-motivation');
    if (motivEl) motivEl.textContent = quote;
}

// TEXT MOOD
async function analyzeMood() {
    const text = document.getElementById('mood-text').value;
    if (!text.trim()) return;
    
    document.getElementById('mood-result').textContent = "🔄 Analyzing your mood...";
    document.getElementById('mood-result').style.color = '#fcd34d';
    
    const res = await apiCall('/ai/mood/text', 'POST', { text });
    if (res.ok) {
        const mood = res.data.mood;
        const quote = getMotivation(mood);
        lastDetectedMood = mood.toLowerCase();
        
        document.getElementById('mood-result').innerHTML = `
            <div style="background:rgba(0,0,0,0.3);border-radius:12px;padding:20px;margin-top:10px;">
                <div style="font-size:2rem;font-weight:800;color:#60a5fa;margin-bottom:10px;">🧠 Mood: ${mood}</div>
                <div style="font-size:1rem;color:#e2e8f0;line-height:1.6;">${quote}</div>
            </div>
        `;
        document.getElementById('mood-result').style.color = '#e2e8f0';
        showMoodNotification(mood, quote);
    }
}

// CAMERA FACE MOOD DETECTION (ALL 7 MOODS)
let videoStream = null;

async function startCamera() {
    const btn = document.getElementById('btn-camera');
    const statusText = document.getElementById('cam-status');
    const moodResult = document.getElementById('face-mood-result');
    
    btn.disabled = true;
    statusText.textContent = "Status: Downloading complex AI weights globally from CDN (approx 2MB)...";

    const MODEL_URL = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights';
    
    try {
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
        
        statusText.textContent = "Status: Models Loaded. Requesting webcam permission...";
        
        const video = document.getElementById('video-stream');
        videoStream = await navigator.mediaDevices.getUserMedia({ video: {} });
        video.srcObject = videoStream;
        
        btn.textContent = "🔴 Camera Active";
        statusText.textContent = "Status: Streaming to Face-API Tensor...";
        moodResult.textContent = "SCANNING...";
        moodResult.style.color = "#fcd34d";
        
        video.addEventListener('play', () => {
            const canvas = document.getElementById('video-canvas');
            const displaySize = { width: video.width, height: video.height };
            faceapi.matchDimensions(canvas, displaySize);
            
            setInterval(async () => {
                const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceExpressions();
                const ctx = canvas.getContext('2d');
                ctx.clearRect(0,0, canvas.width, canvas.height);
                
                if(detections.length > 0) {
                    const resizedResult = faceapi.resizeResults(detections, displaySize);
                    faceapi.draw.drawDetections(canvas, resizedResult);
                    
                    const expressions = detections[0].expressions;
                    const maxEmotion = Object.keys(expressions).reduce((a, b) => expressions[a] > expressions[b] ? a : b);
                    
                    moodResult.textContent = maxEmotion.toUpperCase();
                    
                    // PERFECTED ALL 7 MOOD SUPPORT
                    if (maxEmotion === 'happy') moodResult.style.color = "#34d399"; // Green
                    else if (maxEmotion === 'neutral') moodResult.style.color = "#60a5fa"; // Blue
                    else if (maxEmotion === 'sad') moodResult.style.color = "#818cf8"; // Purple
                    else if (maxEmotion === 'angry') moodResult.style.color = "#ef4444"; // Red
                    else if (maxEmotion === 'fearful') moodResult.style.color = "#f97316"; // Orange
                    else if (maxEmotion === 'disgusted') moodResult.style.color = "#84cc16"; // Yellow-Green
                    else if (maxEmotion === 'surprised') moodResult.style.color = "#fef08a"; // Bright Yellow
                    
                } else {
                    moodResult.textContent = "NO FACE DETECTED";
                    moodResult.style.color = "#94a3b8";
                }
            }, 800); // Check every 800ms
        });
    } catch(e) {
        console.error(e);
        btn.textContent = "❌ Error Loading Camera";
        btn.disabled = false;
        statusText.textContent = `Status: Blocked / Exception -> ${e.message}`;
        moodResult.textContent = "FAILED";
        moodResult.style.color = "#ef4444";
    }
}

// AI TUTOR
async function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const msg = input.value;
    if (!msg.trim()) return;
    input.value = '';
    
    const box = document.getElementById('chat-history');
    box.innerHTML += `<div style="background: rgba(255,255,255,0.05); padding: 10px; border-radius: 8px; margin-bottom: 10px; width: fit-content; max-width: 80%; align-self: flex-end;"><strong>You:</strong> <span style="color: #f1f5f9;">${msg}</span></div>`;
    box.scrollTop = box.scrollHeight;
    
    const res = await apiCall('/ai/tutor/chat', 'POST', { message: msg });
    if (res.ok) {
        let replyHtml = `<div style="background: rgba(16, 185, 129, 0.1); border-left: 4px solid #10b981; padding: 10px; border-radius: 4px; margin-bottom: 10px; width: fit-content; max-width: 80%;">
            <strong style="color: #10b981;">🤖 Perfect AI Tutor:</strong> ${res.data.reply}
        </div>`;
        if(res.data.suggested_course) {
             replyHtml += `<div style="margin-top: -5px; margin-bottom: 15px; font-size: 0.85rem; color: #fbbf24;">💡 AI Suggestion: Check out the ${res.data.suggested_course} course!</div>`;
        }
        box.innerHTML += replyHtml;
        box.scrollTop = box.scrollHeight;
    }
}
// ═══════════════════════════════════════════════════════
//  LEADERBOARD
// ═══════════════════════════════════════════════════════
async function loadLeaderboard() {
    const res = await apiCall('/features/leaderboard');
    if (!res.ok) return;
    
    document.getElementById('lb-my-rank').textContent = `#${res.data.my_rank || '--'}`;
    document.getElementById('lb-total').textContent = res.data.total_students;
    
    const table = document.getElementById('leaderboard-table');
    const lb = res.data.leaderboard || [];
    
    let html = `<div style="display:grid; grid-template-columns:60px 1fr 100px 80px 120px; gap:10px; padding:10px 15px; background:rgba(255,255,255,0.03); border-radius:8px; font-weight:700; color:#94a3b8; font-size:0.85rem;">
        <span>Rank</span><span>Student</span><span>XP</span><span>Courses</span><span>Level</span>
    </div>`;
    
    lb.forEach((entry, i) => {
        const medals = ['🥇', '🥈', '🥉'];
        const rank = i < 3 ? medals[i] : `#${i+1}`;
        const isMe = entry.email === currentEmail;
        const bg = isMe ? 'rgba(99,102,241,0.15)' : (i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent');
        const border = isMe ? 'border:1px solid rgba(99,102,241,0.3);' : '';
        
        html += `<div style="display:grid; grid-template-columns:60px 1fr 100px 80px 120px; gap:10px; padding:12px 15px; background:${bg}; border-radius:8px; align-items:center; ${border}; color:#e2e8f0; font-size:0.9rem;">
            <span style="font-size:1.3rem; font-weight:800;">${rank}</span>
            <span style="font-weight:${isMe ? '700' : '400'};">${entry.name} ${isMe ? '(You)' : ''}</span>
            <span style="color:#fcd34d; font-weight:700;">${entry.xp}</span>
            <span>${entry.completed}/31</span>
            <span style="font-size:0.85rem;">${entry.level}</span>
        </div>`;
    });
    
    if (lb.length === 0) {
        html += '<p style="text-align:center; color:#64748b; padding:30px;">No students yet. Complete courses to appear on the leaderboard!</p>';
    }
    table.innerHTML = html;
}

// ═══════════════════════════════════════════════════════
//  AUTO NOTES GENERATOR (with Google-like search)
// ═══════════════════════════════════════════════════════
let searchTimeout = null;
async function searchNotes() {
    const query = document.getElementById('notes-search').value.trim();
    const container = document.getElementById('search-results');
    
    if (searchTimeout) clearTimeout(searchTimeout);
    
    if (query.length < 2) {
        container.innerHTML = '';
        return;
    }
    
    // Debounce 300ms
    searchTimeout = setTimeout(async () => {
        container.innerHTML = '<p style="color:#fcd34d;">🔍 Searching...</p>';
        const res = await apiCall(`/features/notes/search?q=${encodeURIComponent(query)}`);
        if (!res.ok) { container.innerHTML = '<p style="color:#ef4444;">Search failed.</p>'; return; }
        
        const results = res.data.results || [];
        if (results.length === 0) {
            container.innerHTML = `<p style="color:#64748b;">No results found for "<strong style="color:#e2e8f0;">${query}</strong>". Try different keywords.</p>`;
            return;
        }
        
        let html = `<p style="color:#34d399; font-size:0.85rem; margin-bottom:10px;">📋 Found ${res.data.total} results for "<strong>${query}</strong>"</p>`;
        results.forEach(r => {
            const highlighted = r.full_content.replace(
                new RegExp(`(${query})`, 'gi'),
                '<mark style="background:#fcd34d; color:#000; padding:0 2px; border-radius:2px;">$1</mark>'
            );
            const lines = highlighted.split('\n');
            const title = lines[0].replace(/^#+\s*/, '');
            const body = lines.slice(1).map(l => l.replace(/^- /, '• ')).join('<br>');
            
            html += `<div style="background:rgba(0,0,0,0.2); border-radius:8px; padding:15px; margin-bottom:8px; border-left:3px solid #60a5fa; cursor:pointer;" onclick="document.getElementById('notes-course').value='${r.course}'; generateNotes();">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <h4 style="color:#60a5fa; margin:0;">${title}</h4>
                    <span style="background:rgba(99,102,241,0.2); color:#a78bfa; padding:3px 10px; border-radius:12px; font-size:0.75rem;">${r.course}</span>
                </div>
                <p style="color:#cbd5e1; font-size:0.85rem; line-height:1.6; margin:8px 0 0;">${body}</p>
            </div>`;
        });
        container.innerHTML = html;
    }, 300);
}

async function generateNotes() {
    const course = document.getElementById('notes-course').value;
    const container = document.getElementById('generated-notes');
    container.innerHTML = '<p style="color:#fcd34d;">⚡ Generating AI notes...</p>';
    
    const res = await apiCall('/features/notes/generate', 'POST', { course });
    if (!res.ok) { container.innerHTML = '<p style="color:#ef4444;">Failed to generate notes.</p>'; return; }
    
    const notes = res.data.notes || [];
    let html = `<div style="background:rgba(16,185,129,0.05); border:1px solid rgba(16,185,129,0.2); border-radius:12px; padding:20px; margin-bottom:15px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
            <h3 style="color:#34d399; margin:0;">📚 ${course} — AI Generated Notes</h3>
            <span style="color:#64748b; font-size:0.85rem;">${notes.length} sections</span>
        </div>`;
    
    notes.forEach((note, i) => {
        const lines = note.split('\n');
        const title = lines[0].replace(/^#+\s*/, '');
        const body = lines.slice(1).map(l => l.replace(/^- /, '• ')).join('<br>');
        
        html += `<div style="background:rgba(0,0,0,0.2); border-radius:8px; padding:15px; margin-bottom:10px; border-left:3px solid #34d399;">
            <h4 style="color:#f8fafc; margin:0 0 8px 0;">📖 Section ${i+1}: ${title}</h4>
            <p style="color:#cbd5e1; font-size:0.9rem; line-height:1.7; margin:0;">${body}</p>
        </div>`;
    });
    
    html += '</div>';
    container.innerHTML = html;
}

async function saveCustomNote() {
    const title = document.getElementById('custom-note-title').value;
    const content = document.getElementById('custom-note-content').value;
    if (!content.trim()) return alert('Please write some notes first.');
    
    const course = document.getElementById('notes-course').value;
    const res = await apiCall('/features/notes/save', 'POST', { course, title, content });
    if (res.ok) {
        document.getElementById('custom-note-title').value = '';
        document.getElementById('custom-note-content').value = '';
        loadSavedNotes();
    }
}

async function loadSavedNotes() {
    const res = await apiCall('/features/notes/list');
    if (!res.ok) return;
    
    const container = document.getElementById('saved-notes-list');
    const notes = (res.data.notes || []).filter(n => n.is_custom);
    
    if (notes.length === 0) {
        container.innerHTML = '<p style="color:#64748b; font-size:0.85rem;">No saved notes yet. Write your first note above!</p>';
        return;
    }
    
    let html = '';
    notes.forEach(n => {
        html += `<div style="background:rgba(139,92,246,0.08); border:1px solid rgba(139,92,246,0.2); border-radius:8px; padding:12px; margin-bottom:8px;">
            <strong style="color:#a78bfa;">${n.title || 'Untitled'}</strong> <span style="color:#64748b; font-size:0.75rem;">[${n.course}]</span>
            <p style="color:#cbd5e1; font-size:0.85rem; margin:5px 0 0;">${n.content.substring(0, 150)}${n.content.length > 150 ? '...' : ''}</p>
        </div>`;
    });
    container.innerHTML = html;
}

// ═══════════════════════════════════════════════════════
//  PEER LEARNING / STUDY ROOMS
// ═══════════════════════════════════════════════════════
let currentRoomId = '';

async function loadStudyRooms() {
    const res = await apiCall('/features/rooms');
    if (!res.ok) return;
    
    const container = document.getElementById('rooms-list');
    const rooms = res.data.rooms || [];
    
    container.innerHTML = rooms.map(r => `
        <div class="glass-card hover-glow" style="padding:20px; cursor:pointer; border:1px solid rgba(96,165,250,0.15); transition:all 0.3s;" onclick="joinRoom('${r.id}', '${r.name}')">
            <h3 style="color:#f8fafc; margin:0 0 8px 0; font-size:1.1rem;">${r.name}</h3>
            <p style="color:#94a3b8; margin:0 0 12px 0; font-size:0.85rem;">Topic: ${r.topic}</p>
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <span style="color:#60a5fa; font-size:0.85rem;">👥 ${r.member_count}/${r.max_members} members</span>
                <span style="color:#34d399; font-size:0.85rem;">💬 ${r.message_count} messages</span>
            </div>
            <button style="width:100%; margin-top:12px; background:linear-gradient(135deg,#3b82f6,#2563eb); padding:8px;">Join Room</button>
        </div>
    `).join('');
}

async function joinRoom(roomId, roomName) {
    currentRoomId = roomId;
    const res = await apiCall('/features/rooms/join', 'POST', { room_id: roomId });
    if (!res.ok) return;
    
    document.getElementById('room-chat-title').textContent = `💬 ${roomName}`;
    document.getElementById('room-chat-section').style.display = 'block';
    loadRoomMessages();
}

async function loadRoomMessages() {
    if (!currentRoomId) return;
    const res = await apiCall(`/features/rooms/messages?room_id=${currentRoomId}`);
    if (!res.ok) return;
    
    const container = document.getElementById('room-messages');
    const msgs = res.data.messages || [];
    
    container.innerHTML = msgs.map(m => {
        const isMe = m.email === currentEmail;
        return `<div style="margin-bottom:8px; text-align:${isMe ? 'right' : 'left'};">
            <span style="font-size:0.75rem; color:#64748b;">${m.user} • ${m.time}</span>
            <div style="display:inline-block; max-width:70%; padding:8px 14px; border-radius:12px; background:${isMe ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.05)'}; color:#e2e8f0; font-size:0.9rem; margin-top:2px;">
                ${m.text}
            </div>
        </div>`;
    }).join('');
    
    if (msgs.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:#64748b; padding:40px;">No messages yet. Say hello! 👋</p>';
    }
    container.scrollTop = container.scrollHeight;
}

async function sendRoomMessage() {
    const input = document.getElementById('room-msg-input');
    const msg = input.value.trim();
    if (!msg || !currentRoomId) return;
    
    input.value = '';
    const res = await apiCall('/features/rooms/chat', 'POST', { room_id: currentRoomId, message: msg });
    if (res.ok) loadRoomMessages();
}

// ═══════════════════════════════════════════════════════
//  LEARNING ANALYTICS
// ═══════════════════════════════════════════════════════
async function loadAnalytics() {
    const res = await apiCall('/features/analytics');
    if (!res.ok) return;
    
    const d = res.data;
    document.getElementById('an-progress').textContent = `${d.progress_pct}%`;
    document.getElementById('an-hours').textContent = `${d.est_study_hours}h`;
    document.getElementById('an-level').textContent = d.level;
    document.getElementById('an-mood').textContent = d.dominant_mood;
    
    // Skill bars
    const skillContainer = document.getElementById('skill-bars');
    const skills = d.skill_scores || {};
    const skillColors = {
        'Frontend': '#f97316', 'Backend': '#10b981', 'Database': '#3b82f6',
        'AI/ML': '#8b5cf6', 'DevOps': '#ec4899', 'CS Core': '#fcd34d'
    };
    
    skillContainer.innerHTML = Object.entries(skills).map(([name, score]) => `
        <div style="margin-bottom:12px;">
            <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                <span style="color:#e2e8f0; font-size:0.9rem;">${name}</span>
                <span style="color:${skillColors[name] || '#60a5fa'}; font-weight:700;">${score}%</span>
            </div>
            <div style="height:10px; background:rgba(255,255,255,0.05); border-radius:5px; overflow:hidden;">
                <div style="height:100%; width:${score}%; background:linear-gradient(90deg,${skillColors[name] || '#60a5fa'},${skillColors[name] || '#60a5fa'}88); border-radius:5px; transition:width 1s ease;"></div>
            </div>
        </div>
    `).join('');
    
    // Activity summary
    const actContainer = document.getElementById('activity-summary');
    actContainer.innerHTML = `
        <div style="background:rgba(0,0,0,0.2); padding:15px; border-radius:8px; text-align:center;">
            <p style="color:#94a3b8; margin:0;">📝 Notes Created</p>
            <p style="color:#34d399; font-size:1.8rem; font-weight:800; margin:5px 0;">${d.notes_count || 0}</p>
        </div>
        <div style="background:rgba(0,0,0,0.2); padding:15px; border-radius:8px; text-align:center;">
            <p style="color:#94a3b8; margin:0;">👥 Rooms Joined</p>
            <p style="color:#60a5fa; font-size:1.8rem; font-weight:800; margin:5px 0;">${d.rooms_joined || 0}</p>
        </div>
        <div style="background:rgba(0,0,0,0.2); padding:15px; border-radius:8px; text-align:center;">
            <p style="color:#94a3b8; margin:0;">⚡ Avg XP/Course</p>
            <p style="color:#fcd34d; font-size:1.8rem; font-weight:800; margin:5px 0;">${d.avg_xp_per_course}</p>
        </div>
        <div style="background:rgba(0,0,0,0.2); padding:15px; border-radius:8px; text-align:center;">
            <p style="color:#94a3b8; margin:0;">🔥 Current Streak</p>
            <p style="color:#f97316; font-size:1.8rem; font-weight:800; margin:5px 0;">${d.streak} days</p>
        </div>
    `;
}

// ═══════════════════════════════════════════════════════
//  AI MOCK INTERVIEW
// ═══════════════════════════════════════════════════════
let interviewSession = null;
let currentQuestionIndex = 0;
let interviewQuestions = [];

async function startInterview() {
    const course = document.getElementById('interview-course').value;
    const res = await apiCall('/features/interview/start', 'POST', { course });
    if (!res.ok) return;
    
    interviewSession = res.data.session_id;
    interviewQuestions = res.data.questions || [];
    currentQuestionIndex = 0;
    
    document.getElementById('interview-setup').style.display = 'none';
    document.getElementById('interview-results').style.display = 'none';
    document.getElementById('interview-area').style.display = 'block';
    
    showInterviewQuestion();
}

function showInterviewQuestion() {
    if (currentQuestionIndex >= interviewQuestions.length) {
        showInterviewResults();
        return;
    }
    
    const q = interviewQuestions[currentQuestionIndex];
    const area = document.getElementById('interview-area');
    
    area.innerHTML = `
        <div style="background:rgba(0,0,0,0.3); padding:25px; border-radius:12px; border:1px solid rgba(236,72,153,0.2);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                <span style="color:#ec4899; font-weight:700;">Question ${currentQuestionIndex + 1} of ${interviewQuestions.length}</span>
                <span style="color:#64748b; font-size:0.85rem;">${document.getElementById('interview-course').value}</span>
            </div>
            <h3 style="color:#f8fafc; font-size:1.15rem; line-height:1.5; margin:0 0 20px 0;">${q.question}</h3>
            <textarea id="interview-answer" rows="6" placeholder="Type your answer here... Be detailed and mention key concepts." style="width:100%; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:8px; padding:15px; color:#f8fafc; font-size:0.95rem; resize:vertical;"></textarea>
            <div style="display:flex; gap:10px; margin-top:15px;">
                <button onclick="submitInterviewAnswer()" style="flex:1; background:linear-gradient(135deg,#10b981,#059669); padding:12px;">✅ Submit Answer</button>
                <button onclick="skipInterviewQuestion()" style="background:rgba(255,255,255,0.1); padding:12px 20px; color:#94a3b8;">Skip →</button>
            </div>
            <div id="answer-feedback" style="margin-top:15px;"></div>
        </div>
    `;
}

async function submitInterviewAnswer() {
    const answer = document.getElementById('interview-answer').value;
    if (!answer.trim()) return alert('Please type an answer.');
    
    const feedback = document.getElementById('answer-feedback');
    feedback.innerHTML = '<p style="color:#fcd34d;">🔄 AI is grading your answer...</p>';
    
    const res = await apiCall('/features/interview/answer', 'POST', {
        session_id: interviewSession,
        question_index: currentQuestionIndex,
        answer: answer
    });
    
    if (!res.ok) return;
    
    const d = res.data;
    const scoreColor = d.score >= 8 ? '#34d399' : d.score >= 5 ? '#fcd34d' : '#ef4444';
    
    feedback.innerHTML = `
        <div style="background:rgba(0,0,0,0.3); padding:15px; border-radius:10px; border-left:4px solid ${scoreColor};">
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <span style="font-size:1.5rem; font-weight:800; color:${scoreColor};">${d.score}/10</span>
                <span style="color:${scoreColor}; font-weight:600;">${d.rating}</span>
            </div>
            <div style="margin-top:10px;">
                ${d.feedback.map(f => `<p style="color:#cbd5e1; font-size:0.85rem; margin:3px 0;">${f}</p>`).join('')}
            </div>
            <p style="color:#94a3b8; font-size:0.8rem; margin-top:10px; font-style:italic;">${d.tip}</p>
            <button onclick="nextInterviewQuestion()" style="margin-top:10px; background:linear-gradient(135deg,#6366f1,#4f46e5); padding:10px 25px;">Next Question →</button>
        </div>
    `;
}

function skipInterviewQuestion() {
    currentQuestionIndex++;
    showInterviewQuestion();
}

function nextInterviewQuestion() {
    currentQuestionIndex++;
    showInterviewQuestion();
}

async function showInterviewResults() {
    const res = await apiCall(`/features/interview/results?session_id=${interviewSession}`);
    if (!res.ok) return;
    
    const d = res.data;
    const area = document.getElementById('interview-area');
    const results = document.getElementById('interview-results');
    area.style.display = 'none';
    results.style.display = 'block';
    
    const avgColor = d.average_score >= 8 ? '#34d399' : d.average_score >= 5 ? '#fcd34d' : '#ef4444';
    
    results.innerHTML = `
        <div style="text-align:center; padding:30px; background:rgba(0,0,0,0.3); border-radius:16px; border:2px solid ${avgColor};">
            <h2 style="color:#f8fafc; margin:0;">🎯 Interview Results</h2>
            <p style="font-size:3.5rem; font-weight:800; color:${avgColor}; margin:15px 0;">${d.average_score}/10</p>
            <p style="font-size:1.3rem; color:${avgColor}; margin:0;">${d.overall_rating}</p>
            <p style="color:#94a3b8; margin-top:10px;">Course: ${d.course} • ${d.total_questions} questions</p>
            
            <div style="margin-top:20px; text-align:left;">
                ${(d.scores || []).map((s, i) => `
                    <div style="display:flex; justify-content:space-between; padding:8px 15px; background:rgba(255,255,255,0.03); border-radius:6px; margin:5px 0;">
                        <span style="color:#cbd5e1;">Q${s.index + 1}</span>
                        <span style="color:${s.score >= 7 ? '#34d399' : s.score >= 4 ? '#fcd34d' : '#ef4444'}; font-weight:700;">${s.score}/10 — ${s.rating}</span>
                    </div>
                `).join('')}
            </div>
            
            <button onclick="document.getElementById('interview-setup').style.display='block'; document.getElementById('interview-results').style.display='none';" 
                style="margin-top:20px; background:linear-gradient(135deg,#ec4899,#f43f5e); padding:12px 30px;">🔄 Start New Interview</button>
        </div>
    `;
}


window.onload = () => {
    // Restore user info from localStorage
    const savedName = localStorage.getItem('userName');
    const savedEmail = localStorage.getItem('userEmail');
    if (savedName) currentUserName = savedName;
    if (savedEmail) currentEmail = savedEmail;
    
    if (localStorage.getItem('token')) {
        document.getElementById('sidebar').style.display = 'block';
        navigate('dashboard');
        // Start automatic AI mood detection & motivation
        startAutoMoodDetection();
    } else {
        navigate('auth');
    }
};

// Add CSS animation for mood notification
const moodStyle = document.createElement('style');
moodStyle.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
`;
document.head.appendChild(moodStyle);
