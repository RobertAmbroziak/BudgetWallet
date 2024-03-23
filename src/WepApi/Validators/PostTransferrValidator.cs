using FluentValidation;
using Model.Application;

namespace WepApi.Validators
{
    public class PostTransferValidator : AbstractValidator<PostTransfer>
    {
        public PostTransferValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Nazwa transferu jest wymagana.")
                .MaximumLength(50).WithMessage("Nazwa transferu nie może być dłuższa niż 50 znaków.");
                
            //Todo: reszta zasad
        }
    }
}
