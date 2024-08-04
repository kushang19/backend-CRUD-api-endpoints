import jwt from "jsonwebtoken";
const JWT_SECRET = "kushangisagoodboy$$";

const fetchuser = (req, res, next) => {
  try {
    const token = req.header("auth-token");
    if (!token) {
        res.status(401).json({ error: "Please Authenticate using valid token" });
    }
    const data = jwt.verify(token,JWT_SECRET);
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).json({ error: "Please Authenticate using valid token" });
  }
};

export default fetchuser;
