/*
This is the main entry point of the application.
The node server starts from here
*/
let express = require('express')
const config = require('config'),
	bodyParser = require('body-parser'),
	logger = require('morgan')

const app = express()
const db = require('./db/lib/mongoAdapter');

// Middlewares
app.use(bodyParser.json())
app.use(
	bodyParser.urlencoded({
		extended: true
	})
)
app.use(logger('combined'))

// Initialising all routers
require('./routes/healthCheck')(app)
require('./routes/cache')(app)

// Defining the port on which node will listen
const port = process.env.PORT || config.express.port || 3005
const host = process.env.HOST || config.express.host || 'localhost'
express = {host: '', port: port}

// Starting the node server

db.connect(() => {
    app.listen(express, function (){
        console.log(
            'Node server listening on %s:%d within %s environment',
            host,
            port,
            app.set('env'))
    });
});

