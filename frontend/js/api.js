const API_URL = '/api';

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
        
        // Global 401 handler: if JWT is expired/invalid, auto-logout
        if (response.status === 401 && localStorage.getItem('token')) {
            // Don't auto-logout for auth endpoints or mood auto-checks
            const skipAutoLogout = ['/auth/', '/ai/mood/'];
            const shouldSkip = skipAutoLogout.some(s => endpoint.includes(s));
            if (!shouldSkip) {
                console.warn('Session expired. Logging out...');
                localStorage.removeItem('token');
                localStorage.removeItem('userEmail');
                localStorage.removeItem('userName');
                document.getElementById('sidebar').style.display = 'none';
                if (typeof navigate === 'function') navigate('auth');
                if (typeof showMessage === 'function') showMessage('⚠️ Session expired. Please login again.', '#fcd34d');
            }
        }
        
        return { ok: response.ok, status: response.status, data };
    } catch (error) {
        console.error('API Error:', error);
        return { ok: false, data: { error: 'Network error or backend is not running on port 5001.' } };
    }
}

