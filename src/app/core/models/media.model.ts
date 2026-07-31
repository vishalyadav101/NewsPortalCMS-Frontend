export interface Media {
  id: number;
  fileName: string;
  originalFileName: string;
  filePath: string;
  fileType: string;
  contentType: string;
  fileSize: number;
  uploadedBy: string;
  uploadedDate: string;
  isActive: boolean;
}

export interface MediaRequest {
  fileName: string;
  originalFileName: string;
  filePath: string;
  fileType: string;
  contentType: string;
  fileSize: number;
  uploadedBy: string;
  isActive: boolean;
}
