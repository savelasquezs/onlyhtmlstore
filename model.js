/**
 * MODEL: data and business rules
 */
export const Model = {
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
