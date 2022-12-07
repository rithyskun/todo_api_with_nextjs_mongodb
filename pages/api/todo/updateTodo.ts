import clientPromise from "../../../lib/mongodb";
import { ObjectId } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const client = await clientPromise;
        const db = client.db("todos");
        const { id } = req.query;
        const { todo, isCompleted } = req.body;

        const todoUpdateOne = await db
            .collection("todos")
            .updateOne(
                {
                    "_id": new ObjectId(String(id))
                },
                {
                    $set: {
                        "todo": todo,
                        "isCompleted": isCompleted
                    }
                }

            );

        res.json(todoUpdateOne);
    } catch (err: any) {
        console.error(err);
        throw new Error(err).message;
    }
};