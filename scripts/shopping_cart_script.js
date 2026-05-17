const cart = JSON.parse(localStorage.getItem("cart")) || [];

function displayCart() {

    const container = document.getElementById("wrapperforcart");

    container.innerHTML = ""; // limpiar contenido previo

    const titleElement = document.createElement("div");

    titleElement.innerHTML = `<div class="title">Your Shopping Cart</div>`;
    
    container.appendChild(titleElement);
  
    let counter = 0;

    cart.sort((a, b) => a.title.localeCompare(b.title));
    
    cart.forEach(item => {
        counter++;
        const card = document.createElement("div");

        if(counter==cart.length){
            card.classList.add("card", "last-card");
        } else { 
            card.classList.add("card");
        }
        const uniqueId = `${item.id}-${item.size}`

        card.innerHTML = `
            <img class="cart-item-image-${uniqueId}" src="${item.image.url}" alt="${item.image.alt}">
            
            <div class="info">
                <span class="price_style">€${item.price}</span>
                <span class="info_style">${item.title}</span>
                <span class="info_style">${item.description || ""}</span>
                <span class="info_style">Color: ${item.baseColor }</span>
                <span class="info_style">Size: ${item.size}</span>

                <span class="info_style quantity-control">
                    <img src="../assets/Iconos/minus_icon.svg" alt="minus icon" class="minus-btn" id="minus-btn-${uniqueId}">
                    ${item.quantity || 1}
                    <img src="../assets/Iconos/plus_icon.svg" alt="plus icon" class="plus-btn" id="plus-btn-${uniqueId}">
                </span>
            </div>

            <img src="../assets/Iconos/close_icon.svg" alt="close icon" class="remove-btn" id="remove-btn-${uniqueId}">
        `;

        container.appendChild(card);

        // Event for the "+" button
        const plusBtn = document.getElementById(`plus-btn-${uniqueId}`);
        if (plusBtn) {
            plusBtn.addEventListener("click", () => {
                item.quantity++;
                localStorage.setItem("cart", JSON.stringify(cart));
                updateCartCount();
                displayCart();
            });
        }

        // Event for the "-" button
        const minusBtn = document.getElementById(`minus-btn-${uniqueId}`);
        if (minusBtn) {
            minusBtn.addEventListener("click", () => {
                item.quantity--;

                if (item.quantity <= 0) {
                    const index = cart.indexOf(item);
                    cart.splice(index, 1);
                }

                localStorage.setItem("cart", JSON.stringify(cart));
                updateCartCount();
                displayCart();
            });
        }

        const removeBtn = document.getElementById(`remove-btn-${uniqueId}`);

        if (removeBtn) {
            removeBtn.addEventListener("click", () => {

                const index = cart.indexOf(item);
                if (index !== -1) {
                    cart.splice(index, 1);
                }

                localStorage.setItem("cart", JSON.stringify(cart));
                updateCartCount();
                displayCart();
            });
        }

        const image = document.querySelector(`.cart-item-image-${uniqueId}`); 
        if (image) {
            image.style.cursor = "pointer";
            image.addEventListener("click", () => {
                openDetails(item.id);   
            });
        }
    });

    const html = `
            <div class="discountcode">
            <div>Discount Code</div>
            <div>Discount Code</div>
            <div>Use</div>
            </div>
            <div class="checkout">
            <div class="total-sum-number">Total sum:399,98 €</div>
            <a id="proceed-checkout" href="../checkout/payment/index.html">
                <div>Proceed to checkout</div>
            </a>
            </div>`;

    container.insertAdjacentHTML("beforeend", html);

    const checkoutLink = document.getElementById("proceed-checkout");

    if (cart.length === 0) {
        checkoutLink.style.pointerEvents = "none";
        checkoutLink.style.opacity = "0.5";
    } else {
        checkoutLink.style.pointerEvents = "auto";
        checkoutLink.style.opacity = "1";
    }

    let total = 0;

    for (let i = 0; i < cart.length; i++) {
        total += cart[i].price * cart[i].quantity;
    }

    const totalElement = document.querySelector(".total-sum-number");
    totalElement.textContent = `${total.toFixed(2)} €`;
 
}

updateCartCount();
displayCart();