import { auth } from '../utils/auth.js';

const verifyToken = async (req, res, next) => {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) {
      return res.status(401).json({ message: 'Unauthorized access' });
    }
    req.user = session.user;
    next();
  } catch (error) {
    console.error("Session verification error:", error);
    return res.status(401).json({ message: 'Unauthorized access' });
  }
};

export default verifyToken;
