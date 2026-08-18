export interface WebsiteSetting {
  id: number;

  // ==========================================
  // GENERAL INFORMATION
  // ==========================================

  websiteName: string;
  websiteTagline: string;
  organizationName: string;
  websiteUrl: string;
  websiteDescription: string;
  defaultLanguage: string;
  timeZone: string;
  copyrightText: string;

  // ==========================================
  // BRANDING
  // ==========================================

  logoUrl: string | null;
  faviconUrl: string | null;

  defaultNewsImageMediaId: number;
  defaultSocialImageMediaId: number;

  primaryColor: string;
  secondaryColor: string;

  // ==========================================
  // CONTACT INFORMATION
  // ==========================================

  contactEmail: string;
  editorialEmail: string;
  advertisingEmail: string;
  contactPhone: string;
  whatsAppNumber: string;
  officeAddress: string;
  googleMapsUrl: string;

  // ==========================================
  // SOCIAL MEDIA
  // ==========================================

  facebookUrl: string;
  instagramUrl: string;
  youTubeUrl: string;
  twitterUrl: string;
  linkedInUrl: string;
  telegramUrl: string;
  whatsAppChannelUrl: string;

  // ==========================================
  // SEO
  // ==========================================

  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  canonicalUrl: string;
  googleSiteVerification: string;

  // ==========================================
  // FOOTER
  // ==========================================

  footerText: string;

  // ==========================================
  // AUDIT
  // ==========================================

  createdDate: string;
  updatedDate: string | null;
  updatedById: number | null;
}

export interface WebsiteSettingRequest {
  // ==========================================
  // GENERAL INFORMATION
  // ==========================================

  websiteName: string;
  websiteTagline: string;
  organizationName: string;
  websiteUrl: string;
  websiteDescription: string;
  defaultLanguage: string;
  timeZone: string;
  copyrightText: string;

  // ==========================================
  // BRANDING
  // ==========================================

  logoUrl: string;
  faviconUrl: string;

  defaultNewsImageMediaId: number;
  defaultSocialImageMediaId: number;

  primaryColor: string;
  secondaryColor: string;

  // ==========================================
  // CONTACT INFORMATION
  // ==========================================

  contactEmail: string;
  editorialEmail: string;
  advertisingEmail: string;
  contactPhone: string;
  whatsAppNumber: string;
  officeAddress: string;
  googleMapsUrl: string;

  // ==========================================
  // SOCIAL MEDIA
  // ==========================================

  facebookUrl: string;
  instagramUrl: string;
  youTubeUrl: string;
  twitterUrl: string;
  linkedInUrl: string;
  telegramUrl: string;
  whatsAppChannelUrl: string;

  // ==========================================
  // SEO
  // ==========================================

  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  canonicalUrl: string;
  googleSiteVerification: string;

  // ==========================================
  // FOOTER
  // ==========================================

  footerText: string;
}
