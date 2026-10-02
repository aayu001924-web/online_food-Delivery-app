/* =================================================
   FOODIE PRO - JAVASCRIPT
   ================================================= */


/* ================= DATA ================= */

let cart = JSON.parse(localStorage.getItem("foodieCart")) || [];

let orders = JSON.parse(localStorage.getItem("foodieOrders")) || [];

let favorites =
    JSON.parse(localStorage.getItem("foodieFavorites")) || [];

let currentCoupon = 0;

let currentDetail = null;


/* ================= DOM ================= */

const cartOverlay = document.getElementById("cartOverlay");

const checkoutOverlay =
    document.getElementById("checkoutOverlay");

const loginOverlay =
    document.getElementById("loginOverlay");

const foodOverlay =
    document.getElementById("foodOverlay");

const cartItems =
    document.getElementById("cartItems");

const cartCount =
    document.getElementById("cartCount");

const subtotalEl =
    document.getElementById("subtotal");

const deliveryEl =
    document.getElementById("delivery");

const gstEl =
    document.getElementById("gst");

const discountEl =
    document.getElementById("discount");

const totalEl =
    document.getElementById("total");

const toast =
    document.getElementById("toast");

const toastMessage =
    document.getElementById("toastMessage");


/* ================= TOAST ================= */

function showToast(message) {

    toastMessage.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}


/* ================= CART ================= */

function saveCart() {

    localStorage.setItem(
        "foodieCart",
        JSON.stringify(cart)
    );

    updateCart();
}


function addToCart(name, price, category) {

    const existing = cart.find(
        item => item.name === name
    );

    if (existing) {

        existing.quantity++;

    } else {

        cart.push({
            name,
            price,
            category,
            quantity: 1
        });

    }

    saveCart();

    showToast(`${name} added to cart 🛒`);
}


function updateCart() {

    cartItems.innerHTML = "";

    let subtotal = 0;

    let totalQuantity = 0;


    if (cart.length === 0) {

        cartItems.innerHTML = `
            <div class="empty-orders">
                <div style="font-size:50px;">🛒</div>
                <h3>Your Cart is Empty</h3>
                <p>Add some delicious food.</p>
            </div>
        `;

    }


    cart.forEach((item, index) => {

        subtotal += item.price * item.quantity;

        totalQuantity += item.quantity;


        const icons = {
            pizza: "🍕",
            burger: "🍔",
            pasta: "🍝",
            indian: "🍛",
            dessert: "🍰",
            drink: "🥤"
        };


        const div = document.createElement("div");

        div.className = "cart-item";

        div.innerHTML = `

            <div class="cart-food-icon">
                ${icons[item.category] || "🍽️"}
            </div>

            <div class="cart-item-info">

                <h4>${item.name}</h4>

                <small>₹${item.price} each</small>

                <div class="qty-controls">

                    <button onclick="changeQuantity(${index}, -1)">
                        −
                    </button>

                    <span>${item.quantity}</span>

                    <button onclick="changeQuantity(${index}, 1)">
                        +
                    </button>

                    <button
                        class="remove-item"
                        onclick="removeItem(${index})">
                        <i class="fa-solid fa-trash"></i>
                    </button>

                </div>

            </div>

            <strong>
                ₹${item.price * item.quantity}
            </strong>
        `;

        cartItems.appendChild(div);

    });


    const delivery =
        subtotal === 0 ? 0 : subtotal >= 499 ? 0 : 40;

    const gst =
        Math.round(subtotal * 0.05);

    const discount =
        Math.round(subtotal * currentCoupon / 100);

    const total =
        subtotal + delivery + gst - discount;


    subtotalEl.textContent = `₹${subtotal}`;

    deliveryEl.textContent =
        delivery === 0 ? "FREE" : `₹${delivery}`;

    gstEl.textContent = `₹${gst}`;

    discountEl.textContent = `-₹${discount}`;

    totalEl.textContent =
        `₹${Math.max(total, 0)}`;

    cartCount.textContent = totalQuantity;

}


/* ================= QUANTITY ================= */

function changeQuantity(index, amount) {

    cart[index].quantity += amount;

    if (cart[index].quantity <= 0) {

        cart.splice(index, 1);

    }

    saveCart();
}


function removeItem(index) {

    const item = cart[index];

    cart.splice(index, 1);

    saveCart();

    showToast(`${item.name} removed`);
}


/* ================= OPEN CART ================= */

document.getElementById("cartBtn")
    .addEventListener("click", () => {

        cartOverlay.classList.add("show");

        updateCart();
    });


document.getElementById("closeCart")
    .addEventListener("click", () => {

        cartOverlay.classList.remove("show");

    });


/* ================= COUPON ================= */

document.getElementById("applyCoupon")
    .addEventListener("click", () => {

        const input =
            document.getElementById("couponInput");

        const code =
            input.value.trim().toUpperCase();


        if (code === "FOOD20") {

            currentCoupon = 20;

            showToast("20% discount applied 🎉");

        } else {

            currentCoupon = 0;

            showToast("Invalid coupon code ❌");

        }

        updateCart();

    });


