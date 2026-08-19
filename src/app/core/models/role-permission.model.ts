export interface RolePermissionResponse {
  roleId: number;
  roleName: string;
  permissions: Permission[];
}

export interface Permission {
  id: string;
  name: string;
  code: string;
  description: string;
  module: string;
  createdDate: string;
  updatedDate: string | null;
}

export interface AssignRolePermissionRequest {
  roleId: number;
  permissionIds: string[];
}
