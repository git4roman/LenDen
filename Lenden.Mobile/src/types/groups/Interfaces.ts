export interface GroupDto {
  createdBy: number;
  createdByUser: any; // Or a specific type if you know it
  createdDate: string;
  createdTime: string;
  id: number;
  imageUrl: string;
  name: string;
  updatedDate: string;
  updatedTime: string;
  userGroups: any[]; // Or a specific type if you know it
}
