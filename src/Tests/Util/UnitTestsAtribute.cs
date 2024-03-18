using NUnit.Framework;

namespace Tests.Util
{
    [AttributeUsage(AttributeTargets.Method | AttributeTargets.Class, AllowMultiple = false)]
    public class UnitTestsAttribute : CategoryAttribute
    {
    }
}
