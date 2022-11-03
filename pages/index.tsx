import Image from 'next/image'
import backgroundImage from "../public/flower_background.jpg";
import styles from "../styles/Home.module.css";

function SeasonalTaggingSetting() {
  return (
    <div className={styles.container_seasonal_tagging}>
      <p>SEASONAL TAGGING</p>
    </div>
  )
}

function UploadPhotosSetting() {
  return (
    <div className={styles.container_seasonal_tagging}>
      <p>Hello</p>
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