document.getElementById("copyCoupon")
    .addEventListener("click", async () => {

        try {

            await navigator.clipboard.writeText("FOOD20");

            showToast("Coupon FOOD20 copied!");

        } catch {

            showToast("Coupon: FOOD20");

        }

    });


/* ================= CHECKOUT ================= */

document.getElementById("checkoutBtn")
    .addEventListener("click", () => {

        if (cart.length === 0) {

            showToast("Cart is empty!");

            return;
        }

        cartOverlay.classList.remove("show");

        checkoutOverlay.classList.add("show");

    });


document.getElementById("closeCheckout")
    .addEventListener("click", () => {

        checkoutOverlay.classList.remove("show");

    });


/* ================= PLACE ORDER ================= */

document.getElementById("checkoutForm")
    .addEventListener("submit", function(e) {

        e.preventDefault();


        if (cart.length === 0) {

            showToast("Your cart is empty!");

            return;
        }


        const name =
            document.getElementById("customerName").value;

        const phone =
            document.getElementById("customerPhone").value;

        const address =
            document.getElementById("customerAddress").value;

        const payment =
            document.getElementById("paymentMethod").value;


        let subtotal = 0;

        cart.forEach(item => {

            subtotal += item.price * item.quantity;

        });


        const delivery =
            subtotal >= 499 ? 0 : 40;

        const gst =
            Math.round(subtotal * 0.05);

        const discount =
            Math.round(subtotal * currentCoupon / 100);

        const total =
            subtotal + delivery + gst - discount;


        const order = {

            id:
                "FD" +
                Math.floor(
                    100000 + Math.random() * 900000
                ),

            date:
                new Date().toLocaleString(),

            customer: name,

            phone: phone,

            address: address,

            payment: payment,

            items: [...cart],

            total: Math.max(total, 0),

            status: "Order Placed"

        };


        orders.unshift(order);


        localStorage.setItem(
            "foodieOrders",
            JSON.stringify(orders)
        );


        cart = [];

        currentCoupon = 0;

        saveCart();


        this.reset();

        checkoutOverlay.classList.remove("show");


        showToast(
            `Order ${order.id} placed successfully 🎉`
        );


        renderOrders();


        setTimeout(() => {

            document
                .getElementById("orders")
                .scrollIntoView({
                    behavior: "smooth"
                });

        }, 500);

    });


/* ================= ORDER HISTORY ================= */

function renderOrders() {

    const container =
        document.getElementById("ordersList");


    if (orders.length === 0) {

        container.innerHTML = `
            <div class="empty-orders">

                <i class="fa-solid fa-receipt"></i>

                <h3>No Orders Yet</h3>

                <p>Your placed orders will appear here.</p>

            </div>
        `;

        return;
    }


    container.innerHTML = "";


    orders.forEach(order => {

        const div =
            document.createElement("div");

        div.className = "order-card";


        const itemText =
            order.items
                .map(
                    item =>
                        `${item.name} × ${item.quantity}`
                )
                .join(", ");


        div.innerHTML = `

            <div class="order-top">

                <div>

                    <strong>
                        Order #${order.id}
                    </strong>

                    <br>

                    <small>
                        ${order.date}
                    </small>

                </div>

                <span class="order-status">
                    ${order.status}
                </span>

            </div>

            <div class="order-items">
                ${itemText}
            </div>

            <br>

            <strong>
                Total: ₹${order.total}
            </strong>

            <br>

            <small>
                Payment: ${order.payment}
            </small>

        `;


        container.appendChild(div);

    });

}


/* ================= LOGIN ================= */

document.getElementById("loginBtn")
    .addEventListener("click", () => {

        loginOverlay.classList.add("show");

    });


document.getElementById("closeLogin")
    .addEventListener("click", () => {

        loginOverlay.classList.remove("show");

    });


document.getElementById("loginForm")
    .addEventListener("submit", function(e) {

        e.preventDefault();


        const email =
            document.getElementById("loginEmail").value;


        localStorage.setItem(
            "foodieUser",
            email
        );


        loginOverlay.classList.remove("show");


        showToast(`Welcome ${email}! 👋`);

    });


/* ================= FAVORITES ================= */

document.querySelectorAll(".favorite")
    .forEach((button, index) => {

        const card =
            button.closest(".food-card");

        const name =
            card.dataset.name;


        if (favorites.includes(name)) {

            button.classList.add("liked");

            button.innerHTML =
                `<i class="fa-solid fa-heart"></i>`;

        }


        button.addEventListener("click", (e) => {

            e.stopPropagation();


            if (favorites.includes(name)) {

                favorites =
                    favorites.filter(
                        item => item !== name
                    );

                button.classList.remove("liked");

                button.innerHTML =
                    `<i class="fa-regular fa-heart"></i>`;

                showToast("Removed from wishlist");

            } else {

                favorites.push(name);

                button.classList.add("liked");

                button.innerHTML =
                    `<i class="fa-solid fa-heart"></i>`;

                showToast("Added to wishlist ❤️");

            }


            localStorage.setItem(
                "foodieFavorites",
                JSON.stringify(favorites)
            );

        });

    });


