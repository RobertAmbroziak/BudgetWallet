namespace Model.CustomExceptions
{
    public class InactiveUserException : Exception
    {
        public InactiveUserException() : base("Użytkownik jest nieaktywny")
        {
        }
    }
}
