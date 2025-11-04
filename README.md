# Expense Management

## Supports Email/Password login and Google OAuth sign-in
<img width="408" height="689" alt="image" src="https://github.com/user-attachments/assets/54062344-1240-4e6d-a237-4004b4e881de" />


## Add new expenses with amount, date, and description.

### Create Multiple Groups
<img width="460" height="1005" alt="image" src="https://github.com/user-attachments/assets/9c3eb795-f8bc-4dcd-b916-3bcd0ee1c813" />


### Add Friends from phone contact
<img width="456" height="1008" alt="image" src="https://github.com/user-attachments/assets/096bc4cb-f514-44fb-a92e-f826da4c8c65" />

### Create Transaction with multiple payers
<img width="367" height="808" alt="image" src="https://github.com/user-attachments/assets/ec6021a5-ea96-4122-86cd-1c528793d9a0" />

### Distributes expenses between members with either equally or by custom proportion 
<pre>```
  [
    {
        "id": 3,
        "description": "NPL Tickets",
        "groupId": 1,
        "madeById": 2,
        "madeBy": {
            "id": 2,
            "fullName": "Roman"
        },
        "amount": 1200.00,
        "createdAt": "22:51:23.4846460",
        "createdDate": "2025-11-03",
        "payers": [
            {
                "payerId": 2,
                "payer": {
                    "id": 2,
                    "fullName": "Roman"
                },
                "amount": 1200.00
            }
        ]
    },
    {
        "id": 4,
        "description": "string",
        "groupId": 1,
        "madeById": 2,
        "madeBy": {
            "id": 2,
            "fullName": "Roman"
        },
        "amount": 600.00,
        "createdAt": "09:34:47.5170700",
        "createdDate": "2025-11-04",
        "payers": [
            {
                "payerId": 1,
                "payer": {
                    "id": 1,
                    "fullName": "Admin Admin"
                },
                "amount": 200.00
            },
            {
                "payerId": 2,
                "payer": {
                    "id": 2,
                    "fullName": "Roman"
                },
                "amount": 400.00
            }
        ]
    }
]```</pre>

### Mutual-balance as well as summary balance per group
<img width="381" height="174" alt="image" src="https://github.com/user-attachments/assets/933ab0ba-5758-4cc6-a364-86311ea7b5af" />


