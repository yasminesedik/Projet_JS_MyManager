// Main Application Entry Point
import { AuthService } from "./services/AuthService.js";
import { Router } from "./utils/Router.js";
import { i18n } from "./utils/i18n.js";
import { Sidebar } from "./components/Sidebar.js";

class App {
  constructor() {
    this.authService = new AuthService();
    this.router = new Router();
    this.sidebar = new Sidebar();
    this.init();
  }

  init() {
    // Check authentication

    if (!this.authService.isAuthenticated()) {
      this.showLogin();
    } else {
      this.showApp();
      this.setupEventListeners();
      this.router.init();
    }
  }

  showLogin() {
    document.getElementById("login-page").classList.remove("d-none");
    document.getElementById("app").classList.add("d-none");
    this.setupLoginForm();
  }

  showApp() {
    document.getElementById("login-page").classList.add("d-none");
    document.getElementById("app").classList.remove("d-none");
  }

  setupLoginForm() {
    const form = document.getElementById("login-form");
    const errorDiv = document.getElementById("login-error");

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      if (this.authService.login(username, password)) {
        errorDiv.classList.add("d-none");
        this.showApp();
        this.setupEventListeners();
        this.router.init();
        i18n.updatePage();
      } else {
        errorDiv.textContent = i18n.t("login.error");
        errorDiv.classList.remove("d-none");
      }
    });
  }

  setupEventListeners() {
    // Logout button
    document.getElementById("logout-btn").addEventListener("click", () => {
      this.authService.logout();
      this.showLogin();
      window.location.hash = "";
    });

    // Language switcher
    document.querySelectorAll("[data-lang]").forEach((item) => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        const lang = e.target.closest("[data-lang]").dataset.lang;
        i18n.setLanguage(lang);
        i18n.updatePage();
      });
    });

    // Sidebar toggle for mobile
    document.getElementById("sidebar-toggle")?.addEventListener("click", () => {
      this.sidebar.toggle();
    });

    // Update current language display
    i18n.onLanguageChange((lang) => {
      const langMap = { fr: "FR", en: "EN", ar: "AR" };
      document.getElementById("current-language").textContent = langMap[lang];
    });
  }
}

// Initialize app when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  console.log("Init from Yas !!!!!!!!!!!!");
  window.app = new App();
});
