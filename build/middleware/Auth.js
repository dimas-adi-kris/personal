let sessionMustHave = ['token', 'tags', 'user_id', 'user', 'wallets'];

function authMiddleware() {
    let sessionKeys = Object.keys(sessionStorage);
    for (let i = 0; i < sessionMustHave.length; i++) {
        let key = sessionMustHave[i];
        if (sessionKeys.indexOf(key) == -1) {
            sessionStorage.clear();
            sessionStorage.setItem('alert', 'Your session has expired. Please login again.');
            return false;
        }
    }
    return true;
}

export { authMiddleware }