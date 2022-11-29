import { NextApiRequest, NextApiResponse } from "next";
import path from 'path';
import fs from 'fs';
import { getConfiguration, setSeasonalTagging } from "../../utility/config";

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "POST") {
        const { seasonalTagging } = req.body;
        if ((seasonalTagging !== null) && (seasonalTagging !== undefined)) {
            setSeasonalTagging(seasonalTagging);
            res.status(200).send(getConfiguration());
        } else {
            res.status(500).send("Configuration could not be set");
        }
    } else if (req.method == "GET") {
        res.status(200).send(getConfiguration());
    } else {
        res.status(404).send("NOT FOUND");
    }
}