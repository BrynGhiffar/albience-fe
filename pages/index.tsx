import { Button, Switch } from '@mui/material';
import Image from 'next/image'
import backgroundImage from "../public/flower_background.jpg";
import styles from "../styles/Home.module.css";
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { getAllPhoto } from '../utility/photo';
import { PhotoStore } from '../commons/types';

const HOST = "http://localhost:3000";

function SeasonalTaggingSetting() {
  return (
    <div className={styles.settings_container}>
      <div className={styles.seasonal_tagging_container}>
        <div className={styles.settings_title}><p>SEASONAL TAGGING</p></div>
        <Switch/>
      </div>
    </div>
  )
}

function addPhoto(newPhoto: PhotoStore) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify(newPhoto);

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  // @ts-ignore
  fetch("http://localhost:3000/api/photo", requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
}

function deletePhoto(ids: string[]) {

}

function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
  const { target } = event;
  const { files } = target;
  let readers: FileReader[] = [];
  if (files != null) {
    console.log(files);
    for (let fi = 0; fi < files.length; fi++) {
      const file = files[fi];
      var reader = new FileReader();
      console.log(file.name);
      reader.onload = function () {

        const base64 = this.result?.toString();
        console.log(base64?.substring(20, 40));
        const newPhoto: PhotoStore= {
          "id": null,
          "name": file.name,
          "photoBase64": base64!,
          "date": file.lastModified.toString(),
        }

        addPhoto(newPhoto);
      };
      reader.onerror = function (error) {
        console.log('Error: ', error);
      };
      reader.readAsDataURL(file);
      readers.push(reader);
    }
  }
}

function handleDeletePhotos(ids: string[]) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    "ids": ids
  });

  var requestOptions = {
    method: 'DELETE',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

    // @ts-ignore
  fetch("http://localhost:3000/api/photo", requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
}

function UploadPhotoButton() {
  const router = useRouter();
  return (
    <Button
      variant="contained"
      component="label"
    >
      Upload Image
      <input
        type="file"
        hidden
        onChange={e => {
          handleUpload(e);
          setTimeout(_ => router.reload(), 2000);
        }}
        multiple
      />
    </Button>
  )
}

type DeletePhotoButtonProps = {
  ids: string[],
  setSelectedImages: React.Dispatch<React.SetStateAction<string[]>>
}

function DeletePhotoButton({ ids, setSelectedImages } : DeletePhotoButtonProps) {
  const router = useRouter();
  return (<Button
    variant="contained"
    component="label" 
    color="error"
    onClick={_ => {
      handleDeletePhotos(ids);
      setTimeout(_ => router.reload(), 2000);
    }}
  >Delete Image Selections</Button>);
}

let links = [
  "https://images.wallpaperscraft.com/image/single/irbis_predator_big_cat_412420_1920x1080.jpg",
  "https://images.wallpaperscraft.com/image/single/irbis_predator_big_cat_412420_1920x1080.jpg",
  "https://images.wallpaperscraft.com/image/single/irbis_predator_big_cat_412420_1920x1080.jpg"
]

type ServerSideProps = {
  num: number,
  images: PhotoStore[]
};

export async function getServerSideProps() {
  const num = Math.round(Math.random() * 100);
  const images: PhotoStore[] = getAllPhoto()
  return {
    props: {
      num,
      images
    }
  };
}

type UploadPhotoSettingProps = {
  images: PhotoStore[]
}

function UploadPhotosSetting({ images }: UploadPhotoSettingProps) {
  const endpoint = (id: string | null) => `${HOST}/api/image/${id}`;

  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  return (
    <div className={styles.settings_container}>
      <p className={styles.settings_title}>PHOTOS</p>
      <div className={styles.album_image_container}>
          {
            images.map(ps => <Image 
              key={ps.id}
              src={endpoint(ps.id)}
              alt="Image"
              className={`${styles.image} ${selectedImages.includes(ps.id!) ? styles.selected : ""}`}
              onClick={_ => {
                if (selectedImages.includes(ps.id!)) {
                  setSelectedImages(old => old.filter(ops => ops !== ps.id));
                } else {
                  setSelectedImages(old => old.concat(ps.id!));
                }
              }}
              height={1080}
              width={1920}
            />)
          }
      </div>
      <UploadPhotoButton/>
      <br/>
      <br/>
      <DeletePhotoButton ids={selectedImages} setSelectedImages={setSelectedImages}/>
    </div>
  )
}

export default function Home({ num, images } : ServerSideProps) {

  return (
    <div className={styles.container}>
      <div className={styles.inner_container}>
        <main className={styles.main_container}>
          <h1 className={styles.title}>ALBIENCE</h1>
          <SeasonalTaggingSetting/>
          <UploadPhotosSetting images={images}/>
        </main>
      </div>
    </div>
  )
}
