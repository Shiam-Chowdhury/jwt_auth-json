const JWT = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    let token = req.header('x-auth-token');

    if(!token){
        return res.status(400).json({
            "errors": [
                {
                    "message": "token not found!"
                }
            ]
        });
    }

    try {
        const user = await JWT.verify(token, "jsabfkjsfsjfksafslkfnsalkfsdf"); 
        req.user = user.email;
        next();
    } catch (error) {
        return res.status(400).json({
            "errors": [
                {
                    "message": "token invalid!"
                }
            ]
        })
    }
}