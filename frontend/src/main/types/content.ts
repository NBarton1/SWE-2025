export interface Content {
    id: number,
    filename: string,
    fileSize: number,
    contentType: string,
    downloadUrl: string,
}

export interface ContentPreview {
    file: File,
    previewUrl: string,
}
