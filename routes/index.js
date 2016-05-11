var api = function(app) {
    app.get('/sites',        require('./sites'));
    app.get('/sites/qrcode', require('./sites/qrcode'));
    
    app.get('*', function(req, res, next){
        next(new Error("unknown"));
    });
};

module.exports = {
    api: api,
};

// EOF
