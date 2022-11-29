import type { NextApiRequest, NextApiResponse } from "next";
import { GET_IMAGE, HOST } from "../../commons/env";
import { PhotoStore, GetPhotoResponse, MissingRouteResponse, PostPhotoResponse, GetRandomPhotoResponse } from "../../commons/types";
import { getConfiguration } from "../../utility/config";
import { addPhoto, batchDelete, deletePhoto, getAllPhoto } from "../../utility/photo";

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '4mb' // Set desired value here
        }
    }
}

// const HOST = "http://localhost:3000";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetPhotoResponse | GetRandomPhotoResponse | MissingRouteResponse | PostPhotoResponse>
) {
    if (req.method === 'GET') {
        // going to return appropriate images depending on configuration
        const { "random-image": random_image } = req.query;
        if (!(random_image == null || random_image == undefined)) {
            const photos: PhotoStore[] = getAllPhoto();
            const choice = Math.floor(Math.random() * photos.length);
            const url = `${HOST}${GET_IMAGE}/${photos[choice].id}`;
            const response: GetRandomPhotoResponse = { photo_url:  url };
            return res.status(200).json(response);
        } else {
            const photos: PhotoStore[] = getAllPhoto();
            const photoResponse: GetPhotoResponse = {
                photos
            };
            res.status(200).json(photoResponse);
        }
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
