var _ = require('lodash');
var qr = require('qr-image');

// QRコード作成
module.exports = function(req, res, next) {
    var url = _.result(req.query, 'url', null);
    var img = qr.image(url);
    res.writeHead(200, {'Content-Type': 'image/png'});
    img.pipe(res);
};

// EOF
