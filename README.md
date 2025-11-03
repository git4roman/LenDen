# Expense Management

## Supports Email/Password login and Google OAuth sign-in
<img width="408" height="689" alt="image" src="https://github.com/user-attachments/assets/54062344-1240-4e6d-a237-4004b4e881de" />


## Add new expenses with amount, date, and description.
### Create Groups
<img width="469" height="935" alt="image" src="https://github.com/user-attachments/assets/8248d773-be9f-447b-989b-5c3a82e49b01" />
<img width="460" height="1005" alt="image" src="https://github.com/user-attachments/assets/9c3eb795-f8bc-4dcd-b916-3bcd0ee1c813" />


### Add Friends from phone contact
<img width="456" height="1008" alt="image" src="https://github.com/user-attachments/assets/096bc4cb-f514-44fb-a92e-f826da4c8c65" />

### Add Transaction Backend Logic
<pre> ```
  [Authorize]
    [HttpPost]
    public async Task<IActionResult> CreateExpense([FromBody] ExpenseDto dto)
    {
        var allUserIds = dto.PaidByDto.Select(u => u.UserId)
            .Concat(dto.SplitBetweenDto.Select(u => u.UserId))
            .Distinct();
        foreach(var userId in allUserIds)
        {
            var existingUser = await _uow.User.GetByIdAsync(userId);
            if (existingUser == null) return NotFound($"User with id {userId} doesn't exist");
        }
        
        var splitCount = dto.SplitBetweenDto.Count;
        
        await using var transaction = await _context.Database.BeginTransactionAsync();
        
        
        try
        {
            var expense = new ExpenseEntity(dto.MadeById, dto.Description, dto.Amount);
            await _uow.Expense.AddAsync(expense);
            await _uow.SaveChangesAsync();
            

            foreach (var payer in dto.PaidByDto)
            {
                var expensePayer = new ExpensePayerEntity(expense.Id, payer.UserId, payer.Amount);
                await _uow.Expense.AddExpensePayer(expensePayer);

                foreach (var splitter in dto.SplitBetweenDto)
                {
                    var expenseSplitter = new ExpenseSplitEntity(expense.Id, splitter.UserId, splitter.Amount);
                    await _uow.Expense.AddExpenseSplitter(expenseSplitter);

                    if (splitter.UserId == payer.UserId)
                    {
                        continue;
                    }

                    var owedToId = Math.Min(payer.UserId, splitter.UserId);
                    var owedById = Math.Max(payer.UserId, splitter.UserId);
                    var existingBalance = await _context.Balances.Where(u =>
                            ((u.OwedToId == owedToId && u.OwedById == owedById) && u.GroupId == dto.GroupId))
                        .FirstOrDefaultAsync();
                    if (existingBalance != null)
                    {
                        if (payer.UserId == existingBalance.OwedToId)
                        {
                            existingBalance.Amount += payer.Amount/splitCount;
                        }
                        else
                        {
                            existingBalance.Amount -= payer.Amount/splitCount;;
                        }
                    }
                    else
                    {
                        
                        var newBalance = new BalanceEntity(dto.GroupId, owedToId, owedById,
                            (payer.Amount / splitCount));
                        await _uow.Balance.AddAsync(newBalance);
                    }

                } 
            }
            await _uow.SaveChangesAsync();
            await transaction.CommitAsync();

            return Ok();
        }
        catch (Exception e)
        {
            await transaction.RollbackAsync();
            throw;
        }
  ```</pre>

### Distributes expenses between members

<pre> ```
  {
  "groupId": 0,
  "description": "string",
  "amount": 0,
  "paidByDto": [
    {
      "userId": 0,
      "amount": 0
    }
  ],
  "splitBetweenDto": [
    {
      "userId": 0,
      "amount": 0
    }
  ],
  "madeById": 0
}
  ```</pre>


Assign who paid and who participated.

Auto-split expenses equally or by custom shares.

Edit or delete existing expenses.
