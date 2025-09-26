import { GroupEntity } from "../types/groups/Interfaces";

export interface Transaction {
  id: number;
  groupId: number;
  paidByUserId: number;
  amount: number;
  paidOnDate: string;
  paidOnTime: string;
  group: GroupEntity;
}
