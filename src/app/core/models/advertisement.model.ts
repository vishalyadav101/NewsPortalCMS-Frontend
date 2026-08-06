export interface Advertisement {
  id: string;
  title: string;
  description: string;
  mediaId: number;
  mediaUrl: string | null;
  redirectUrl: string;
  position: number;
  positionName: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  displayOrder: number;
  createdDate: string;
  updatedDate: string | null;
}

export interface AdvertisementRequest {
  title: string;
  description: string;
  mediaId: number;
  redirectUrl: string;
  position: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  displayOrder: number;
}
