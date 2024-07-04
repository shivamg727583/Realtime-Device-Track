const socket = io();

// Initialize the map and assign it to a variable
const map = L.map("map").setView([0, 0], 2);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "OpenStreetMap",
}).addTo(map);

if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
    //   console.log(`Sending location: ${latitude}, ${longitude}`); // Debugging
      socket.emit("send-location", { latitude, longitude });

      // Optionally update the map view with the user's current position
      map.setView([latitude, longitude], 10);
    },
    (error) => {
      console.log(error);
    },
    { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
  );
} else {
  console.log("No geolocation accessibility");
}

// Store markers in an object
const markers = {};

socket.on("receive-location", (data) => {
  const { latitude, longitude, id } = data;
//   console.log(`Received location: ${latitude}, ${longitude} for ID: ${id}`); // Debugging

  // Check if the marker already exists
  if (!markers[id]) {
    // Create a new marker if it doesn't exist
    markers[id] = L.marker([latitude, longitude]).addTo(map);
    // console.log(`Marker created for ID: ${id}`); // Debugging
  } else {
    // Update the existing marker's position
    markers[id].setLatLng([latitude, longitude]);
    // console.log(`Marker updated for ID: ${id}`); // Debugging
  }

  // Optionally update the map view to center on the received location
  map.setView([latitude, longitude], 16);
});


socket.on("user-disconnected",(id)=>{
    // console.log(`User disconnected with ID: ${id}`); // Debugging
    if(markers[id]){
        map.removeLayer(markers[id]);
        delete markers[id];
        // Remove the marker from the map

    }

})