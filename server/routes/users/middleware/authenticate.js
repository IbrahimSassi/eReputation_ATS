/**
 * Created by MrFirases on 4/11/2017.
 */
var jwt = require('jsonwebtoken')

module.exports.authenticate = function (req, res, next) {
    var headerExists = req.headers.authorization;
    if (headerExists) {
        var token = req.headers.authorization.split(' ')[1];

        jwt.verify(token, 'MY_SECRET', function (err, decoded) {

            if (err) {
                console.log(err)
                res.status(401).json('Unauthorized')
            }
            else {
                req.user = decoded.email;
                console.log('Decoded user: ',decoded.email);
                next();
            }
        });
    }
    else {
        res.status(403).json('No token provided')
    }


};
