const cart = JSON.parse(localStorage.getItem("cart")) || [];

function displayConfirmation() {

    const container = document.getElementById("confirmation_wrapper");

    container.innerHTML = "";

    const titleElement = document.createElement("div");

    titleElement.classList.add("title");

    titleElement.textContent = `Order: OR-1749294117-48913`;
    
    container.appendChild(titleElement);
  
    let counter = 0;
    let total = 0;

    cart.forEach(item => {

        const card = document.createElement("div");

        card.classList.add("card");

        const quantity = item.quantity || 1;
        const subtotal = item.price * quantity;
        total += subtotal;

        card.innerHTML = `
            <img src="${item.image.url}" alt="${item.image.alt}">

            <div class="info">
                <span class="price_style">Price per item: €${item.price.toFixed(2)}</span>
                <span class="price_style">Quantity: ${item.quantity}</span>
                <span class="info_style">Jacket Model: ${item.title}</span>
                <span class="info_style">Description: ${item.description}</span>
                <span class="info_style">Color: ${item.baseColor}</span>
                <span class="info_style">Size: ${item.size}</span>
            </div>

            <div class="info subtotal-column">
                <span class="price_style">€${(item.quantity * item.price).toFixed(2)}</span>
            </div>

        `;
        container.appendChild(card);
    });


    const totalBlock = document.createElement("div");
    totalBlock.classList.add("card","last-card");
    totalBlock.innerHTML = `

            <div></div>   
            <div class="info">
                <span class="info_style"></span>
            </div>
            <div class="info subtotal-column">
                <span class="price_style"><strong>Total: €${total.toFixed(2)}</strong></span>
            </div>

    `;
    container.appendChild(totalBlock);

    const html = `
              <div class="to-pay-CTA">
                <span>Download Invoice</span>
                <img src="../../assets/Iconos/download_icon.svg" alt="download icon">
              </div>`;

    container.insertAdjacentHTML("beforeend", html);
 
}

displayConfirmation();

localStorage.clear();