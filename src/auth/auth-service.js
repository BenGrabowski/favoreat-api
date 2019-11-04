const config = require('../config')

const AuthService = {
    getUserWithUserName(db, user_name) {
        return db('favoreat_users')
            .where({ user_name })
            .first()
    },
}

module.exports = AuthService