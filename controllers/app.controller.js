import bcrypt from 'bcrypt';
import { v4 as uuidV4 } from 'uuid';
import jwt from 'jsonwebtoken';
import post from "../models/post.js";
import user from "../models/user.js";

export const createPost = (req, res, next) => {
  const { title, text, author } = req.body;
  if (title === undefined || text === undefined || author === undefined) {
    next(new Error('CreationDataIncomplete'));
  }
  else {
    const newPost = new post({ title, text, author });
    newPost.save()
      .then((result) => {
        return res.status(201).send({ result });
      }).catch(err => {
        next(err)
      });
  }
} 

export const listPosts = (req, res, next) => {
  post.find()
    .then((result) => {
      res.json(result);
    }).catch(err => next(err));
}

export const postDetail = (req, res, next) => {
  const { id } = req.params;
  post.findById(id)
    .then((result) => {
      if (!result) {
        next(new Error('PostNotFound'));
      }
      else {
        return res.json({ result });
      }
    }).catch(err => next(err));
}

export const updatePost = (req, res, next) => {
  const { id } = req.params;
  if (!req.body) {
    res.status(400).json({ error: 'bad-request'})
  }
  else {
    post.findByIdAndUpdate(id, req.body, { new: true })
      .then((post) => {
        if (!post) {
          res.status(404).json({ error: 'post-not-found' });
        }
        else {
          res.json({ post });
        }
      }).catch(next);
  }
}

export const deletePost = (req, res, next) => {
  const { id } = req.params;
  post.findByIdAndRemove(id)
    .then((result) => {
      if (result) {
        res.status(204).send();
      }
      else {
        res.status(404).json({ error: 'post-not-found' })
      }
    }).catch(next);
}

export const createUser = (req, res, next) => {
  const { name, email, password, bio } = req.body;
  const newUser = new user({ name, email, password, bio });
  const validKey = uuidV4();
  newUser.validKey = validKey;
  newUser.save().then((user) => {
    if (!user) {
      return res.status(401).json({ error: 'user-not-found' })
    }
    else {
      return res.status(201).json({ user });
    }
  }).catch(next);
}

export const activateUser = (req, res, next) => {
  const { key } = req.params;
  user.findOne({ validKey: key })
    .then((found) => {
      if (!found) {
        next(new Error('InvalidKey'));
      }
      else {
        user.findOneAndUpdate({ validKey: key }, { active: true }, { new: true })
          .then((result) => {

            console.log('result::', result);

            return res.status(301).json({ to: 'http://google.com' });
          }).catch((err) => {
            next(new Error('UpdateActive'))
          });
      }
    }).catch((err) => {
      next(new Error('InvalidKey'));
    });
}

export const login = (req, res, next) => {
  const { email, password } = req.body;
  if ( !email || !password ) {
    res.json({ error: 'bad-request' });
  }
  else {
    user.findOne({ email })
     .then((user) => {
      if (!user) {
        return res.status(404).json({ error: 'user-not-found'});
      }
      else {
        if (!user.active) {
          next(new Error('NoActivatedUser'));
        }
        else {
          bcrypt.compare(password, user.password, (err, result) => {
            if (!result) {
              return res.status(401).json({ error: 'unauthorized' })
            }
            else {
              const token = jwt.sign({ sub: user.id }, process.env.API_SECRET);
              return res.json({ token });
            }
          })
        }
      }
     }).catch(err => {
      next(err);
     });
  }
}