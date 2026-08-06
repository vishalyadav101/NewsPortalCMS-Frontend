export interface MenuItem {
  id: number;
  menuId: number;
  parentId: number | null;
  title: string;
  url: string;
  icon: string;
  target: string;
  displayOrder: number;
  isActive: boolean;
  createdDate: string;
  updatedDate: string | null;
}

export interface MenuItemRequest {
  menuId: number;
  parentId: number | null;
  title: string;
  url: string;
  icon: string;
  target: string;
  displayOrder: number;
  isActive: boolean;
}
