using BusinessLogic.Abstractions;
using FluentValidation;
using Microsoft.Extensions.Localization;
using Model.Identity;
using Util.Resources;

namespace WepApi.Validators
{
    public class UserRegisterRequestValidator : AbstractValidator<UserRegisterRequest>
    {
        private readonly IIdentityService _identityService;
        private readonly IStringLocalizer<AppResource> _localizer;

        public UserRegisterRequestValidator(IIdentityService identityService, IStringLocalizer<AppResource> localizer)
        {
            _identityService = identityService;
            _localizer = localizer;

            RuleFor(x => x.Email)
                .NotEmpty().WithMessage(_localizer["rule_emailIsRequired"].Value)
                .EmailAddress().WithMessage("Nieprawidłowy format adresu email.")
                .MinimumLength(6).WithMessage("Email musi mieć co najmniej 6 znaków.")
                .MaximumLength(200).WithMessage("Email nie może być dłuższy niż 200 znaków.")
                .MustAsync(async (email, cancellationToken) => await BeUniqueEmail(email)).WithMessage("Adres email jest już zajęty.");

            RuleFor(x => x.UserName)
                .NotEmpty().WithMessage("Nazwa użytkownika jest wymagana.")
                .MinimumLength(3).WithMessage("Nazwa użytkownika musi mieć co najmniej 3 znaki")
                .MaximumLength(50).WithMessage("Nazwa użytkownika nie może być dłuższa niż 50 znaków.")
                .MustAsync(async (userName, cancellationToken) => await BeUniqueUserName(userName)).WithMessage("Nazwa użytkownika jest już zajęta.");

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Hasło jest wymagane.")
                .Matches(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$")
                .WithMessage("Hasło musi zawierać co najmniej 8 znaków, w tym co najmniej jedną małą literę, jedną dużą literę, jedną cyfrę oraz jeden znak specjalny.");
        }

        private async Task<bool> BeUniqueEmail(string email)
        {
            return !(await _identityService.IsEmailExists(email));
        }

        private async Task<bool> BeUniqueUserName(string userName)
        {
            return !(await _identityService.IsUserNameExists(userName));
        }
    }
}
