const RainyDaysUrl = `https://v2.api.noroff.dev/rainy-days`;

const base = "/javascript-josejacobi/"; //If you want to run this project locally, just set the variable base to "/". 

function createJacketCardHtml(jacket) {
  const imageUrl = jacket.image?.url;
  const imageAlt = jacket.image?.alt || jacket.title || 'Jacket Image';
  const price = jacket.price.toFixed(2) ;
  const discounted = jacket.discountedPrice.toFixed(2);
  const favoriteIcon = jacket.favorite ? `<img src="${base}assets/Iconos/favorites_icon.svg" alt="favorite icon" style="display:inline-block; background-color:white; border-radius:50%; padding:4px;" >` : '';
  const sizesDropdown = `
    <select class="size-selector">
        <option value="">Select size</option>
        ${jacket.sizes.map(size => `<option value="${size}">${size}</option>`).join("")}
    </select>
`;

  return `
      <div class="card">
        <div class="jacketimage" onclick="openDetails('${jacket.id}')">
          <img src="${imageUrl}" alt="${imageAlt}" >
        </div>
        <div class="available_colors_favorite" onclick="openDetails('${jacket.id}')">
           ${favoriteIcon}
        </div>
        <div class="description_legend" onclick="openDetails('${jacket.id}')">
          <div>${jacket.title}</div>
        </div>
        <div class="priceandrating" onclick="openDetails('${jacket.id}')">
          <div class="price">
            <span>Price: ${price}</span>
          </div>
        </div>

        ${sizesDropdown}
        <button class="add-to-cart-btn" onclick="addToShoppingCart('${jacket.id}', this.closest('.card').querySelector('.size-selector').value)">Add to Cart</button>

       </div>`;
    }

function displayJackets(jackets) {
  const jacketsContainer = document.getElementById('jackets-container');
      if (jackets==null || jackets.length == 0) {
        jacketsContainer.innerHTML = '<p>No jackets found.</p>';
        return;
    }
  jacketsContainer.innerHTML = jackets.map(createJacketCardHtml).join('');
}


function addToShoppingCart(id, size) {
  if (!size) {
    alert("Please select a size before adding to cart.");
    return;
  }
  addToCart(id, size);
  updateCartCount();

  window.location.href = base + "checkout/index.html";
}

function addToCart(id, size) {
    const jackets = JSON.parse(sessionStorage.getItem('allJackets')) || [];
    const jacket = jackets.find(j => j.id === id);

    if (!jacket) {
        console.error('Jacket not found');
        return;
    }

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existing = cart.find(item => item.id === jacket.id && item.size === size);

    if (existing) {

        existing.quantity = (existing.quantity || 1) + 1;
    } else {

        cart.push({
            ...jacket,
            size: size,
            quantity: 1
        });

    }

    localStorage.setItem("cart", JSON.stringify(cart));
  }

function openDetails(id) {
    localStorage.setItem("selectedJacketId", id);
    window.location.href = base + "product/index.html";
}

function updateCartCount() {

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    let totalQuantity = 0;
    for (let i = 0; i < cart.length; i++) {
        totalQuantity += cart[i].quantity;
    }

    let countSpan = document.querySelector("#cart-count");

    if (totalQuantity === 0) {
        if (countSpan) {
            countSpan.remove();
        }
        return;
    }

    if (!countSpan) {
        countSpan = document.createElement("span");
        countSpan.classList.add("cart-count");
        const headerCart = document.querySelector("body > header > ul > li:nth-child(5) > a > div");
        headerCart.prepend(countSpan);
    }

    countSpan.textContent = totalQuantity;
}

function showLoader() {
    const el = document.getElementById("loader");
    if (el) el.classList.add("show");
}

function hideLoader() {
    const el = document.getElementById("loader");
    if (el) el.classList.remove("show");
}

async function fetchWithLoader(url, options = {}) {
    const MIN_TIME = 600; // delay in milliseconds to ensure loader is visible. This is less than a second to avoid unnecessary waiting, but long enough to show the loader for very fast responses.
    const start = Date.now();
    showLoader();

    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        const data = await response.json();

        const elapsed = Date.now() - start;
        const remaining = MIN_TIME - elapsed;

        if (remaining > 0) {
            await new Promise(resolve => setTimeout(resolve, remaining));
        }

        return data;

    } finally {
        hideLoader();
    }
}

async function GetJackets() {
  try {
    const result = await fetchWithLoader(RainyDaysUrl);

    const jackets = result.data || [];

    sessionStorage.setItem('allJackets', JSON.stringify(jackets));

    return jackets;

  } catch (error) {
    console.error('Error:', error.message);
      const jacketsContainer = document.getElementById('jackets-container');
      jacketsContainer.innerHTML = '<p>Error loading jackets.</p><p>' + error.message + '</p>';
  }
}