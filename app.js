// app configure /////////////
var opts        = require('opts');
opts.parse([
    {
        'short': 'p',
        'long': 'port',
        'description': 'HTTP port',
        'value': true,
        'required': false
    }
]);
var config         = require('config');

// node_modules /////////////
var path           = require('path');
var util           = require('util');
var express        = require('express');
var http           = require('http');
var errorhandler   = require('errorhandler');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var ECT            = require('ect');
var ectRenderer    = ECT({ watch: true, root: __dirname + '/views', ext : '.ect' });

var app = express();

app.use(errorhandler({ dumpExceptions: true, showStack: true }));

// all environments
app.set('port', opts.get('port') || config.get('port'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());

// template
app.set('view engine', 'ect');
app.set('views', './views');
app.engine('ect', ectRenderer.render);

// static
//app.use(favicon(path.join(__dirname, 'public/favicon.ico')));
app.use(express.static(path.join(__dirname, 'public')));

////////////////////////////////////////////////////////////////////////////////
// REGIST routes
require('./routes').api(app);

// START SERVER
var server = http.createServer(app).listen(
    app.get('port'),
    function(err) {
        console.error(err);
    });

// EOF
