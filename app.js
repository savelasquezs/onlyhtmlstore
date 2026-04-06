/**
 * ==========================================
 * MODEL: data and business rules
 * ==========================================
 */
const Model = {
    products: [],
    categories: [],
    warrantyPlans: [],
    bestSellingProducts: [],
    orders: [],
    messages: [],
    cart: [],

    async loadCatalog() {
        const res = await fetch("./data/products.json");
        if (!res.ok) {
            throw new Error(`HTTP ${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        this.products = data.products ?? [];
        this.categories = data.categories ?? [];
        this.warrantyPlans = data.warrantyPlans ?? [];
        this.bestSellingProducts = data.bestSellingProducts ?? [];
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

    addToCart(slug) {
        const product = this.getProductBySlug(slug);
        if (!product) return false;
        const itemLine = this.cart.find((p) => p.slug === slug);
        if (itemLine) itemLine.quantity += 1;
        else this.cart.push({ slug: product.slug, quantity: 1 });
        return true;
    },

    setCartItemQuantity(slug, quantity) {
        const itemLine = this.cart.find((p) => p.slug === slug);
        if (!itemLine) return;
        if (quantity < 1) this.removeCartItem(slug);
        else itemLine.quantity = quantity;
    },

    removeCartItem(slug) {
        this.cart = this.cart.filter((p) => p.slug !== slug);
    },

    clearCart() {
        this.cart = [];
    },

    getCartTotal() {
        return this.cart.reduce((sum, itemLine) => {
            const p = this.getProductBySlug(itemLine.slug);
            return sum + (p ? Number(p.price) * itemLine.quantity : 0);
        }, 0);
    },

    /** Snapshot of cart lines for an order record */
    getCartSnapshot() {
        return this.cart.map((itemLine) => {
            const p = this.getProductBySlug(itemLine.slug);
            if (!p) return null;
            return {
                slug: p.slug,
                name: p.name,
                unitPrice: p.price,
                quantity: itemLine.quantity,
                lineTotal: Number(p.price) * itemLine.quantity,
            };
        }).filter(Boolean);
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
            const itemsSummary = items
                .map((li) => `${li.name} × ${li.quantity}`)
                .join(", ");
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

/**
 * ==========================================
 * Form validation helpers (native constraints + custom rules)
 * ==========================================
 */
const FormValidation = {
    personNameIssue(value) {
        const t = String(value).trim();
        if (t.length < 3) return "Usa al menos 3 caracteres.";
        if (t.length > 80) return "Máximo 80 caracteres.";
        if (/^\d+$/.test(t)) return "No puede ser solo números.";
        return "";
    },

    normalizePhoneField(inputEl) {
        if (!inputEl) return;
        inputEl.value = inputEl.value.replace(/\D/g, "");
    },

    prepareAndReport(form, nameEls) {
        for (const el of nameEls) {
            el.setCustomValidity(FormValidation.personNameIssue(el.value));
        }
        if (!form.checkValidity()) {
            form.reportValidity();
            for (const el of nameEls) el.setCustomValidity("");
            return false;
        }
        for (const el of nameEls) el.setCustomValidity("");
        return true;
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
            View.renderCart();
            View.renderOrdersTable(Model.orders);
            View.renderMessagesTable(Model.messages);
            this.handleCatalogProductClick();
            this.handleCartPanel();
            this.handleOrderSubmit();
            this.handleContactSubmit();
            this.handleDashboardDeletes();
        } catch (err) {
            View.showDataLoadError(err);
        }
    },

    handleCatalogProductClick() {
        document.getElementById("catalog").addEventListener("click", (e) => {
            const card = e.target.closest("article.product-card[data-product-slug]");
            if (!card) return;
            const slug = card.getAttribute("data-product-slug");
            if (!slug) return;
            if (Model.addToCart(slug)) {
                const p = Model.getProductBySlug(slug);
                View.renderCart();
                View.showNotification(p ? `${p.name} added to cart.` : "Added to cart.");
            }
        });
    },

    handleCartPanel() {
        document.getElementById("cart").addEventListener("click", (e) => {
            const removeBtn = e.target.closest(".cart-remove-line");
            if (removeBtn) {
                const slug = removeBtn.getAttribute("data-slug");
                if (slug) {
                    Model.removeCartItem(slug);
                    View.renderCart();
                    View.showNotification("Item removed from cart.");
                }
                return;
            }
            const qtyBtn = e.target.closest(".cart-qty-btn[data-slug]");
            if (!qtyBtn) return;
            const slug = qtyBtn.getAttribute("data-slug");
            const action = qtyBtn.getAttribute("data-action");
            const line = Model.cart.find((l) => l.slug === slug);
            if (!line) return;
            if (action === "plus") Model.setCartItemQuantity(slug, line.quantity + 1);
            if (action === "minus") Model.setCartItemQuantity(slug, line.quantity - 1);
            View.renderCart();
        });
    },

    handleOrderSubmit() {
        const form = document.getElementById("order-form");
        if (!form) return;
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            if (Model.cart.length === 0) {
                View.showNotification("Your cart is empty.");
                return;
            }
            const nameEl = document.getElementById("store-name");
            const lastEl = document.getElementById("store-last-name");
            FormValidation.normalizePhoneField(document.getElementById("store-phone"));
            if (!FormValidation.prepareAndReport(form, [nameEl, lastEl])) return;

            const lineItems = Model.getCartSnapshot();
            const orderTotal = Model.getCartTotal();
            const data = {
                firstName: nameEl.value.trim(),
                lastName: lastEl.value.trim(),
                phone: document.getElementById("store-phone").value.trim(),
                email: document.getElementById("store-email").value.trim(),
                address: document.getElementById("store-address").value.trim(),
                paymentMethod: document.getElementById("store-payment-method").value,
                instructions: document.getElementById("store-instructions").value.trim(),
                lineItems,
                orderTotal,
            };
            Model.addOrder(data);
            Model.clearCart();
            View.renderCart();
            View.renderOrdersTable(Model.orders);
            View.showNotification("Order placed. Thank you!");
            View.clearForm(form);
        });
    },

    handleContactSubmit() {
        const form = document.getElementById("contact-form");
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const nameEl = document.getElementById("contact-name");
            const lastEl = document.getElementById("contact-last-name");
            FormValidation.normalizePhoneField(document.getElementById("contact-phone"));
            if (!FormValidation.prepareAndReport(form, [nameEl, lastEl])) return;

            const data = {
                firstName: nameEl.value.trim(),
                lastName: lastEl.value.trim(),
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
            const del = e.target.closest(".btn-delete[data-kind='order']");
            if (!del) return;
            const id = Number(del.getAttribute("data-id"));
            if (Number.isNaN(id)) return;
            if (confirm("Delete this order?")) {
                Model.removeOrder(id);
                View.renderOrdersTable(Model.orders);
                View.showNotification("Order removed.");
            }
        });
        View.messagesTableBody.addEventListener("click", (e) => {
            const del = e.target.closest(".btn-delete[data-kind='message']");
            if (!del) return;
            const id = Number(del.getAttribute("data-id"));
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
