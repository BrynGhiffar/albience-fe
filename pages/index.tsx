import { Button, Switch } from '@mui/material';
import Image from 'next/image'
import backgroundImage from "../public/flower_background.jpg";
import styles from "../styles/Home.module.css";
import addIcon from "../public/add.png";
import React from 'react';
import { CLIENT_RENEG_LIMIT } from 'tls';

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

function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
  const { target } = event;
  const { files } = target;
  if (files != null) {
    const file = files[0];
    console.log(files);
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      const base64 = reader.result?.toString();
      // upload to backend
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  }
}

function UploadPhotoButton() {
  return (
    <Button
      variant="contained"
      component="label"
    >
      Upload Image
      <input
        type="file"
        hidden
        onChange={handleUpload}
      />
    </Button>
  )
}

let links = [
  "https://images.wallpaperscraft.com/image/single/irbis_predator_big_cat_412420_1920x1080.jpg",
  "https://images.wallpaperscraft.com/image/single/irbis_predator_big_cat_412420_1920x1080.jpg",
  "https://images.wallpaperscraft.com/image/single/irbis_predator_big_cat_412420_1920x1080.jpg"
]

function UploadPhotosSetting() {
  return (
    <div className={styles.settings_container}>
      <p className={styles.settings_title}>PHOTOS</p>
      <div className={styles.album_image_container}>
          {
            links.map(l => <Image 
              src={l}
              alt="Image"
              className={styles.image}
              onClick={_ => console.log(backgroundImage)}
              height={120}
              width={120}
            />)
          }
      </div>
      <UploadPhotoButton/>
    </div>
  )
}

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.inner_container}>
        <main className={styles.main_container}>
          <h1 className={styles.title}>ALBIENCE</h1>
          <SeasonalTaggingSetting/>
          <UploadPhotosSetting/>
        </main>
      </div>
    </div>
  )
}
