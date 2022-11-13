// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs';
import path from 'path';

type Data = {
  name: string
}

type PhotoStore = {
  name: string,
  photoBase64: string,
  date: string
}

const dataDirectory = path.join(process.cwd(), 'data');
const photosName = "photos.json";
const configName = "config.json";


export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<PhotoStore[]>
) {
  const fullPath = path.join(dataDirectory, photosName);
  const photosContent = fs.readFileSync(fullPath, "utf-8");
  const photos: PhotoStore[] = JSON.parse(photosContent);
  res.status(200).json(photos);
}
