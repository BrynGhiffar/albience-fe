import { HOST } from "../commons/env";
import { PhotoStore } from "../commons/types";

export async function addPhoto(newPhoto: PhotoStore) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");


    var raw = JSON.stringify(newPhoto);

    var requestOptions: RequestInit = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
    };

    await fetch(`${HOST}/api/photo`, requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
}

export function deletePhoto(ids: string[]) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "ids": ids
    });

    var requestOptions: RequestInit = {
        method: 'DELETE',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch(`${HOST}/api/photo`, requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
}
const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result?.toString()!);
    reader.onerror = error => reject(error);
});

export async function extractBase64(files: FileList): Promise<PhotoStore[]> {
  let readers: FileReader[] = [];
  let photos: PhotoStore[] = [];
  if (files != null) {
    console.log(files);
    for (let fi = 0; fi < files.length; fi++) {
      const file = files[fi];
      const fileString = await toBase64(file);
        // console.log(fileString.substring(1000, 1020));
      const newPhoto: PhotoStore = {
        "id": null,
        "name": file.name,
        "photoBase64": fileString,
        "date": file.lastModified.toString(),
      }
      photos.push(newPhoto);
    }
  }
  return photos;
}