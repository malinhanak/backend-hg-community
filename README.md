# Horse Galore Backend Documentation

## Purpose

This is the REST API for the (future) site of Horse Galore, a project for a
community page with horse interest and RPG.

## Development documentation

This project needs connection to a mongoDB atlas instance, using database:
`hg-dv` and `hg_TEST`, with collections `horses` and `users`, in both. For
development and tests.

MongoDB connections via mongoose needs to be altered in `db.js`, if
collaborators for the project need to access the current mongo instances, let me
know and I will arrange access.

To start run `npm start`, to test run `npm test`.

## Dependencies

The app is build with NodeJs, using express. Database is mongoDB, using mongoose
for connection.

## Connections and middlewares

The connection to the db is exported from `db.js` and is used for both `app.js`
and for tests.

In the `app.js`, you'll find all the middlewares, both for errorhandling, and
responsible for calling/handling the routes. This is also where the application
formally connecs to the database and boots up to listen.

## Routes

Current active routers are `horseRouter.js` and `userRouter.js` founder under
`routes`folder.

## Models

Currently two models, `horse.js` and `user.js`. In `models`folder there is also
a `http-error.js` "model" which is a class extending the native Error class.

## Controllers

Currently two controllers `horse.js` and `user.js` both found under the folder
`controllers`.
