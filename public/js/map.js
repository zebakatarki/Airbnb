mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
container: 'map', // container ID
style:"mapbox://styles/mapbox/streets-v12",
center: listing.geometry.coordinates, //position [longitude, latitude]
zoom: 9,
});

console.log("Map Token",mapToken);
console.log("Coordinates",listing.geometry.coordinates);

// Create a default Marker and add it to the map.
const marker = new mapboxgl.Marker({ color: 'red'})
.setLngLat(listing.geometry.coordinates) //listing.geometry.coordinates
.setPopup(new mapboxgl.Popup({offset: 25})
.setHTML(`<h5>${listing.title}</h5><p>Exact location will be provided after booking</p>`)
)
.addTo(map);


// //<<<<<<<<<< Code of Added Image As A Market >>>>>>>>>>>>>>
// mapboxgl.accessToken = mapToken;

// const map = new mapboxgl.Map({
// container: 'map', // container ID
// // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
// style: 'mapbox://styles/mapbox/streets-v12', // style URL
// center: listing.geometry.coordinates, // starting position
// zoom: 9, // starting zoom
// });
 
// console.log("Map Token",mapToken);
// console.log("Coordinates",listing.geometry.coordinates);

// map.on('load', () => {
// // Load an image from an external URL.
// map.loadImage(
//     'https://png.pngtree.com/png-clipart/20230915/original/pngtree-home-pin-map-icon-map-pointermarkers-navigation-map-point-vector-png-image_12183379.png',
// (error, image) => {
// if (error) throw error;
 
// // Add the image to the map style.
// map.addImage('cat', image);
 
// // Add a data source containing one point feature.
// map.addSource('point', {
//     'type': 'geojson',
//     'data': {
//     'type': 'FeatureCollection',
//     'features': [
//     {
//     'type': 'Feature',
//     'geometry': {
//     'type': 'Point',
//     'coordinates':listing.geometry.coordinates,
//     }
//     }
// ]
// }
// });
 
// // Add a layer to use the image to represent the data.
// map.addLayer({
// 'id': 'points',
// 'type': 'symbol',
// 'source': 'point', // reference the data source
// 'layout': {
// 'icon-image': 'cat', // reference the image
// 'icon-size': 0.05,
// }
// });

// }
// );
// });



