/**
 * VIEW: DOM rendering and UI helpers
 */
import { Model } from "./model.js";

export const View = {
    productsListContainer: document.getElementById("products-list"),
    categoriesListContainer: document.getElementById("categories-list"),
    warrantyPlansListContainer: document.getElementById("plans-list"),
    bestSellingProductsList: document.getElementById("best-selling-products-list"),
    indicatorsListContainer: document.getElementById("indicators-list"),
    ordersTableBody: document.getElementById("orders-table-body"),
    messagesTableBody: document.getElementById("messages-table-body"),
    ordersEmpty: document.getElementById("orders-empty"),
    messagesEmpty: document.getElementById("messages-empty"),

    productString(p) {
        return `
    <article class="product-card" data-product-slug="${p.slug}" title="Click to add to cart">
        <div class="product-header">
            <h2 id="${p.slug}">${p.name}</h2>
            <img src="${p.image}" alt="${p.name}" loading="lazy">
        </div>
        <dl>
            <dt><strong>Description:</strong></dt>
            <dd>${p.description}</dd>
            <div class="product-specs">
                <div class="product-spec">
                    <dt><strong>Price:</strong></dt>
                    <dd>${p.price}</dd>
                </div>
                <div class="product-spec">
                    <dt><strong>Brand:</strong></dt>
                    <dd>${p.brand}</dd>
                </div>
                <div class="product-spec">
                    <dt><strong>Model:</strong></dt>
                    <dd>${p.model}</dd>
                </div>
            </div>
        </dl>
        <p class="product-cart-hint">Click this card to add to cart</p>
    </article>`;
    },

    bestSellingProductString(slug) {
        const product = Model.getProductBySlug(slug);
        if (!product) return "";
        return `
        <li><a href="#${product.slug}">${product.name}</a>
            <br />
            <img src="${product.image}" alt="${product.name}" loading="lazy">
            <p>${product.description}</p>
        </li>`;
    },

    categoryString(c) {
        return `<li><a href="#${c.slug}">${c.label}</a></li>`;
    },

    warrantyPlanRow(plan) {
        return `
    <tr>
        <td>${plan.name}</td>
        <td>$${plan.price}</td>
        <td>${plan.featureSummary}</td>
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
            <h4>${p.name}</h4>
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
        const slugsOk = Model.filterBestSellingSlugs(Model.bestSellingProducts);
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

    renderCart() {
        const emptyEl = document.getElementById("cart-empty-state");
        const checkoutEl = document.getElementById("cart-checkout");
        const tbodyEl = document.getElementById("cart-table-body");
        const totalEl = document.getElementById("cart-total-amount");
        const submitBtn = document.getElementById("checkout-submit");
        if (!emptyEl || !checkoutEl || !tbodyEl || !totalEl) return;

        const hasItems = Model.cart.length > 0;

        if (!hasItems) {
            emptyEl.classList.remove("is-hidden");
            checkoutEl.classList.add("is-hidden");
            emptyEl.setAttribute("aria-hidden", "false");
            checkoutEl.setAttribute("aria-hidden", "true");
            if (submitBtn) submitBtn.disabled = true;
            tbodyEl.innerHTML = "";
            totalEl.textContent = "0";
            return;
        }

        emptyEl.classList.add("is-hidden");
        checkoutEl.classList.remove("is-hidden");
        emptyEl.setAttribute("aria-hidden", "true");
        checkoutEl.setAttribute("aria-hidden", "false");
        if (submitBtn) submitBtn.disabled = false;

        tbodyEl.innerHTML = Model.cart
            .map((line) => {
                const p = Model.getProductBySlug(line.slug);
                if (!p) return "";
                const lineTotal = Number(p.price) * line.quantity;
                return `<tr class="cart-row" data-slug="${line.slug}">
                    <td class="cart-line-name">${p.name}</td>
                    <td>$${p.price}</td>
                    <td class="cart-line-qty">
                        <button type="button" class="cart-qty-btn" data-action="minus" data-slug="${line.slug}" aria-label="Decrease quantity">−</button>
                        <span class="cart-qty-value">${line.quantity}</span>
                        <button type="button" class="cart-qty-btn" data-action="plus" data-slug="${line.slug}" aria-label="Increase quantity">+</button>
                    </td>
                    <td class="cart-line-subtotal">$${lineTotal}</td>
                    <td><button type="button" class="cart-remove-line" data-slug="${line.slug}">Remove</button></td>
                </tr>`;
            })
            .join("");

        totalEl.textContent = String(Model.getCartTotal());
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
            const items = Array.isArray(item.lineItems) ? item.lineItems : [];
            const itemsSummary = items.map((li) => `${li.name} × ${li.quantity}`).join(", ");
            const total = item.orderTotal != null ? `$${item.orderTotal}` : "—";
            const row = `
                <tr>
                    <td>${item.date}</td>
                    <td><strong>${fullName}</strong></td>
                    <td>${item.email}</td>
                    <td>${itemsSummary || "—"}</td>
                    <td>${total}</td>
                    <td>${item.paymentMethod}</td>
                    <td>${item.address}</td>
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
                    <td>${item.date}</td>
                    <td><strong>${fullName}</strong></td>
                    <td>${item.email}</td>
                    <td>${item.message}</td>
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
