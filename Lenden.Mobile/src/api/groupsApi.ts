// src/api/groupsApi.ts
import { axiosInstance } from "@/src/services";
import { Transaction } from "@/src/types/TransactionEntity";
import { GroupEntity } from "@/src/types/groups/Interfaces";

export const fetchTransactions = (groupId: string) =>
  axiosInstance.get<Transaction[]>(`/v1/ExpenseApi/transactions/${groupId}`);

export const fetchGroup = (groupId: string) =>
  axiosInstance.get<GroupEntity>(`/GroupApi/${groupId}/get-group`);

export const fetchBalance = (groupId: string) =>
  axiosInstance.get<{ toCollect: number; toPay: number }>(
    `/BalanceApi/${groupId}/balance`
  );

export const fetchMutualBalance = (groupId: string) =>
  axiosInstance.get<{ amount: number; fromUser: number; toUser: number }[]>(
    `/BalanceApi/${groupId}/mutual-balance`
  );
