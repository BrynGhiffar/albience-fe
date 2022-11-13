import type { NextApiRequest, NextApiResponse } from "next";
import path from 'path';
import fs from 'fs';
import { PhotoStore, GetPhotoResponse, MissingRouteResponse, PostPhotoResponse } from "../../commons/types";
import { addPhoto, batchDelete, deletePhoto, getAllPhoto } from "../../utility/photo";

const dataDirectory = path.join(process.cwd(), 'data');
const photosName = "photos.json";


export const config = {
    api: {
        bodyParser: {
            sizeLimit: '4mb' // Set desired value here
        }
    }
}


export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetPhotoResponse | MissingRouteResponse | PostPhotoResponse>
) {
    if (req.method === 'GET') {
        // going to return appropriate images depending on configuration
        const photos: PhotoStore[] = getAllPhoto();
        const photoResponse: GetPhotoResponse = {
            photos
        };
        res.status(200).json(photoResponse);
    } else if (req.method === 'POST') {
        const newPhoto: PhotoStore = req.body;
        addPhoto(newPhoto);

        const postPhotoResponse = { message: "successfully added"};
        res.status(200).json(postPhotoResponse);
    } else if (req.method === "DELETE") {
        const { ids }: { ids: string[] } = req.body;
        batchDelete(ids);
        const deletePhotoResponse = { message: "successfully deleted" };
        res.status(200).json(deletePhotoResponse);
    }
    else {
        const missingRouteResponse: MissingRouteResponse = 
        {
            message: "Route not found"
        };
        res.status(404).json(missingRouteResponse);
    }
}
