var filters = {};

function updateFilters() {
  var compositeFilter = ['all'];
  for (let filterValue in filters) {
    if (filters[filterValue]) {
      compositeFilter.push(['==', ['get', filterValue], 'Y']);
    }
  }
  
  if (compositeFilter.length > 1)
    map.setFilter('rfovProjects', compositeFilter);
  else {
    map.setFilter('rfovProjects', null);
  }
}

var checkbox = document.getElementById('srBox');
checkbox.addEventListener('change', function() {
  filters['SR'] = this.checked;
  updateFilters();
});

var checkbox = document.getElementById('hlBox');
checkbox.addEventListener('change', function() {
  filters['HL'] = this.checked;
  updateFilters();
});

var checkbox = document.getElementById('ovBox');
checkbox.addEventListener('change', function() {
  filters['OV'] = this.checked;
  updateFilters();
});