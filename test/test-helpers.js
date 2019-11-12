const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const AuthService = require('../src/auth/auth-service')

function makeUsersArray() {
  return [
    {
      id: 1,
      user_name: 'test-user-1',
      full_name: 'Test user 1',
      password: 'password',
      date_created: '2029-01-22T16:28:32.615Z',
    },
    {
      id: 2,
      user_name: 'test-user-2',
      full_name: 'Test user 2',
      password: 'password',
      date_created: '2029-01-22T16:28:32.615Z',
    },
    {
      id: 3,
      user_name: 'test-user-3',
      full_name: 'Test user 3',
      password: 'password',
      date_created: '2029-01-22T16:28:32.615Z',
    },
    {
      id: 4,
      user_name: 'test-user-4',
      full_name: 'Test user 4',
      password: 'password',
      date_created: '2029-01-22T16:28:32.615Z',
    },
  ]
}

function makePlacesArray() {
  return [
    {
      id: 1,
      user_id: 1,
      place_name: 'test1',
      type: 'Restaurant',
      hh: true,
      hh_start: '17:00:00',
      hh_end: '19:00:00',
      notes: 'test notes 1',
      items: ['item1', 'item2', 'item3']
    },
    {
      id: 2,
      user_id: 2,
      place_name: 'test2',
      type: 'Bar',
      hh: true,
      hh_start: '16:30:00',
      hh_end: '18:00:00',
      notes: 'test notes 2',
      items: null
    },
    {
      id: 3,
      user_id: 3,
      place_name: 'test3',
      type: 'Brewery',
      hh: false,
      hh_start: null,
      hh_end: null,
      notes: null,
      items: []
    },
  ]
}

function makeFixtures() {
    const testUsers = makeUsersArray()
    const testPlaces = makePlacesArray()
    return { testUsers, testPlaces }
}

// function makeExpectedPlace(users, place) {
//   const user = users
//     .find(user => user.id === place.user_id)

  
// }

function cleanTables(db) {
    return db.raw(
        `TRUNCATE
            favoreat_users,
            favoreat_places
            RESTART IDENTITY CASCADE`
    )
}

function seedUsers(db, users) {
    const preppedUsers = users.map(user => ({
      ...user,
      password: bcrypt.hashSync(user.password, 1)
    }))
    return db.into('favoreat_users').insert(preppedUsers)
      .then(() =>
        db.raw(
          `SELECT setval('favoreat_users_id_seq', ?)`,
          [users[users.length - 1].id],
        )
      )
  }

  function seedPlaces(db, places, users) {
    return db.transaction(async trx => {
      await seedUsers(trx, users)
      await trx.into('favoreat_places').insert(places)
      await trx.raw(
        `SELECT setval('favoreat_places_id_seq', ?)`,
        [places[places.length -1].id]
      )
    })
  }

  function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
    // const token = jwt.sign({ user_id: user.id }, secret, {
    //   subject: user.user_name,
    //   algorithm: 'HS256',
    // })
    const token = AuthService.createJwt(user.user_name, { user_id: user.id })

    return `Bearer ${token}`
  }

module.exports = {
    makeUsersArray,
    makePlacesArray,
    makeFixtures,
    // makeExpectedPlace,
    seedUsers,
    seedPlaces,
    cleanTables,
    makeAuthHeader,
}