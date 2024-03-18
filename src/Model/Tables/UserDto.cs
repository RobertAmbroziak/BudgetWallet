using Model.Tables.Abstractions;
using Util.Enums;

namespace Model.Tables
{
    public class UserDto : BaseDto
    {
        public string UserName { get; set; }
        public string Email { get; set; }
        public string HashedPassword { get; set; }
        public UserRole UserRole { get; set; }
        public Provider Provider { get; set; }

        public virtual ICollection<BudgetDto> Budgets { get; set; }
        public virtual ICollection<CategoryDto> Categories { get; set; }
        public virtual ICollection<AccountDto> Accounts { get; set; }
        public virtual RegisterConfirmationDto RegisterConfirmation { get; set; }
    }
}
