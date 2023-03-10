import { Request, Response } from "express";
import Joke from "../models/joke.model";

const gẹtJokeController = async (req: Request, res: Response) => {
  try {
    const joke = await Joke.aggregate([{ $sample: { size: 1 } }]);
    const seenJokes = req.body.seenJokes || [];
    const unseenJokes = await Joke.find({ _id: { $nin: seenJokes } });
    if (unseenJokes.length === 0) {
      res.send({
        message: "That's all the jokes for today! Come back another day!",
      });
    } else {
      const nextJoke =
        unseenJokes[Math.floor(Math.random() * unseenJokes.length)];
      res.send(nextJoke);
    }
  } catch (error: any) {
    res.status(500).send({ message: error.message });
  }
};

const likeJokeController = async (req: Request, res: Response) => {
  try {
    const joke = await Joke.findById(req.params.id);
    if (!joke) {
      res.status(404).send({ message: "Joke not found" });
    } else {
      joke.likes += 1;
      await joke.save();
      res.send(joke);
    }
  } catch (error: any) {
    res.status(500).send({ message: error.message });
  }
};

const dislikeJokeController = async (req: Request, res: Response) => {
  try {
    const joke = await Joke.findById(req.params.id);
    if (!joke) {
      res.status(404).send({ message: "Joke not found" });
    } else {
      joke.dislikes += 1;
      await joke.save();
      res.send(joke);
    }
  } catch (error: any) {
    res.status(500).send({ message: error.message });
  }
};

const createJokeController = async (req: Request, res: Response) => {
  try {
    const joke = new Joke({
      text: req.body.text,
    });
    await joke.save();
    res.send(joke);
  } catch (error) {
    res.status(400).send({ message: "Joke not created" });
  }
};

export {
  gẹtJokeController,
  likeJokeController,
  dislikeJokeController,
  createJokeController,
};
