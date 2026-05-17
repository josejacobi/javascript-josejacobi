async function DisplayWomenJackets(category) {
  let jackets = JSON.parse(sessionStorage.getItem('allJackets'));
  if (!jackets) {
    jackets = await GetJackets();
  }
  
  // Filter by gender first
  let filteredJackets = jackets.filter(jacket => jacket.gender === 'Female');
  
  // Then apply category filter
  if (category == 'onsale') {
    filteredJackets = filteredJackets.filter(jacket => jacket.onSale === true);
  } else if (category == 'favorites') {
    filteredJackets = filteredJackets.filter(jacket => jacket.favorite === true);
  } 

  displayJackets(filteredJackets);
  document.getElementById('product-count').textContent = `${filteredJackets.length} Products`;
}

DisplayWomenJackets('all');

document.getElementById('category-filter').addEventListener('change', function() {
  let selectedCategory = this.value;
  
  DisplayWomenJackets(selectedCategory); 
});

updateCartCount();