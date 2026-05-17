async function DisplayFilteredJackets(category = 'all') {
  let jackets = JSON.parse(sessionStorage.getItem('allJackets'));
  if (!jackets) {
    jackets = await GetJackets();
  }
  
  let filteredJackets = jackets;
  
  if (category === 'onsale') {
    filteredJackets = filteredJackets.filter(jacket => jacket.onSale === true);
  } else if (category === 'favorites') {
    filteredJackets = filteredJackets.filter(jacket => jacket.favorite === true);
  }
  displayJackets(filteredJackets);
  document.getElementById('product-count').textContent = `${filteredJackets.length} Products`;
}



async function DisplayAllJackets() { 
  let jackets = await GetJackets();
  displayJackets(jackets);
  document.getElementById('product-count').textContent = `${jackets.length} Products`;
}

DisplayAllJackets();

document.getElementById('category-filter').addEventListener('change', function() {
  const selectedCategory = this.value;
  
  DisplayFilteredJackets(selectedCategory); 
});

updateCartCount();