let products = [];
let categories = [];
let warrantyPlans = [];
let bestSellingOrder = [];
const productsListContainer = document.getElementById("products-list");
const categoriesListContainer = document.getElementById("categories-list");
const warrantyPlansListContainer = document.getElementById("plans-list");
const bestSellingProductsList = document.getElementById("best-selling-products-list");
const indicatorsListContainer = document.getElementById("indicators-list");

const productString = (p) => `
    <article>
        <div class="product-header">
            <h2 id="${p.slug}">${p.name}</h2>
            <img src="${p.image}" alt="${p.name}">
        </div>
        <dl>
            <dt>
                <strong>Description:</strong>
            </dt>
            <dd>${p.description}</dd>
            <div class="product-specs">
                <div class="product-spec">
                    <dt>
                        <strong>Price:</strong>
                    </dt>
                    <dd>${p.price}</dd>
                </div>
                <div class="product-spec">
                    <dt>
                                        <strong>Brand:</strong>
                                    </dt>
                                    <dd>${p.brand}</dd>
                                </div>
                                <div class="product-spec">
                                    <dt>
                                        <strong>Model:</strong>
                                    </dt>
                                    <dd>${p.model}</dd>
                                </div>
                            </div>

                        </dl>
                    </article>
        `
const bestSellingProductString = (slug) => {
    const product = getProductBySlug(slug);
    if (!product) {
        return "";
    }
    return `
        <li><a href="#${product.slug}">${product.name}</a>
            <br />
            <img src="${product.image}" alt="${product.name}">
            <p>${product.description}</p>
        </li>
    `;
};

const filterBestSellingSlugs = (slugs) =>
    slugs.filter((slug) => {
        if (!getProductBySlug(slug)) {
            console.warn("[Store] bestSellingOrder: slug sin producto, se omite:", slug);
            return false;
        }
        return true;
    });

const categoryString = (c) => `<li><a href="#${c.slug}">${c.label}</a></li>`;

const warrantyPlanRow = (plan) => `
    <tr>
        <td>${plan.name}</td>
        <td>$${plan.price}</td>
        <td>${plan.featureSummary}</td>
    </tr>`;

const indicatorBlock = (p) => {
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
};



fetch("./data/products.json")
    .then((res) => {
        if (!res.ok) {
            throw new Error(`HTTP ${res.status} ${res.statusText}`);
        }
        return res.json();
    })
    .then((data) => {
        products = data.products ?? [];
        categories = data.categories ?? [];
        warrantyPlans = data.warrantyPlans ?? [];
        bestSellingOrder = data.bestSellingOrder ?? [];
        setupProducts();
    })


const setupProducts = () => {
    productsListContainer.innerHTML = products.map((p) => productString(p)).join("");
    const slugsOk = filterBestSellingSlugs(bestSellingOrder);
    bestSellingProductsList.innerHTML = slugsOk.map((slug) => bestSellingProductString(slug)).join("");
    categoriesListContainer.innerHTML = categories.map(c => categoryString(c)).join("");
    warrantyPlansListContainer.innerHTML = warrantyPlans.map((w) => warrantyPlanRow(w)).join("");
    indicatorsListContainer.innerHTML = products.map((p) => indicatorBlock(p)).join("");
};

const getProductBySlug = (slug) => products.find(p => p.slug === slug);



