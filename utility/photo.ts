import { PhotoStore } from "../commons/types";
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

const dataDirectory = path.join(process.cwd(), 'data');
const photosFilename = "photos.json";

export function getAllPhoto(): PhotoStore[] {
    const fullPath = path.join(dataDirectory, photosFilename);
    const photosContent = fs.readFileSync(fullPath, "utf-8");
    const photos: PhotoStore[] = JSON.parse(photosContent);
    return photos;
}

export function getPhoto(id: string): PhotoStore | null {
    const photos = getAllPhoto();
    const photo = photos.find(ph => ph.id === id);
    if (photo) {
        return photo;
    } else {
        return null;
    }

}

export function getPhotoFilter(startDate: string, endDate: string): PhotoStore[] {
    return []
}

export function addPhoto(photo: PhotoStore) {
    const photos = getAllPhoto();
    photos.push(photo);
    photo.id = crypto.randomUUID();
    const fullPath = path.join(dataDirectory, photosFilename);
    fs.writeFileSync(fullPath, JSON.stringify(photos, null, 2));
}

export function deletePhoto(id: string) {
    // deletes all photos with id
    const photos = getAllPhoto();
    const newPhotos = photos.filter(ph => ph.id != id);

    const fullPath = path.join(dataDirectory, photosFilename);
    fs.writeFileSync(fullPath, JSON.stringify(newPhotos, null, 2));
}

export function batchDelete(ids: string[]) {
    let photos = getAllPhoto();
    for (let i = 0; i < ids.length; i++) {
        const id = ids[i];
        photos = photos.filter(ph => ph.id != id);
    }
    const fullPath = path.join(dataDirectory, photosFilename);
    fs.writeFileSync(fullPath, JSON.stringify(photos, null, 2));
}