export interface WebsiteSetting {
  id: number;

  websiteName: string;
  logoUrl: string | null;
  faviconUrl: string | null;

  websiteDescription: string;

  contactEmail: string;
  contactPhone: string;
  address: string;

  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;

  facebookUrl: string;
  twitterUrl: string;
  instagramUrl: string;
  youTubeUrl: string;
  linkedInUrl: string;

  footerText: string;

  createdDate: string;
  updatedDate: string | null;
}

export interface WebsiteSettingRequest {
  websiteName: string;
  logoUrl: string;
  faviconUrl: string;

  websiteDescription: string;

  contactEmail: string;
  contactPhone: string;
  address: string;

  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;

  facebookUrl: string;
  twitterUrl: string;
  instagramUrl: string;
  youTubeUrl: string;
  linkedInUrl: string;

  footerText: string;
}
