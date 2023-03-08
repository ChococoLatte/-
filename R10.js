var express = require('express')
    ,http = require('http')
    ,path = require('path');

var bodyParser = require('body-parser')
    ,cookieParser = require('cookie-parser')
    ,static = require('serve-static')
    ,errorHandler = require('errorhandler');

var expressErrorHandler = require('express-error-handler');
var expressSession = require('express-session');

var user = require('./routes/user');
var config = require('./config');
var database = require('./database/database');
var route_loader = require('./routes/route_loader');

var app = express();
var ejs = require('ejs');

console.log('config.server_port: %d', config.server_port);
app.set('port',config.server_port|| 3000);
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use('/public',static(path.join(__dirname,'public')));
app.use(cookieParser());

app.use(expressSession({
    secret:'my key',
    resave:true,
    saveUninitialized:true
}));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

var router = express.Router();
var route_loader = require('./routes/route_loader');

route_loader.init(app,express.Router());

var errorHandler = expressErrorHandler({
    static:{
        '404':'./public/404.html'
    }
});

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);


http.createServer(app).listen(app.get('port'),function(){
    console.log('서버 시작. 포트: ' + app.get('port'));
    
    database.init(app,config);
});