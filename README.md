# FavorEat API

The FavorEat client makes calls to this API for user authentication, adding new users to the database, retreiving
a user's data, and manipulating said data.

## Endpoints

Note: user_id and Authorization need to be set as Headers for all requests to /places endpoints. The user_id and bearer token are returned from the /auth/login endpoint after successfully logging in. 

### /api/places
 - GET: Returns user's places formatted as JSON
 - POST: Adds a new places

### /api/places/:place_id
- GET: Returns a specific place from a user's places
- DELETE: Removes a place from a user's places
- PATCH: Edits a place

### /api/auth/login
- POST: submits the username & password entered in the Login form

### /api/users
- POST: Registers a new username & password combination if the requirements are met

