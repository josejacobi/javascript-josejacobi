const id = localStorage.getItem('selectedJacketId');
localStorage.removeItem('selectedJacketId'); 

let selectedSize = null;

async function GetJacketsByID(jacketId) {
    try {

        const RainyDaysByIDUrl = `https://v2.api.noroff.dev/rainy-days/${jacketId}`;

        const result = await fetchWithLoader(RainyDaysByIDUrl);

        const jacket = result.data;

        const detailsContainer = document.getElementById('details-container');

        if (!jacket || Object.keys(jacket).length === 0) {
            detailsContainer.innerHTML = '<p>No jacket details found.</p>';
            return;
        }

        detailsContainer.innerHTML = createDetailsCardHtml(jacket);

        const addButton = document.getElementById('add-to-cart');

        addButton.addEventListener("click", () => {
            if (!selectedSize) {
                alert("Please select a size before adding to cart.");
                return;
            }

            addToShoppingCart(jacket.id,selectedSize);
        });

        updateHeader(jacket);

    } catch (error) {
        console.error('Error:', error.message);
        const detailsContainer = document.getElementById('details-container');
        detailsContainer.innerHTML = '<p>Error loading jacket details.</p><p>' + error.message + '</p>';
    }
}

function createDetailsCardHtml(jacket) {
  const imageUrl = jacket.image?.url ;
  const imageAlt = jacket.image?.alt || jacket.title || 'Jacket Image';
  const Price =  jacket.price;
  const discountedPrice =  jacket.discountedPrice;
  const color = jacket.baseColor;
  const description = jacket.description;
  const favoriteIcon = jacket.favorite ? `<img src="${base}assets/Iconos/icons_heart.svg" alt="heart icon for favorites" style="background-color:#c7370f; border-radius:50%; padding:4px; display:inline-block;" >` : '';  
  const gender = jacket.gender == 'Female'  ? 'Women' : 'Men';
  const sizes = Array.isArray(jacket.sizes) ? jacket.sizes : [];
  const sizesHtml = sizes
    .map(size => `<div class="transparent_circular_box size-option"><b>${size}</b></div>`)
    .join('');

  return `
        <div class="details-image-wrapper">
          <img
            src="${imageUrl}"
            alt="${imageAlt}"
          >
          <span class="favorite-overlay">
            ${favoriteIcon}
          </span>
        </div>
 
        <div>
          <span>${jacket.title}</span>

          <span>Price: €${Price.toFixed(2)}</span>

          <span>Discounted Price: €${discountedPrice.toFixed(2)}</span>

          <span>Description: ${description}</span>

          <span>Color: ${color}</span>
  
          <span>Gender: ${gender}</span>
  
          <div>${sizesHtml}</div>

          <span>
            <input id="add-to-cart" type="button" value="Add To Shopping Cart" >
          </span>

          <ul>
            <li>Free shipping on all orders over 200 €</li>
            <li>Smooth returns</li>
            <li>Delivery within 2-5 business days</li>
            <li>Return fee 4,95 €</li>
            <li>Join our Customer Club and get 15 % discount</li>
          </ul>
        </div>
  `;
}

function updateHeader(jacket){
  let element = document.getElementById("title");
  if (element) {
    element.textContent = jacket.title;
  }
  element = document.getElementById("gender");
  if (element) {
    element.textContent =jacket.gender;
  }
}

if (!id) {  
  document.querySelector("#details-container").innerHTML = "<p>Invalid jacket ID.</p>";
}else {
  GetJacketsByID(id);
}

updateCartCount();

document.addEventListener("click", function (event) {
    const sizeDiv = event.target.closest(".size-option");
    if (!sizeDiv) return;

    document.querySelectorAll(".size-option").forEach(div => {
        div.classList.remove("selected");
    });

    sizeDiv.classList.add("selected");

    selectedSize = sizeDiv.innerText.trim();
});