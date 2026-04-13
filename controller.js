/**
 * Controller layer: wires user events to Model mutations and View updates.
 *
 * Does not build HTML strings; delegates rendering to View and state to Model.
 */

import { Model } from "./model.js";
import { View } from "./view.js";
import { FormValidation } from "./formValidation.js";

export const Controller = {
    /**
     * Bootstraps the app: load catalog, initial render, register all listeners.
     * On failure, shows a user-visible error in the catalog area.
     * @returns {Promise<void>}
     */
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

    /**
     * Delegated click on `#catalog`: if target is inside a product card, add that product to the cart.
     */
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

    /**
     * Delegated click on `#cart`: remove line or adjust quantity via buttons with `data-slug`.
     */
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

    /**
     * Checkout form: validates cart and fields, then persists order and clears cart.
     */
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

    /**
     * Contact form: validates name fields and phone, then appends a message record.
     */
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

    /**
     * Delete buttons in orders and messages tables (confirmed via `confirm()`).
     */
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
