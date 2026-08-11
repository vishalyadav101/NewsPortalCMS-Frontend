export interface Tag {
  id: number;
  name: string;
  slug: string;
  isActive: boolean;
  createdDate: string;
  updatedDate: string | null;

  selected?: boolean;
}

export interface TagRequest {
  name: string;
  slug: string;
  isActive: boolean;
}
