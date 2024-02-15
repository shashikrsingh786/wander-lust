console.log(mapboxToken);

console.log(listing);
console.log(typeof listing);


mapboxgl.accessToken = mapboxToken;


const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/streets-v12",
  center: listing.geometry.coordinates, // starting position [lng, lat]
  zoom: 5, // starting zoom
});

// map.on("load", () => {
//   // Load an image from an external URL.
//   map.loadImage(
//     "https://raw.githubusercontent.com/iampomelo/doraemon/master/description/doraemon.png",
//     (error, image) => {
//       if (error) throw error;

//       // Add the image to the map style.
//       map.addImage("cat", image);

//       // Add a data source containing one point feature.
//       map.addSource("point", {
//         type: "geojson",
//         data: {
//           type: "FeatureCollection",
//           features: [
//             {
//               type: "Feature",
//               geometry: {
//                 type: "Point",
//                 coordinates: listing.geometry.coordinates,
//               },
//             },
//           ],
//         },
//       });

//       // Add a layer to use the image to represent the data.
//       map.addLayer({
//         id: "points",
//         type: "symbol",
//         source: "point", // reference the data source
//         layout: {
//           "icon-image": "cat", // reference the image
//           "icon-size": 0.10,
//         },
//       });
//     }
//   );
// });

const marker = new mapboxgl.Marker({ color: "red" })
  .setLngLat(listing.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<h3>${listing.location}, <b>${listing.country}</b></h3>
      `
    )
  )
  .addTo(map);
