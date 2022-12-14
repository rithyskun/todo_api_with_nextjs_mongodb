import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from '../../../lib/mongodb'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const client = await clientPromise;
    const db = client.db("todos");
    const todos = await db
      .collection("todos")
      .find({}).sort({ isCompleted: 1, createdAt: -1 })
      .limit(50)
      .toArray()
    res.json(todos);
  } catch (err: any) {
    console.error(err);
    throw new Error(err).message;
  }
};