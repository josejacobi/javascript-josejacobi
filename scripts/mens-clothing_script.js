async function DisplayMenJackets(category) {
  let jackets = JSON.parse(sessionStorage.getItem('allJackets'));
  if (!jackets) {
    jackets = await GetJackets();
  }
  
  // Filter by gender first
  let filteredJackets = jackets.filter(jacket => jacket.gender === 'Male');
  
  // Then apply category filter
  if (category == 'onsale') {
    filteredJackets = filteredJackets.filter(jacket => jacket.onSale === true);
  } else if (category == 'favorites') {
    filteredJackets = filteredJackets.filter(jacket => jacket.favorite === true);
  } 

  displayJackets(filteredJackets);
  document.getElementById('product-count').textContent = `${filteredJackets.length} Products`;
}

DisplayMenJackets('all');

document.getElementById('category-filter').addEventListener('change', function() {
  let selectedCategory = this.value;
  
  DisplayMenJackets(selectedCategory); 
});

updateCartCount();