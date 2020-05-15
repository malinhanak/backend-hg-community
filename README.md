# Horse Galore [Backend Project]

As a whole Horse Galore is a project to build a community / RPG platform for what used to be called _members stables_ or
_internet stables_. It used to be a very big internet community in Sweden as well as international but the Swedish
communities has dwiddled and only small crumbles are left even if the members and interest is still around they have no
place to go. So this project aims to create such a place.

This particular repo is only for the backend part of the project, it is based on a REST API.

## Demo(Images, Video links, Live Demo links)

no demos currently....

## Technologies Used

### Major Dependencies

- NodeJS
- Express
- Mongoose
- Sinon
- Mocha
- Chai

### createSlug

Because each horse stored in the database has to have a unique name, and all horses need a slug based on said name it
was decided to write a helper function to create the slug, of the given name, to minimize user error by having them type
the slug as well, this way it is automated.

### asyncWrapper

Because I do think try/catch block makes the code look bloated and messy (even if they are create), I decided to wrapp
all controllers, that are used byt the routes in asyncWrappers, their by escaping the try/catch mess of it all but still
catching potentiall error that couldn't be handled directly. For example a error bubbling up from the DB.

Inspiration for this asyncWrapper was taken from the third party library express-async-handler by Alexei Bazhenov.
However I altered a bit and updated it to better suit me needs.

### Test issues

There where originally a few issues getting started with the test for this project. One of the bigger hazzles was
getting the tests to run with connections to the DB since I decided to not mock it out. After that the there was the
issue of using done or return promise.

## Technical Description

Firstly setting up this project require mongoDB, so you need to connect to a cluster of your own. I won't desribe how to
set up a mongoDB Atlast here, there are documentation for that on mongoDB site.

### Required env's

```bash
MONGO_DB_USER=********
MONGO_DB_PASSWORD=********
MONGO_DB=********
```

### Setup

Having forked, downloaded or cloned this project you need to step up, the .env need to be added with above specified
variables.

- Start by navigationg to backend folder `cd backend`
- Run commande `npm install`
- To start the local server run `npm start`

## Tests

- _See first and second list object in setup_ if this is not already done.
- Run command `npm test`

### API Documentation

When the server is running, current API documentations can be found on `/api/docs`.

The docs a created with OpenAPI, ReDoc.

### MongoDB Connection

All connections to the DB is setup in the `db.js` there is connections string that needs to be changed to your own.
Unless you are working on this project then you can leave the connection as is.

## Future developments

It would be fun to convert this REST API to using GraphQL later, but for competence development reasons it was decided
to start off with a REST API.
