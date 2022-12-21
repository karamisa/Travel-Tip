export const mapService = {
    initMap,
    addMarker,
    panTo,
    getCurrLoc,
    getSearchLoc
}


// Var that is used throughout this Module (not global)
var gMap
var gCurrLoc

function initMap(lat = 32.0749831, lng = 34.9120554) {
    console.log('InitMap')
    return _connectGoogleApi()
        .then(() => {
            console.log('google available')
            gMap = new google.maps.Map(
                document.querySelector('#map'), {
                center: { lat, lng },
                zoom: 15
            });
            console.log(gMap)
            let infoWindow = new google.maps.InfoWindow({
                content: "Click the map to get Lat/Lng!",
                position: {lat,lng},
              });
            infoWindow.open(gMap);
            gMap.addListener("click", (mapsMouseEvent) => {
                // Close the current InfoWindow.
                infoWindow.close();
                // Create a new InfoWindow.
                infoWindow = new google.maps.InfoWindow({
                  position: mapsMouseEvent.latLng,
                  
                });
                gCurrLoc = {lat: mapsMouseEvent.latLng.lat(), lng: mapsMouseEvent.latLng.lng()}
                infoWindow.setContent(
                  JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2)
                );
                infoWindow.open(gMap);
              });
            console.log('Map!', gMap)
        })
}

function addMarker(loc) {
    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title: 'Hello World!'
    })
    
    return marker
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng)
    gMap.panTo(laLatLng)
}


function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    const API_KEY = 'AIzaSyAgqESB-n9VcKFfTHxx5fmiEh0TGzSazXg' //DONE: Enter your API Key
    var elGoogleApi = document.createElement('script')
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`
    elGoogleApi.async = true
    document.body.append(elGoogleApi)

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}

function getCurrLoc(){
    return gCurrLoc
}

function getSearchLoc(searchStr){
    const API_KEY='AIzaSyAeGYpx-PROL1yGKKj2tMuWRB7xq5NvWHw'
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${searchStr}&key=AIzaSyAeGYpx-PROL1yGKKj2tMuWRB7xq5NvWHw`
    return axios.get(url).then(res=> {
        const data= res.data["results"][0]
        return {
            name: data["formatted_address"],
            lat: data["geometry"]["location"]["lat"],
            lng: data["geometry"]["location"]["lng"]
        }
    })
}
