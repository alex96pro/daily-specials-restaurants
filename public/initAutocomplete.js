function initMap(){
   
    var input = document.getElementById('search-google-maps');
    const autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.setFields(["geometry","address_components"]);

    autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        localStorage.setItem('POSITION', JSON.stringify({lat: place.geometry.location.lat(), lon: place.geometry.location.lng()}));
        let address = place.address_components[1].long_name + ' '+ place.address_components[0].long_name + ', ' + place.address_components[2].long_name;
        localStorage.setItem('ADDRESS', address);
        if (!place.geometry) {
          return;
        }
    });
}