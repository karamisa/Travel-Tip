
import { utilService } from './util.service.js'
import { storageService } from './async-storage.service.js'

const LOC_KEY = 'locDB'
_createLocs()

export const locService = {
    getLocs,
    get,
    remove,
    save,
    getEmptyLoc,
}



function getLocs() {
    return storageService.query(LOC_KEY)
    
}


function get(locId) {
    return storageService.get(LOC_KEY, locId)
}

function remove(locId) {
    return storageService.remove(LOC_KEY, locId)
}

function save(loc){
    console.log('here',loc)
    if (loc.id) {
        console.log('here')
        return storageService.put(LOC_KEY, loc)
    } else {
        return storageService.post(LOC_KEY, loc)
    }
}

function getEmptyLoc(name = ''){
    return {id:'', name, lat:'', lng:''}
}


//LOCAL 
function _createLocs(){
    let locs = utilService.load(LOC_KEY)
    console.log(locs)
    if (!locs || !locs.length){
        _createDemoLocs()
    }
   
}

function _createDemoLocs(){
    console.log('here')
    const locs = [
        { id: '1234', name: 'Greatplace', lat: 32.047104, lng: 34.832384 }, 
        { id: '4563', name: 'Neveragain', lat: 32.047201, lng: 34.832581 }
    ]
    utilService.save(LOC_KEY, locs)
}


function createLoc(name, lat, lng){
    const loc = getEmptyLoc()
        loc.id= utilService.makeId(),
        loc.name = name
        loc.lat=lat
        loc.lng=lng
        loc.createdAt=Date.now()
        loc.updatedAt=Date.now()
}