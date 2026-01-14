// Games View
import { GameService } from "../services/GameService.js";
import { GenreService } from "../services/GenreService.js";
import { PlatformService } from "../services/PlatformService.js";
import { Table } from "../components/Table.js";
import { Modal } from "../components/Modal.js";
import { ExportUtils } from "../utils/ExportUtils.js";
import { i18n } from "../utils/i18n.js";

export class GamesView {
  constructor(container, params = {}) {
    this.container = container;

    this.gameService = new GameService();
    this.genreService = new GenreService();
    this.platformService = new PlatformService();

    this.table = null;
    this.games = [];
    this.genres = [];
    this.platforms = [];

    // 🔹 initialize data from API → localStorage
    this.init();
  }
  async init() {
    await this.gameService.initData();
    await this.genreService.initData();
    await this.platformService.initData();

    this.games = await this.gameService.getAll();
    this.genres = await this.genreService.getAll();
    this.platforms = await this.platformService.getAll();

    this.render();
  }

  async render() {
    await this.loadData();

    this.container.innerHTML = `
            <div class="games-view">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h2 data-i18n="games.title">${i18n.t("games.title")}</h2>
                    <button class="btn btn-primary" id="add-game-btn">
                        <i class="fas fa-plus"></i> <span data-i18n="games.add">${i18n.t(
                          "games.add"
                        )}</span>
                    </button>
                </div>
                <div id="games-table-container"></div>
            </div>
        `;

    this.renderTable();
    this.setupEventListeners();
  }

  async loadData() {
    const [games, genres, platforms] = await Promise.all([
      this.gameService.getAll(),
      this.genreService.getAll(),
      this.platformService.getAll(),
    ]);
    this.games = games;
    this.genres = genres;
    this.platforms = platforms;
  }

  renderTable() {
    const container = document.getElementById("games-table-container");
    this.table = new Table(container, {
      columns: [
        { key: "name", label: i18n.t("games.name"), sortable: true },
        { key: "genre", label: i18n.t("games.genre"), sortable: true },
        { key: "platform", label: i18n.t("games.platform"), sortable: true },
        {
          key: "price",
          label: i18n.t("games.price"),
          sortable: true,
          type: "currency",
        },
        {
          key: "releaseDate",
          label: i18n.t("games.releaseDate"),
          sortable: true,
          type: "date",
        },
        { key: "rating", label: i18n.t("games.rating"), sortable: true },
      ],
      data: this.games,
      searchable: true,
      sortable: true,
      pagination: true,
      pageSize: 10,
      exportCSV: true,
      actions: [
        { name: "view", icon: "eye", type: "info" },
        { name: "edit", icon: "edit", type: "warning" },
        { name: "delete", icon: "trash", type: "danger" },
      ],
      onAction: (action, id) => this.handleAction(action, id),
      onExportCSV: (data) => this.exportCSV(data),
    });
    this.table.render();
  }

  handleAction(action, id) {
    switch (action) {
      case "view":
        this.viewGame(id);
        break;
      case "edit":
        this.editGame(id);
        break;
      case "delete":
        this.deleteGame(id);
        break;
    }
  }

  async viewGame(id) {
    const game = await this.gameService.getById(id);
    if (!game) return;

    const modal = new Modal({
      title: game.name,
      size: "modal-lg",
      body: `
                <div class="row">
                    <div class="col-md-6">
                        <p><strong>${i18n.t("games.genre")}:</strong> ${
        game.genre
      }</p>
                        <p><strong>${i18n.t("games.platform")}:</strong> ${
        game.platform
      }</p>
                        <p><strong>${i18n.t("games.price")}:</strong> $${
        game.price
      }</p>
                        <p><strong>${i18n.t(
                          "games.releaseDate"
                        )}:</strong> ${new Date(
        game.releaseDate
      ).toLocaleDateString()}</p>
                        <p><strong>${i18n.t("games.rating")}:</strong> ${
        game.rating
      }/10</p>
                    </div>
                    <div class="col-md-6">
                        <p><strong>${i18n.t("games.description")}:</strong></p>
                        <p>${game.description || "-"}</p>
                    </div>
                </div>
            `,
      footer: `
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${i18n.t(
                  "common.cancel"
                )}</button>
                <button type="button" class="btn btn-primary" id="export-pdf-btn">
                    <i class="fas fa-file-pdf"></i> ${i18n.t(
                      "common.exportPDF"
                    )}
                </button>
            `,
    });

    const modalEl = modal.show();
    modalEl.querySelector("#export-pdf-btn").addEventListener("click", () => {
      ExportUtils.exportToPDF(
        game,
        game.name,
        `${game.name.replace(/\s+/g, "_")}.pdf`
      );
    });
  }

