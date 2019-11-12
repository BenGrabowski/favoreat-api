const xss = require('xss')
const Treeize = require('treeize')

const PlacesService = {
    getUsersPlaces(db, user_id) {
        return db
            .from('favoreat_places AS place')
            .select(
                'place.id',
                'place.user_id',
                'place.place_name',
                'place.type',
                'place.hh',
                'place.hh_start',
                'place.hh_end',
                'place.notes',
                'place.items'
            )
            .where({ user_id })
    },
    getById(db, id) {
        return db
            .from('favoreat_places AS place')
            .select(
                'place.id',
                'place.user_id',
                'place.place_name',
                'place.type',
                'place.hh',
                'place.hh_start',
                'place.hh_end',
                'place.notes',
                'place.items'
            )
            .where('place.id', id)
            .first()
    },
    insertPlace(db, newPlace) {
        return db
            .insert(newPlace)
            .into('favoreat_places')
            .returning('*')
            .then(([place]) => place)
            .then(place =>
                PlacesService.getById(db, place.id)    
            )
    },
    deletePlace(db, id) {
        return db('favoreat_places')
            .where({ id })
            .delete()
    },
    updatePlace(db, id, newPlaceFields) {
        return db('favoreat_places')
            .where({ id })
            .update(newPlaceFields)
    },
    serializePlace(place) {
        const placeTree = new Treeize()
        const placeData = placeTree.grow([ place ]).getData()[0]

        return {
            id: placeData.id,
            user_id: placeData.user_id,
            place_name: xss(placeData.place_name),
            type: xss(placeData.type),
            hh: placeData.hh,
            hh_start: placeData.hh_start,
            hh_end: placeData.hh_end,
            notes: xss(placeData.notes),
            items: (placeData.items) ? placeData.items.map(place => xss(place)) : placeData.items
        }
    },
    serializePlaces(places) {
        return places.map(this.serializePlace)
    },
}

module.exports = PlacesService