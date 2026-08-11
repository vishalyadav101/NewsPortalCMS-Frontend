export interface Advertisement {
  id: string;

  title: string;

  description: string;

  bannerUrl: string | null;

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

  bannerFile: File | null;

  redirectUrl: string;

  position: number;

  startDate: string;

  endDate: string;

  isActive: boolean;

  displayOrder: number;
}
