function initMap(){
    const map = new google.maps.Map(document.getElementById('map-container'),{
        zoom:12,
        center:{
            lat: 44.7866,
            lng: 20.4489
        }
    });
    let marker = new google.maps.Marker({
        position:{
            lat: 44.7866,
            lng: 20.4489
        },
        map: map
    });
    var input = document.getElementById('search-google-maps');
    const autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo("bounds", map);
    autocomplete.setFields(["geometry","address_components"]);

    autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        localStorage.setItem('POSITION', JSON.stringify({lat: place.geometry.location.lat(), lon: place.geometry.location.lng()}));
        let address = place.address_components[1].long_name + ' '+ place.address_components[0].long_name + ', ' + place.address_components[2].long_name;
        localStorage.setItem('ADDRESS', address);
        if (!place.geometry) {
          return;
        }
        if (place.geometry.viewport) {
          map.fitBounds(place.geometry.viewport);
        } else {
          map.setCenter(place.geometry.location);
          map.setZoom(17);
        }
        marker.setPosition(new google.maps.LatLng(place.geometry.location.lat(), place.geometry.location.lng())); 
      });
}