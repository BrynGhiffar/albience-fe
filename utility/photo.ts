import { PhotoStore } from "../commons/types";
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { getConfiguration } from "./config";

const dataDirectory = path.join(process.cwd(), 'data');
const photosFilename = "photos.json";

export function getAllPhoto(): PhotoStore[] {
    const fullPath = path.join(dataDirectory, photosFilename);
    const photosContent = fs.readFileSync(fullPath, "utf-8");
    const photos: PhotoStore[] = JSON.parse(photosContent);
    return photos;
}

export function getRandomPhotoIds(num: number | undefined): string[] {
    let numb = num;
    if (num === undefined) { numb = 1; }

    const seasonalTagging = getConfiguration().seasonalTagging;
    const photos: PhotoStore[] = getAllPhoto().filter(photo => {
        if (!seasonalTagging) return true;
        const nowDate = new Date();
        const nowDay = nowDate.getDate() + nowDate.getMonth() * 30;
        const photoDate = new Date(parseInt(photo.date));
        const photoDay = photoDate.getDate() + photoDate.getMonth() * 30;
        const days = 17;
        if ((nowDay - days <= photoDay) && (nowDay + days >= photoDay)) {
            return true;
        } else {
            return false;
        }
    });
    const len = photos.length;
    if (len === 0) numb = 0;

    const indexes = Array(numb).fill(1).map(_ => {
        let num = Math.floor(Math.random() * len);
        return num;
    });
    const chosenPhotos = indexes.map(v => photos[v]);
    let urls: string[] = [];
    for (let i = 0; i < chosenPhotos.length; i++) {
        let x = chosenPhotos[i].id;
        if (x !== null) {
            urls.push(x);
        }
    }
    
    return urls;
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