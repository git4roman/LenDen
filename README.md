# Expense Management App 💰

Manage your personal and group expenses effortlessly. Track spending, split bills, and keep everyone on the same page.

---

## 🔐 Authentication
- **Email & Password** login
- **Google OAuth** sign-in

<img width="408" height="689" alt="Login screen" src="https://github.com/user-attachments/assets/54062344-1240-4e6d-a237-4004b4e881de" />

---

## 💸 Expense Management
- Add new expenses with **amount, date, and description**
- Assign expenses to yourself or other group members

---

## 👥 Group & Friends Management
### Create Multiple Groups
Organize your expenses by different groups like Family, Friends, Trips, etc.

<img width="460" height="1005" alt="Groups screen" src="https://github.com/user-attachments/assets/9c3eb795-f8bc-4dcd-b916-3bcd0ee1c813" />

### Add Friends from Phone Contacts
Easily include friends in your groups using your phone contacts.

<img width="456" height="1008" alt="Add friends" src="https://github.com/user-attachments/assets/096bc4cb-f514-44fb-a92e-f826da4c8c65" />

---

## 🧾 Transactions
### Create Transactions with Multiple Payers
- Each transaction can have **multiple payers**
- Split amounts **equally** or by **custom proportions**

```json
[
  {
    "id": 3,
    "description": "NPL Tickets",
    "groupId": 1,
    "madeBy": {"id": 2, "fullName": "Roman"},
    "amount": 1200.00,
    "createdDate": "2025-11-03",
    "payers": [
      {"payerId": 2, "payer": {"id": 2, "fullName": "Roman"}, "amount": 1200.00}
    ]
  },
  {
    "id": 4,
    "description": "Dinner",
    "groupId": 1,
    "madeBy": {"id": 2, "fullName": "Roman"},
    "amount": 600.00,
    "createdDate": "2025-11-04",
    "payers": [
      {"payerId": 1, "payer": {"id": 1, "fullName": "Admin Admin"}, "amount": 200.00},
      {"payerId": 2, "payer": {"id": 2, "fullName": "Roman"}, "amount": 400.00}
    ]
  }
]
