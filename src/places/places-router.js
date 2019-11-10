const express = require('express')
const path = require('path')
const PlacesService = require('./places-service')
const { requireAuth } = require('../middleware/jwt-auth')

const placesRouter = express.Router()
const jsonBodyParser = express.json()

// Get User's Places
placesRouter
    // .route('/:user_id')
    .route('/')
    .all(requireAuth)
    .get((req, res, next) => {
        PlacesService.getUsersPlaces(
            req.app.get('db'),
            // req.params.user_id
            req.body.user_id
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
        newPlace.user_id = user_id
        // newPlace.user_id = req.params.user_id

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

    placesRouter
        .route('/:place_id')
        .all(requireAuth)
        .all((req, res, next) => {
            PlacesService.getById(
                req.app.get('db'),
                req.params.place_id
            )
                .then(place => {
                    if (!place) {
                        return res.status(404).json({
                            error: { message: `Place doesn't exist` }
                        })
                    }
                    res.place = place
                    next()
                })
                .catch(next)
        })
        //Get Place
        .get((req, res, next) => {
            res.json(PlacesService.serializePlace(res.place))
        })
        .delete((req, res, next) => {
            PlacesService.deletePlace(
                req.app.get('db'),
                req.params.place_id
            )
                .then(() => {
                    res.status(204).end()
                })
                .catch(next)
        })
        //Update Place
        .patch(jsonBodyParser, (req, res, next) => {
            const { place_name, type, hh, hh_start, hh_end, notes, items } = req.body
            const placeToUpdate = { place_name, type, hh, hh_start, hh_end, notes, items }

            const numberOfValues = Object.values(placeToUpdate).filter(Boolean).length
            if (numberOfValues === 0)
                return res.status(400).json({
                    error: { message: `Request body must contain all required fields` }
                })

            PlacesService.updatePlace(
                req.app.get('db'),
                req.params.place_id,
                placeToUpdate
            )
                .then(numRowsAffected => {
                    res.status(204).end()
                })
                .catch(next)
        })


module.exports = placesRouter