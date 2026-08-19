export interface Permission {
  id: string;
  name: string;
  code: string;
  description: string;
  module: string;
  createdDate: string;
  updatedDate: string | null;
}

export interface PermissionRequest {
  name: string;
  code: string;
  description: string;
  module: string;
}
