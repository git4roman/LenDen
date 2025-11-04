import { GroupEntity } from "../types/groups/Interfaces";
import { UserEntity } from "../types/UserEntity";

export interface TransactionPayer {
  payerId: number;
  payer: UserEntity;
  amount: number;
}

export interface Transaction {
  id: number;
  groupId: number;
  madeById: number;
  madeBy: UserEntity;
  amount: number;
  createdDate: string; // date only
  createdAt: string; // time only
  description: string;
  payers: TransactionPayer[];
}
