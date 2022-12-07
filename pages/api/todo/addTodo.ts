import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from '../../../lib/mongodb'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const client = await clientPromise;
    const db = client.db("todos");
    const { todo, isCompleted } = req.body;
    let now = new Date()
    now.toISOString().substring(0, 10)

    const isExist = await db
      .collection("todos")
      .findOne({
        'todo': todo
      })
    if (isExist) {
      return res.status(409).json('The task exist!')
    }

    const todos = await db.collection("todos").insertOne({
      todo,
      isCompleted,
      createdAt: now
    });

    res.json(todos);
  } catch (err: any) {
    console.error(err);
    throw new Error(err).message;
  }
};