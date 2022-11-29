import type { NextApiRequest, NextApiResponse } from "next";
import path from 'path';
import fs from 'fs';
import { MissingRouteResponse, PhotoStore } from "../../../commons/types";

const dataDirectory = path.join(process.cwd(), 'data');
const photosName = "photos.json";

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { id } = req.query;
    const fullPath = path.join(dataDirectory, photosName);
    const photosContent = fs.readFileSync(fullPath, "utf-8");
    const photos: PhotoStore[] = JSON.parse(photosContent);
    // find image by id
    let photo = photos.find(pho => pho.id === id);
    if (id === "random-image") {
            const choice = Math.floor(Math.random() * photos.length);
            photo = photos[choice];
    }
    if (photo?.date !== null && photo?.date !== undefined)
    console.log(new Date(parseInt(photo?.date)).toLocaleString(), photo.id);
    if (photo) {
        const cleanString = photo.photoBase64
                                    .replace("data:image/jpeg;base64,", "")
                                    .replace("data:application/octet-stream;base64,", "")
                                    .replace("data:image/png;base64,", "")
                                    .replace("data:image/jpg;base64,", "");
        const resu = Uint8Array.from(atob(cleanString), c => c.charCodeAt(0));
        res.setHeader('Content-Type', 'image/jpeg');
        res.setHeader('Content-Length', resu.length);
        res.status(200).end(resu);
    } else {
        const missingRouteResponse: MissingRouteResponse = {
            message: "Image not found"
        };
        res.status(404).send(missingRouteResponse);
    }
}