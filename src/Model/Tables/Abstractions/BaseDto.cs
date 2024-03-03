namespace Model.Tables.Abstractions
{
    public abstract class BaseDto
    {
        public int Id { get; set; }
        public int CreatedBy { get; set; }
        public int LastModifiedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime LastModifiedDate { get; set; }
    }
}
