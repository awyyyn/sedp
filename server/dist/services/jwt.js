import jwt from "jsonwebtoken";
export const generateToken = (uuid) => {
    const secret = process.env.ACCESS_SECRET;
    console.log(secret, "secret");
    return jwt.sign({ uuid }, secret, {
        expiresIn: "2h",
    });
};
export const verifyToken = (token) => {
    try {
        jwt.verify(token, process.env.ACCESS_SECRET);
        return true;
    }
    catch (error) {
        return false;
    }
};
