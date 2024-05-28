// const jwt = require('jsonwebtoken');

// const authMiddleware = (req, res, next) => {
//     // check if auth header is present
//     const authHeader = req.headers.authorization;
//     if (!authHeader) {
//         return res.json({
//             success: false,
//             message: "Authorization header missing!"
//         });
//     }

//     // split auth header and get token
//     // Format : 'Bearer ghfdrgthyuhgvfghjkiujhghjuhjg'
//     const token = authHeader.split(' ')[1];
//     if (!token) {
//         return res.json({
//             success: false,
//             message: "Token missing!"
//         });
//     }

//     // verify token
//     try {
//         const decodedData = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = decodedData;
//         next();

//     } catch (error) {
//         res.json({
//             success: false,
//             message: "Invalid token!"
//         });
//     }
// };

// module.exports = authMiddleware;

const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    // check if auth header is present
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.json({
            success: false,
            message: "Authorization header missing!"
        })
    }

    // split auth header and get token
    // Format : 'Bearer ghfdrgthyuhgvfghjkiujhghjuhjg'
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.json({
            success: false,
            message: "Token missing!"
        })
    }

    // verify token
    try {
        const decodedData = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decodedData;
        next();

        console.log("Check role ", req.user)

    } catch (error) {
        res.json({
            success: false,
            message: "Invalid token!"
        })
    }
};


module.exports =  authMiddleware
