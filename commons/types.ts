export type PhotoStore = {
    id: string | null,
  name: string,
  photoBase64: string,
  date: string
}

export type GetPhotoResponse = {
    photos: PhotoStore[]
}

export type GetRandomPhotoResponse = {
    photo_url: string
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

export type Configuration = {
    seasonalTagging: boolean
}