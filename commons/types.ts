export type PhotoStore = {
    id: string | null,
  name: string,
  photoBase64: string,
  date: string
}

export type GetPhotoResponse = {
    photos: PhotoStore[]
}

export type PostPhotoResponse = {
    message: string
}

export type DeletePhotoResponse = {
    message: string
}

export type MissingRouteResponse = {
    message: string
}
