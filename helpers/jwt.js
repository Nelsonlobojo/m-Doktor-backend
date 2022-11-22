const expressJwt = require('express-jwt');

function authJwt () {
    const secret = process.env.secret;
    const api = process.env.API_URL;
    return expressJwt({
        secret,
        algorithms: ['HS256'],
        isRevoked: isRevoked
    }).unless({
        path: [
            `${api}/users/login`,
            `${api}/users/register`,
            `${api}/doctors/`,
            `${api}/doctors/register`,
            `${api}/doctors/login`,
            `${api}/appointments/`,
            `${api}/users/`,

        ]
    });
}

async function isRevoked(req, payload, done) {
    done();
}

module.exports = authJwt;