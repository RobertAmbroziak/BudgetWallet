using Model.Tables.Abstractions;

namespace Model.Tables
{
    public class RegisterConfirmationDto : BaseDto
    {
        public int UserId { get; set; }
        public string Code { get; set; }
        public bool IsUsed { get; set; }
        public DateTime ValidTo { get; set; }
        public string NewHashedPassword { get; set; }

        public virtual UserDto User { get; set; }
    }
}
