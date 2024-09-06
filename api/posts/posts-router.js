// implement your posts router here
const express = require("express");
const postsModel = require("./posts-model");

const router = express.Router();

router.get("/", (req, res) => {
  postsModel
    .find()
    .then((posts) => res.status(200).json(posts))
    .catch((error) => res.status(500).json({ message: "The posts information could not be retrieved" }));
});

router.get("/:id", async (req, res) => {
  try {
    const post = await postsModel.findById(req.params.id);
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "The post with the specified ID does not exist" });
    }
  } catch (error) {
    res.status(500).json({ message: "The post information could not be retrieved" });
  }
});

router.post("/", async (req, res) => {
  const { title, contents } = req.body;

  if (!title || !contents) {
    return res.status(400).json({ message: "Please provide title and contents for the post" });
  }

  try {
    const { id } = await postsModel.insert({ title, contents });
    const newPost = { id, title, contents };
    return res.status(201).json(newPost);
  } catch (error) {
    return res.status(500).json({ message: "There was an error while saving the post to the database" });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, contents } = req.body;

  if (!title || !contents) {
    return res.status(400).json({ message: "Please provide title and contents for the post" });
  }
  try {
    const post = await postsModel.findById(id);

    if (!post) {
      return res.status(404).json({ message: "The post with the specified ID does not exist" });
    }

    const updatedPostCount = await postsModel.update(id, { title, contents });
    if (updatedPostCount) {
      const updatedPost = await postsModel.findById(id);
      res.status(200).json(updatedPost);
    } else {
      res.status(500).json({ message: "The post information could not be modified" });
    }
  } catch (error) {
    res.status(500).json({ message: "The post information could not be modified" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const post = await postsModel.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "The post with the specified ID does not exist" });
    }
    const deletedPost = await postsModel.remove(req.params.id);
    if (deletedPost) {
      return res.status(200).json(post);
    } else {
      res.status(500).json({ message: "The post could not be removed" });
    }
  } catch (error) {
    res.status(500).json({ message: "The post could not be removed" });
  }
});

router.get("/:id/comments", async (req, res) => {
  try {
    const comments = await postsModel.findPostComments(req.params.id);
    if (comments.length > 0) {
      res.status(200).json(comments);
    } else {
      res.status(404).json({ message: "The post with the specified ID does not exist" });
    }
  } catch (error) {
    res.status(500).json({ message: "The comments information could not be retrieved" });
  }
});

module.exports = router;
