import { Button, Switch } from '@mui/material';
import Image from 'next/image'
import styles from "../styles/Home.module.css";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getAllPhoto } from '../utility/photo';
import { Configuration, PhotoStore } from '../commons/types';
import { getConfiguration, toggleSeasonalTagging } from '../client_side_utils/configuration';
import { addPhoto, deletePhoto, extractBase64 } from '../client_side_utils/photo';
import { GET_IMAGE, HOST } from '../commons/env';
import Head from 'next/head';

function SeasonalTaggingSetting() {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    getConfiguration()
      .then(result => {
        if (result !== undefined) {
          setChecked(_ => result.seasonalTagging);
        }
      })
  }, [checked]);

  return (
    <div className={styles.settings_container}>
      <div className={styles.seasonal_tagging_container}>
        <div className={styles.settings_title}><p>SEASONAL TAGGING</p></div>
        <Switch checked={checked} onChange={e => {
          toggleSeasonalTagging(e.target.checked);
          setChecked(_ => e.target.checked);
        }}/>
      </div>
    </div>
  )
}

async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
  const { target } = event;
  const { files } = target;
  if (files !== null) {
    const photos = await extractBase64(files); 
    photos.forEach(async (photo: PhotoStore) => {
      await addPhoto(photo);
    });
  }
  
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
        accept="image/*"
        multiple
        hidden
        onChange={async e => {
          handleUpload(e)
            .then(_ => {
              setTimeout(_ => router.reload(), 2000);
            });
        }}
      />
    </Button>
  );
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
      deletePhoto(ids);
      setTimeout(_ => router.reload(), 2000);
    }}
  >Delete Image Selections</Button>);
}

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
  const endpoint = (id: string | null) => `${HOST}${GET_IMAGE}/${id}`;

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

export default function Home({ images } : ServerSideProps) {

  return (
    <div className={styles.container}>
      <Head>
        <title>Albience - Dashboard</title>
        <link rel="icon" href="/camera.png"/>
      </Head>
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
