const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Places Endpoints', () => {
    let db

    const {
        testPlaces,
        testUsers,
    } = helpers.makeFixtures()

    before('make knex instance', () => {
        db = knex({
        client: 'pg',
        connection: process.env.TEST_DB_URL,
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('cleanup', () => helpers.cleanTables(db))

    afterEach('cleanup', () => helpers.cleanTables(db))

    describe('GET /api/places', () => {
        beforeEach('insert places', () =>
            helpers.seedPlaces(
                db,
                testPlaces,
                testUsers
            )
        )
        
        it(`responds with 200 and all of the User's places`, () => {
            expectedPlace = testPlaces.filter(place => place.user_id == 1)
            
            return supertest(app)
                .get('/api/places')
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .send({user_id: testUsers[0].id})
                .expect(200, expectedPlace)
        })
    })

    describe('POST /api/places', () => {
        beforeEach('insert users', () => 
            helpers.seedUsers(
                db,
                testUsers
            )
        )

        it('returns 201 and new place', () => {
            newPlace = testPlaces[0]

            return supertest(app)
                .post('/api/places')
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .send(newPlace)
                .send({user_id: testUsers[0].id})
                .expect(201)
                .expect(res => {
                    expect(res.body).to.have.property('id')
                    expect(res.body.user_id).to.eql(newPlace.user_id)                    
                    expect(res.body.place_name).to.eql(newPlace.place_name)
                    expect(res.body.type).to.eql(newPlace.type)
                    expect(res.body.hh).to.eql(newPlace.hh)
                    expect(res.body.hh_start).to.eql(newPlace.hh_start)
                    expect(res.body.hh_end).to.eql(newPlace.hh_end)
                    expect(res.body.notes).to.eql(newPlace.notes)
                    expect(res.body.items).to.eql(newPlace.items)
                })
                .expect(res => 
                  db
                    .from('favoreat_places')
                    .select('*')
                    .where({ id: res.body.id })
                    .first()
                    .then(row => {
                        expect(row.place_name).to.eql(newPlace.place_name)
                        expect(row.type).to.eql(newPlace.type)
                        expect(row.hh).to.eql(newPlace.hh)
                        expect(row.hh_start).to.eql(newPlace.hh_start)
                        expect(row.hh_end).to.eql(newPlace.hh_end)
                        expect(row.notes).to.eql(newPlace.notes)
                        expect(row.items).to.eql(newPlace.items)
                    })
                )
        })
    })

    describe('DELETE /api/places/:place_ id', () => {
        beforeEach('insert users', () => {
            helpers.seedUsers(
                db,
                testUsers
            )
        })
        
        beforeEach('insert places', () => {
            helpers.seedPlaces(
                db,
                testPlaces,
                testUsers
            )
        })

        it('deletes the place and returns 204', () => {
            const idToDelete = 2
            const userId = 2
            const expectedPlaces = testPlaces.filter(place => place.id !== idToDelete)
            console.log(testPlaces[idToDelete])
            return supertest(app)
                .delete(`/api/places/${idToDelete}`)
                .set('Authorization', helpers.makeAuthHeader(testUsers[1]))
                .expect(204)
                .then(res => 
                    supertest(app)
                        .get(`/api/places/${userId}`)
                        .set('Authorization', helpers.makeAuthHeader(testUsers[1]))
                        .expect(expectedPlaces)
                )
        })
    })

    describe('PATCH /api/places/:place_id', () => {
        beforeEach('insert users', () => {
            helpers.seedUsers(
                db,
                testUsers
            )
        })
        
        beforeEach('insert places', () => {
            helpers.seedPlaces(
                db,
                testPlaces,
                testUsers
            )
        })

        it('responds 204 and updates the place', () => {
            const idToUpdate = 2
            const userId = 2
            const updatePlace = {
                place_name: 'updated place name',
                type: 'Bar'
            }
            const expectedPlace = {
                ...testPlaces[idToUpdate - 1],
                updatePlace
            }
            return supertest(app)
                .patch(`/api/places/${idToUpdate}`)
                .set('Authorization', helpers.makeAuthHeader(testUsers[1]))
                .send(updatePlace)
                .expect(204)
                .then(res => 
                    supertest(app)
                    .get(`/api/places/${idToUpdate}`)
                    .set('Authorization', helpers.makeAuthHeader(testUsers[1]))
                    .expect(expectedPlace)
                )
        })
    })
})