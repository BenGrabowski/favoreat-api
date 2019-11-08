const express = require('express')
const path = require('path')
const PlacesService = require('./places-service')
const { requireAuth } = require('../middleware/jwt-auth')

const placesRouter = express.Router()
const jsonBodyParser = express.json()

// Get User's Places
placesRouter
    .route('/:user_id')
    // .route('/')
    .all(requireAuth)
    .get((req, res, next) => {
        PlacesService.getUsersPlaces(
            req.app.get('db'),
            req.params.user_id
            // req.body.user_id
        )
        .then(places => {
            res.json(PlacesService.serializePlaces(places))
        })
        .catch(next)
    })
    //Add New Place
    .post(jsonBodyParser, (req, res, next) => {
        const { id, user_id, place_name, type, hh, hh_start, hh_end, notes, items } = req.body
        const newPlace = {id, place_name, type, hh}

        for (const [key, value] of Object.entries(newPlace))
            if (value == null)
                return res.status(400).json({
                    error: `Missing '${key}' in request body`
                })
        
        newPlace.hh_start = hh_start
        newPlace.hh_end = hh_end
        newPlace.notes = notes
        newPlace.items = items
        // newPlace.user_id = user_id
        newPlace.user_id = req.params.user_id

        PlacesService.insertPlace(
            req.app.get('db'),
            newPlace
        )
        .then(place => {
            res
                .status(201)
                .location(path.posix.join(req.originalUrl, `/${place.id}`))
                .json(PlacesService.serializePlace(place))
        })
        .catch(next)
    })

module.exports = placesRouter