  async editGame(id) {
    const game = await this.gameService.getById(id);
    if (!game) return;

    this.showGameForm(game);
  }

  showGameForm(game = null) {
    const isEdit = !!game;
    const modal = new Modal({
      title: isEdit ? i18n.t("common.edit") : i18n.t("games.add"),
      size: "modal-lg",
      body: `
                <form id="game-form">
                    <div class="mb-3">
                        <label class="form-label">${i18n.t(
                          "games.name"
                        )}</label>
                        <input type="text" class="form-control" id="game-name" value="${
                          game?.name || ""
                        }" required>
                    </div>
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label">${i18n.t(
                              "games.genre"
                            )}</label>
                            <select class="form-select" id="game-genre" required>
                                <option value="">${i18n.t(
                                  "common.filter"
                                )}...</option>
                                ${this.genres
                                  .map(
                                    (g) => `
                                    <option value="${g.name}" ${
                                      game?.genre === g.name ? "selected" : ""
                                    }>${g.name}</option>
                                `
                                  )
                                  .join("")}
                            </select>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label">${i18n.t(
                              "games.platform"
                            )}</label>
                            <select class="form-select" id="game-platform" required>
                                <option value="">${i18n.t(
                                  "common.filter"
                                )}...</option>
                                ${this.platforms
                                  .map(
                                    (p) => `
                                    <option value="${p.name}" ${
                                      game?.platform === p.name
                                        ? "selected"
                                        : ""
                                    }>${p.name}</option>
                                `
                                  )
                                  .join("")}
                            </select>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-4 mb-3">
                            <label class="form-label">${i18n.t(
                              "games.price"
                            )}</label>
                            <input type="number" step="0.01" class="form-control" id="game-price" value="${
                              game?.price || ""
                            }" required>
                        </div>
                        <div class="col-md-4 mb-3">
                            <label class="form-label">${i18n.t(
                              "games.releaseDate"
                            )}</label>
                            <input type="date" class="form-control" id="game-release-date" value="${
                              game?.releaseDate || ""
                            }" required>
                        </div>
                        <div class="col-md-4 mb-3">
                            <label class="form-label">${i18n.t(
                              "games.rating"
                            )}</label>
                            <input type="number" step="0.1" min="0" max="10" class="form-control" id="game-rating" value="${
                              game?.rating || ""
                            }" required>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">${i18n.t(
                          "games.description"
                        )}</label>
                        <textarea class="form-control" id="game-description" rows="3">${
                          game?.description || ""
                        }</textarea>
                    </div>
                </form>
            `,
      footer: `
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${i18n.t(
                  "common.cancel"
                )}</button>
                <button type="button" class="btn btn-primary" id="save-game-btn">${i18n.t(
                  "common.save"
                )}</button>
            `,
    });

    const modalEl = modal.show();
    modalEl.querySelector("#save-game-btn").addEventListener("click", () => {
      this.saveGame(game?.id, modal);
    });
  }

  async saveGame(id, modal) {
    const form = document.getElementById("game-form");
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const gameData = {
      name: document.getElementById("game-name").value,
      genre: document.getElementById("game-genre").value,
      platform: document.getElementById("game-platform").value,
      price: parseFloat(document.getElementById("game-price").value),
      releaseDate: document.getElementById("game-release-date").value,
      rating: parseFloat(document.getElementById("game-rating").value),
      description: document.getElementById("game-description").value,
    };

    try {
      if (id) {
        await this.gameService.update(id, gameData);
      } else {
        await this.gameService.create(gameData);
      }
      modal.hide();
      await this.loadData();
      this.table.updateData(this.games);
    } catch (error) {
      alert("Error saving game: " + error.message);
    }
  }

  async deleteGame(id) {
    Modal.confirm(i18n.t("common.confirmDelete"), async () => {
      try {
        await this.gameService.delete(id);
        await this.loadData();
        this.table.updateData(this.games);
      } catch (error) {
        alert("Error deleting game: " + error.message);
      }
    });
  }

  exportCSV(data) {
    ExportUtils.exportToCSV(data, "games.csv");
  }

  setupEventListeners() {
    document.getElementById("add-game-btn").addEventListener("click", () => {
      this.showGameForm();
    });
  }

  destroy() {
    // Cleanup if needed
  }
}
