const API_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && window.location.port === '8000' 
    ? 'http://localhost:5001/api' 
    : '/api';

function getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
}

async function apiCall(endpoint, method = 'GET', body = null) {
    const options = {
        method,
        headers: getAuthHeaders()
    };
    if (body) {
        options.body = JSON.stringify(body);
    }
    
    try {
        const response = await fetch(`${API_URL}${endpoint}`, options);
        let data;
        try {
            data = await response.json();
        } catch(e) {
            data = { error: "Unparseable response from server." };
        }
        
        // Global 401/422 handler: if JWT is expired/invalid, auto-logout
        // Flask-JWT-Extended returns 422 for invalid/missing tokens, 401 for expired
        if ((response.status === 401 || response.status === 422) && localStorage.getItem('token')) {
            // Don't auto-logout for auth endpoints or mood auto-checks
            const skipAutoLogout = ['/auth/', '/ai/mood/'];
            const shouldSkip = skipAutoLogout.some(s => endpoint.includes(s));
            if (!shouldSkip) {
                console.warn('Session expired or invalid. Logging out...');
                localStorage.removeItem('token');
                localStorage.removeItem('userEmail');
                localStorage.removeItem('userName');
                document.getElementById('sidebar').style.display = 'none';
                if (typeof navigate === 'function') navigate('auth');
                if (typeof showMessage === 'function') showMessage('⚠️ Session expired. Please register/login again.', '#fcd34d');
                return { ok: false, status: response.status, data };
            }
        }
        
        return { ok: response.ok, status: response.status, data };
    } catch (error) {
        console.error('API Error:', error);
        return { ok: false, data: { error: 'Network error or backend is not running on port 5001.' } };
    }
}

