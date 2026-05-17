const cart = JSON.parse(localStorage.getItem("cart")) || [];

let total = 0;

for (let i = 0; i < cart.length; i++) {
    total += cart[i].price * cart[i].quantity;
}

const totalElement = document.querySelectorAll(".total-sum-number");

totalElement.forEach(element => {
    element.textContent = `€${total.toFixed(2)}`;
});
