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
        
        it(`responds with 200 and all of the User's things`, () => {
            expectedPlace = testPlaces.filter(place => place.user_id == 1)
            
            return supertest(app)
                .get('/api/places/1')
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .expect(200, expectedPlace)
        })
    })
})