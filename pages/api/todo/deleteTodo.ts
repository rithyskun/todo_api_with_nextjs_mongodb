import { ObjectId } from 'mongodb';
import clientPromise from "../../../lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const client = await clientPromise;
        const db = client.db("todos");
        const {id} = req.query
        const todo = await db
            .collection("todos")
            .deleteOne({
                '_id': new ObjectId(String(id))
            })

        res.json(todo);
    } catch (err: any) {
        console.error(err);
        throw new Error(err).message;
    }
}