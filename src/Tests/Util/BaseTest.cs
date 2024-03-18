using AutoFixture;
using AutoFixture.AutoMoq;

namespace Tests.Util
{
    public class BaseTest
    {
        public IFixture Fixture { get; }

        protected BaseTest()
        {
            Fixture = new Fixture().Customize(new AutoMoqCustomization());
            Fixture.Behaviors.Remove(new ThrowingRecursionBehavior());
            Fixture.Behaviors.Add(new OmitOnRecursionBehavior());
        }
    }
}
