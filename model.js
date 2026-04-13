/**
 * Model layer: in-memory application state and business rules.
 *
 * Holds catalog data (from JSON), shopping cart lines, and dashboard records.
 * No DOM access; the View reads this state to render and the Controller mutates it.
 */

/** @typedef {{ slug: string, quantity: number }} CartLine */

export const Model = {
    /** @type {Array<object>} Products from `data/products.json`. */
    products: [],
    /** @type {Array<object>} Category metadata for sidebar links. */
    categories: [],
    /** @type {Array<object>} Warranty plan rows for the plans table. */
    warrantyPlans: [],
    /** @type {Array<string>} Product slugs highlighted as best sellers. */
    bestSellingProducts: [],
    /** @type {Array<object>} Placed orders (checkout submissions). */
    orders: [],
    /** @type {Array<object>} Contact form submissions. */
    messages: [],
    /** @type {CartLine[]} Current cart: each line has `slug` and `quantity`. */
    cart: [],

    /**
     * Fetches and hydrates catalog-related arrays from `./data/products.json`.
     * @returns {Promise<void>}
     * @throws {Error} When the HTTP response is not OK.
     */
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

    /**
     * Looks up a product by its URL-friendly identifier.
     * @param {string} slug
     * @returns {object|undefined}
     */
    getProductBySlug(slug) {
        return this.products.find((p) => p.slug === slug);
    },

    /**
     * Drops unknown slugs from the best-sellers list (bad data in JSON).
     * @param {string[]} slugs
     * @returns {string[]}
     */
    filterBestSellingSlugs(slugs) {
        return slugs.filter((slug) => {
            if (!this.getProductBySlug(slug)) {
                console.warn("Unknown best-seller slug, skipped:", slug);
                return false;
            }
            return true;
        });
    },

    /**
     * Appends an order with server-style metadata (id, date) for the dashboard table.
     * @param {object} data — Shipping fields, lineItems, orderTotal, etc.
     * @returns {object} The stored record including `id` and `date`.
     */
    addOrder(data) {
        const newRecord = {
            id: Date.now(),
            date: new Date().toLocaleDateString(),
            ...data,
        };
        this.orders.push(newRecord);
        return newRecord;
    },

    /**
     * Removes an order row by numeric id.
     * @param {number} id
     */
    removeOrder(id) {
        this.orders = this.orders.filter((r) => r.id !== id);
    },

    /**
     * Stores a contact message with generated id and date.
     * @param {object} data — firstName, lastName, phone, email, message, etc.
     * @returns {object} The stored record.
     */
    addMessage(data) {
        const newRecord = {
            id: Date.now(),
            date: new Date().toLocaleDateString(),
            ...data,
        };
        this.messages.push(newRecord);
        return newRecord;
    },

    /**
     * Removes a contact message by numeric id.
     * @param {number} id
     */
    removeMessage(id) {
        this.messages = this.messages.filter((r) => r.id !== id);
    },

    /**
     * Adds one unit of a product to the cart, or increments quantity if already present.
     * @param {string} slug — Product slug from the catalog.
     * @returns {boolean} `false` if the slug does not match any product.
     */
    addToCart(slug) {
        const product = this.getProductBySlug(slug);
        if (!product) return false;
        const itemLine = this.cart.find((p) => p.slug === slug);
        if (itemLine) itemLine.quantity += 1;
        else this.cart.push({ slug: product.slug, quantity: 1 });
        return true;
    },

    /**
     * Sets quantity for a cart line; removes the line if quantity is below 1.
     * @param {string} slug
     * @param {number} quantity
     */
    setCartItemQuantity(slug, quantity) {
        const itemLine = this.cart.find((p) => p.slug === slug);
        if (!itemLine) return;
        if (quantity < 1) this.removeCartItem(slug);
        else itemLine.quantity = quantity;
    },

    /**
     * Removes every cart line matching the slug.
     * @param {string} slug
     */
    removeCartItem(slug) {
        this.cart = this.cart.filter((p) => p.slug !== slug);
    },

    /** Empties the shopping cart. */
    clearCart() {
        this.cart = [];
    },

    /**
     * Sums line totals (unit price × quantity) for all valid cart lines.
     * @returns {number}
     */
    getCartTotal() {
        return this.cart.reduce((sum, itemLine) => {
            const p = this.getProductBySlug(itemLine.slug);
            return sum + (p ? Number(p.price) * itemLine.quantity : 0);
        }, 0);
    },

    /**
     * Builds a plain snapshot of cart lines for persisting on an order (names, prices, totals).
     * @returns {Array<{ slug: string, name: string, unitPrice: *, quantity: number, lineTotal: number }>}
     */
    getCartSnapshot() {
        return this.cart
            .map((itemLine) => {
                const p = this.getProductBySlug(itemLine.slug);
                if (!p) return null;
                return {
                    slug: p.slug,
                    name: p.name,
                    unitPrice: p.price,
                    quantity: itemLine.quantity,
                    lineTotal: Number(p.price) * itemLine.quantity,
                };
            })
            .filter(Boolean);
    },
};
