export class AuthService {
  constructor() {
    this.STORAGE_KEY = "mymanager_auth";
    this.CREDENTIALS = {
      username: "yass",
      password: "yass",
    };
  }

  login(username, password) {
    if (
      username === this.CREDENTIALS.username &&
      password === this.CREDENTIALS.password
    ) {
      const session = {
        username: username,
        timestamp: Date.now(),
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(session));
      return true;
    }
    return false;
  }

  logout() {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  isAuthenticated() {
    const session = localStorage.getItem(this.STORAGE_KEY);
    if (!session) return false;

    try {
      const data = JSON.parse(session);
      // Check if session is still valid (24 hours)
      const maxAge = 24 * 60 * 60 * 1000;
      if (Date.now() - data.timestamp > maxAge) {
        this.logout();
        return false;
      }
      return true;
    } catch {
      return false;
    }
  }

  getCurrentUser() {
    const session = localStorage.getItem(this.STORAGE_KEY);
    if (session) {
      try {
        return JSON.parse(session);
      } catch {
        return null;
      }
    }
    return null;
  }
}
