import { GroupEntity } from "../types/groups/Interfaces";
import { UserEntity } from "../types/UserEntity";

export interface Transaction {
  id: number;
  groupId: number;
  paidByUserId: number;
  paidByUser: UserEntity;
  amount: number;
  paidOnDate: string;
  paidOnTime: string;
  group: GroupEntity;
}
