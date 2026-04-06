/**
 * ==========================================
 * MODEL: data and business rules
 * ==========================================
 */
const Model = {
    products: [],
    categories: [],
    warrantyPlans: [],
    bestSellingOrder: [],
    orders: [],
    messages: [],

    async loadCatalog() {
        const res = await fetch("./data/products.json");
        if (!res.ok) {
            throw new Error(`HTTP ${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        this.products = data.products ?? [];
        this.categories = data.categories ?? [];
        this.warrantyPlans = data.warrantyPlans ?? [];
        this.bestSellingOrder = data.bestSellingOrder ?? [];
    },

    getProductBySlug(slug) {
        return this.products.find((p) => p.slug === slug);
    },

    filterBestSellingSlugs(slugs) {
        return slugs.filter((slug) => {
            if (!this.getProductBySlug(slug)) {
                console.warn("Unknown best-seller slug, skipped:", slug);
                return false;
            }
            return true;
        });
    },

    addOrder(data) {
        const newRecord = {
            id: Date.now(),
            date: new Date().toLocaleDateString(),
            ...data,
        };
        this.orders.push(newRecord);
        return newRecord;
    },

    removeOrder(id) {
        this.orders = this.orders.filter((r) => r.id !== id);
    },

    addMessage(data) {
        const newRecord = {
            id: Date.now(),
            date: new Date().toLocaleDateString(),
            ...data,
        };
        this.messages.push(newRecord);
        return newRecord;
    },

    removeMessage(id) {
        this.messages = this.messages.filter((r) => r.id !== id);
    },
};

/**
 * ==========================================
 * VIEW: DOM rendering and UI helpers
 * ==========================================
 */
const View = {
    productsListContainer: document.getElementById("products-list"),
    categoriesListContainer: document.getElementById("categories-list"),
    warrantyPlansListContainer: document.getElementById("plans-list"),
    bestSellingProductsList: document.getElementById("best-selling-products-list"),
    indicatorsListContainer: document.getElementById("indicators-list"),
    ordersTableBody: document.getElementById("orders-table-body"),
    messagesTableBody: document.getElementById("messages-table-body"),
    ordersEmpty: document.getElementById("orders-empty"),
    messagesEmpty: document.getElementById("messages-empty"),

    escapeHtml(text) {
        if (text == null) return "";
        return String(text)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    },

    productString(p) {
        return `
    <article>
        <div class="product-header">
            <h2 id="${p.slug}">${this.escapeHtml(p.name)}</h2>
            <img src="${this.escapeHtml(p.image)}" alt="${this.escapeHtml(p.name)}" loading="lazy">
        </div>
        <dl>
            <dt><strong>Description:</strong></dt>
            <dd>${this.escapeHtml(p.description)}</dd>
            <div class="product-specs">
                <div class="product-spec">
                    <dt><strong>Price:</strong></dt>
                    <dd>${this.escapeHtml(p.price)}</dd>
                </div>
                <div class="product-spec">
                    <dt><strong>Brand:</strong></dt>
                    <dd>${this.escapeHtml(p.brand)}</dd>
                </div>
                <div class="product-spec">
                    <dt><strong>Model:</strong></dt>
                    <dd>${this.escapeHtml(p.model)}</dd>
                </div>
            </div>
        </dl>
    </article>`;
    },

    bestSellingProductString(slug) {
        const product = Model.getProductBySlug(slug);
        if (!product) return "";
        return `
        <li><a href="#${this.escapeHtml(product.slug)}">${this.escapeHtml(product.name)}</a>
            <br />
            <img src="${this.escapeHtml(product.image)}" alt="${this.escapeHtml(product.name)}" loading="lazy">
            <p>${this.escapeHtml(product.description)}</p>
        </li>`;
    },

    categoryString(c) {
        const hrefId = c.catalogAnchor || c.slug;
        return `<li><a href="#${this.escapeHtml(hrefId)}">${this.escapeHtml(c.label)}</a></li>`;
    },

    warrantyPlanRow(plan) {
        return `
    <tr>
        <td>${this.escapeHtml(plan.name)}</td>
        <td>$${this.escapeHtml(plan.price)}</td>
        <td>${this.escapeHtml(plan.featureSummary)}</td>
    </tr>`;
    },

    indicatorBlock(p) {
        const maxRating = p.rating?.max ?? 5;
        const avg = p.rating?.average ?? 0;
        const stockMax = p.stock?.outOf ?? 5;
        const stockVal = p.stock?.remaining ?? 0;
        const ratingLabel = Number.isInteger(avg) ? String(avg) : avg.toFixed(1);
        return `
        <div class="indicators-container">
            <h4>${this.escapeHtml(p.name)}</h4>
            <h5>Customer satisfaction rating: <strong>${ratingLabel}</strong></h5>
            <meter value="${avg}" min="0" max="${maxRating}"></meter>
            <h5><strong>stock remaining: </strong>${stockVal} out of ${stockMax}</h5>
            <progress value="${stockVal}" min="0" max="${stockMax}"></progress>
        </div>`;
    },

    renderCatalog() {
        this.productsListContainer.innerHTML = Model.products.map((p) => this.productString(p)).join("");
    },

    renderBestSelling() {
        const slugsOk = Model.filterBestSellingSlugs(Model.bestSellingOrder);
        this.bestSellingProductsList.innerHTML = slugsOk.map((slug) => this.bestSellingProductString(slug)).join("");
    },

    renderCategories() {
        this.categoriesListContainer.innerHTML = Model.categories.map((c) => this.categoryString(c)).join("");
    },

    renderWarrantyPlans() {
        this.warrantyPlansListContainer.innerHTML = Model.warrantyPlans.map((w) => this.warrantyPlanRow(w)).join("");
    },

    renderIndicators() {
        this.indicatorsListContainer.innerHTML = Model.products.map((p) => this.indicatorBlock(p)).join("");
    },

    renderCatalogAll() {
        this.renderCatalog();
        this.renderBestSelling();
        this.renderCategories();
        this.renderWarrantyPlans();
        this.renderIndicators();
    },

    renderOrdersTable(orders) {
        this.ordersTableBody.innerHTML = "";
        if (orders.length === 0) {
            this.ordersEmpty.style.display = "block";
            return;
        }
        this.ordersEmpty.style.display = "none";
        orders.forEach((item) => {
            const fullName = `${item.firstName} ${item.lastName}`.trim();
            const row = `
                <tr>
                    <td>${this.escapeHtml(item.date)}</td>
                    <td><strong>${this.escapeHtml(fullName)}</strong></td>
                    <td>${this.escapeHtml(item.email)}</td>
                    <td>${this.escapeHtml(item.paymentMethod)}</td>
                    <td>${this.escapeHtml(item.address)}</td>
                    <td><button type="button" class="btn-delete" data-kind="order" data-id="${item.id}">Delete</button></td>
                </tr>`;
            this.ordersTableBody.insertAdjacentHTML("beforeend", row);
        });
    },

    renderMessagesTable(messages) {
        this.messagesTableBody.innerHTML = "";
        if (messages.length === 0) {
            this.messagesEmpty.style.display = "block";
            return;
        }
        this.messagesEmpty.style.display = "none";
        messages.forEach((item) => {
            const fullName = `${item.firstName} ${item.lastName}`.trim();
            const row = `
                <tr>
                    <td>${this.escapeHtml(item.date)}</td>
                    <td><strong>${this.escapeHtml(fullName)}</strong></td>
                    <td>${this.escapeHtml(item.email)}</td>
                    <td>${this.escapeHtml(item.message)}</td>
                    <td><button type="button" class="btn-delete" data-kind="message" data-id="${item.id}">Delete</button></td>
                </tr>`;
            this.messagesTableBody.insertAdjacentHTML("beforeend", row);
        });
    },

    showDataLoadError(err) {
        console.error("Failed to load catalog data:", err);
        const msg =
            '<p role="alert">Could not load product data. Serve the site over HTTP (do not use <code>file://</code>) and check that <code>data/products.json</code> exists.</p>';
        this.productsListContainer.innerHTML = msg;
        this.bestSellingProductsList.innerHTML = "";
        this.categoriesListContainer.innerHTML = "";
        this.warrantyPlansListContainer.innerHTML = "";
        this.indicatorsListContainer.innerHTML = "";
    },

    showNotification(msg) {
        const container = document.getElementById("toast-container");
        const toast = document.createElement("div");
        toast.className = "toast";
        toast.textContent = msg;
        container.appendChild(toast);
        setTimeout(() => toast.remove(), 4000);
    },

    clearForm(formEl) {
        formEl.reset();
    },
};

/**
 * ==========================================
 * CONTROLLER: event wiring and flow
 * ==========================================
 */
const Controller = {
    async init() {
        try {
            await Model.loadCatalog();
            View.renderCatalogAll();
            View.renderOrdersTable(Model.orders);
            View.renderMessagesTable(Model.messages);
            this.handleOrderSubmit();
            this.handleContactSubmit();
            this.handleDashboardDeletes();
        } catch (err) {
            View.showDataLoadError(err);
        }
    },

    handleOrderSubmit() {
        const form = document.getElementById("order-form");
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const data = {
                firstName: document.getElementById("store-name").value.trim(),
                lastName: document.getElementById("store-last-name").value.trim(),
                phone: document.getElementById("store-phone").value.trim(),
                email: document.getElementById("store-email").value.trim(),
                address: document.getElementById("store-address").value.trim(),
                paymentMethod: document.getElementById("store-payment-method").value,
                instructions: document.getElementById("store-instructions").value.trim(),
            };
            Model.addOrder(data);
            View.renderOrdersTable(Model.orders);
            View.showNotification(`Order saved`);
            View.clearForm(form);
        });
    },

    handleContactSubmit() {
        const form = document.getElementById("contact-form");
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const data = {
                firstName: document.getElementById("contact-name").value.trim(),
                lastName: document.getElementById("contact-last-name").value.trim(),
                phone: document.getElementById("contact-phone").value.trim(),
                email: document.getElementById("contact-email").value.trim(),
                message: document.getElementById("contact-message").value.trim(),
            };
            Model.addMessage(data);
            View.renderMessagesTable(Model.messages);
            View.showNotification(`Message from ${data.firstName} received.`);
            View.clearForm(form);
        });
    },

    handleDashboardDeletes() {
        View.ordersTableBody.addEventListener("click", (e) => {
            if (!e.target.classList.contains("btn-delete") || e.target.getAttribute("data-kind") !== "order") return;
            const id = Number(e.target.getAttribute("data-id"));
            if (Number.isNaN(id)) return;
            if (confirm("Delete this order?")) {
                Model.removeOrder(id);
                View.renderOrdersTable(Model.orders);
                View.showNotification("Order removed.");
            }
        });
        View.messagesTableBody.addEventListener("click", (e) => {
            if (!e.target.classList.contains("btn-delete") || e.target.getAttribute("data-kind") !== "message") return;
            const id = Number(e.target.getAttribute("data-id"));
            if (Number.isNaN(id)) return;
            if (confirm("Delete this message?")) {
                Model.removeMessage(id);
                View.renderMessagesTable(Model.messages);
                View.showNotification("Message removed.");
            }
        });
    },
};

// App entry: run after the document is parsed
document.addEventListener("DOMContentLoaded", () => Controller.init());
