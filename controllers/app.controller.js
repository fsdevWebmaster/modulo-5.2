import post from "../models/post.js";

export const createPost = (req, res, next) => {
  const { title, text, author } = req.body;
  const newPost = new post({ title, text, author });
  newPost.save()
    .then((result) => {
      return res.status(201).send({ result });
    }).catch(err => next(err));
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
        return res.status(404).json({ error: 'post-not-found' });
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

