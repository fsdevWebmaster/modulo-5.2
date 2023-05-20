import jwt from 'jsonwebtoken';
import user from '../models/user.js';

export const postsAuth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    res.status(400).json({ error: 'token-missing' });
  }
  else {
    const token = authorization.split('Bearer ')[1];
    const { sub } = jwt.verify(token, process.env.API_SECRET);
    user.findById(sub)
      .then((user) => {
        if (!user) {
          return res.status(404).json({ error: 'user-not-found' });
        }
        else {
          req.user = user;
          next();
        }
      })
      .catch(err => {

        console.log('Should go to error handling(?):', err);

      });
  }
}