/* ================= FOOD DETAILS ================= */

document.querySelectorAll(".food-card")
    .forEach(card => {

        card.addEventListener("click", (e) => {

            if (
                e.target.closest(".favorite") ||
                e.target.closest(".add-btn")
            ) {
                return;
            }


            const name =
                card.dataset.name;

            const category =
                card.dataset.category;


            const price =
                card.querySelector(
                    ".food-bottom strong"
                ).textContent;


            const rating =
                card.querySelector(
                    ".rating"
                ).textContent;


            const description =
                card.querySelector(
                    ".food-info p"
                ).textContent;


            const icons = {

                pizza: "🍕",
                burger: "🍔",
                pasta: "🍝",
                indian: "🍛",
                dessert: "🍰",
                drink: "🥤"

            };


            currentDetail = {

                name,
                price:
                    Number(
                        price.replace("₹","")
                    ),

                category

            };


            document.getElementById("detailIcon")
                .textContent =
                icons[category] || "🍽️";


            document.getElementById("detailName")
                .textContent = name;


            document.getElementById("detailRating")
                .textContent = rating;


            document.getElementById("detailDescription")
                .textContent = description;


            document.getElementById("detailPrice")
                .textContent = price;


            foodOverlay.classList.add("show");

        });

    });


document.getElementById("closeFood")
    .addEventListener("click", () => {

        foodOverlay.classList.remove("show");

    });


document.getElementById("detailAdd")
    .addEventListener("click", () => {

        if (!currentDetail) return;


        addToCart(
            currentDetail.name,
            currentDetail.price,
            currentDetail.category
        );


        foodOverlay.classList.remove("show");

    });


/* ================= SEARCH ================= */

document.getElementById("searchInput")
    .addEventListener("input", function() {

        const query =
            this.value.toLowerCase().trim();


        document.querySelectorAll(".food-card")
            .forEach(card => {

                const name =
                    card.dataset.name.toLowerCase();

                const description =
                    card
                        .querySelector(".food-info p")
                        .textContent
                        .toLowerCase();


                if (
                    name.includes(query) ||
                    description.includes(query)
                ) {

                    card.style.display = "";

                } else {

                    card.style.display = "none";

                }

            });

    });


/* ================= CATEGORY FILTER ================= */

document.querySelectorAll(".category")
    .forEach(button => {

        button.addEventListener("click", () => {

            document
                .querySelectorAll(".category")
                .forEach(btn =>
                    btn.classList.remove("active")
                );


            button.classList.add("active");


            const category =
                button.dataset.category;


            document.querySelectorAll(".food-card")
                .forEach(card => {

                    if (
                        category === "all" ||
                        card.dataset.category === category
                    ) {

                        card.style.display = "";

                    } else {

                        card.style.display = "none";

                    }

                });

        });

    });


/* ================= DARK MODE ================= */

const themeBtn =
    document.getElementById("themeBtn");


if (
    localStorage.getItem("foodieDarkMode") === "true"
) {

    document.body.classList.add("dark");

    themeBtn.innerHTML =
        `<i class="fa-solid fa-sun"></i>`;

}


themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark");


    const dark =
        document.body.classList.contains("dark");


    localStorage.setItem(
        "foodieDarkMode",
        dark
    );


    themeBtn.innerHTML = dark
        ? `<i class="fa-solid fa-sun"></i>`
        : `<i class="fa-solid fa-moon"></i>`;

});


/* ================= MOBILE MENU ================= */

document.getElementById("menuBtn")
    .addEventListener("click", () => {

        document
            .getElementById("navMenu")
            .classList.toggle("show");

    });


document.querySelectorAll("#navMenu a")
    .forEach(link => {

        link.addEventListener("click", () => {

            document
                .getElementById("navMenu")
                .classList.remove("show");

        });

    });


/* ================= OFFER SCROLL ================= */

document.getElementById("offerScrollBtn")
    .addEventListener("click", () => {

        document
            .getElementById("offers")
            .scrollIntoView({
                behavior: "smooth"
            });

    });


/* ================= BACK TO TOP ================= */

const topBtn =
    document.getElementById("topBtn");


window.addEventListener("scroll", () => {

    if (window.scrollY > 400) {

        topBtn.classList.add("show");

    } else {

        topBtn.classList.remove("show");

    }

});


topBtn.addEventListener("click", () => {

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

});


/* ================= OVERLAY CLICK ================= */

[
    cartOverlay,
    checkoutOverlay,
    loginOverlay,
    foodOverlay

].forEach(overlay => {

    overlay.addEventListener("click", e => {

        if (e.target === overlay) {

            overlay.classList.remove("show");

        }

    });

});


/* ================= ESCAPE KEY ================= */

document.addEventListener("keydown", e => {

    if (e.key === "Escape") {

        document
            .querySelectorAll(".overlay")
            .forEach(item =>
                item.classList.remove("show")
            );

    }

});


/* ================= INITIAL LOAD ================= */

updateCart();

renderOrders();