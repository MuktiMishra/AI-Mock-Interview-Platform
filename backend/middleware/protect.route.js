import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  try {
    let token = null;

    console.log("came here", req.cookies?.token); 

    if (req.cookies?.token) {
      token = req.cookies.token;
    } else if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: decoded.id,
      role: decoded.role || "user",
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};