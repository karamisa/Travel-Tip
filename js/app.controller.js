import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos
window.onRemoveLoc = onRemoveLoc
window.onGetSearch = onGetSearch
window.onGetLocUrl = onGetLocUrl


function onInit() {
    const loc = checkForLocParam() || {lat: 32.0749831, lng: 34.9120554}
    mapService.initMap(loc.lat,loc.lng)
        .then(() => {
            
            console.log('Map is ready')
        })
        .catch(() => console.log('Error: cannot init map'))
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log('Getting Pos')
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function onAddMarker() {
    const markerLoc= mapService.getCurrLoc()
    console.log(markerLoc)
    mapService.addMarker(markerLoc)
    const newLoc = locService.getEmptyLoc()
    newLoc.name = prompt("What is the Location Name")
    newLoc.lat= markerLoc.lat
    newLoc.lng= markerLoc.lng
    onAddLoc(newLoc)
}


function onGetLocs() {
    locService.getLocs()
        .then(locs => {
            console.log('Locations:', locs)
            renderLocs(locs)
        })
}

function onGetUserPos() {
    getPosition()
        .then(pos => {
            console.log('User position is:', pos.coords)
            document.querySelector('.user-pos').innerText =
                `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
                mapService.panTo(pos.coords.latitude,pos.coords.longitude)
        })
        .catch(err => {
            console.log('err!!!', err)
        })
}

function onPanTo(locId={lng:35.6895, lat:139.6917}) {
    console.log(locId)
    console.log('Panning the Map')
    locService.get(locId).then(loc => {
        console.log(loc)
        mapService.panTo(loc.lat,loc.lng)
    })
}

function onRemoveLoc(locId){
    locService.remove(locId).then(onGetLocs)
}

function onAddLoc(newLoc){
    locService.save(newLoc).then(onGetLocs)
    mapService.panTo(newLoc.lat,newLoc.lng)
}


function renderLocs(locs){
    const strHTMLs = locs.map(loc =>            
     `<div class="location">
        <h3 class="loc-name">${loc.name}</h3>
            <p class="loc-lng">Lng: ${loc.lng}</p>
            <p class="loc-lat">Lat: ${loc.lat}</p>
            <button onclick="onPanTo('${loc.id}')">Go</button>
            <button onclick="onRemoveLoc('${loc.id}')">Delete</button>
        </div>`).join('')
    document.querySelector('.locs-table').innerHTML=strHTMLs
    }

function onGetSearch(e){
    e.preventDefault()
    const searchStr = document.querySelector('form input').value
    mapService.getSearchLoc(searchStr).then(onAddLoc)
}


function checkForLocParam(){
    var urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('lat') && urlParams.has('lng')) {
        const loc={}
        loc.lat = +urlParams.get('lat');
        loc.lng = +urlParams.get('lng');
        return loc
    }
  
}

function onGetLocUrl(){
    const loc= mapService.getCurrLoc()
    console.log(loc)
    const url = `https://karamisa.github.io/Travel-Tip/index.html?lat=${loc.lat}&lng=${loc.lng}`
    navigator.clipboard.writeText(url)
}
