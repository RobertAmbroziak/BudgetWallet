using BusinessLogic.Abstractions;
using FluentValidation;
using Microsoft.Extensions.Localization;
using Model.Identity;
using Util.Resources;

namespace WebApi.Validators
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
                .EmailAddress().WithMessage(_localizer["rule_invalid EmailFormat"].Value)
                .MinimumLength(6).WithMessage(_localizer["rule_emailMinLong"].Value)
                .MaximumLength(200).WithMessage(_localizer["rule_emailMaxLong"].Value)
                .MustAsync(async (email, cancellationToken) => await BeUniqueEmail(email)).WithMessage(_localizer["rule_emailTaken"].Value);

            RuleFor(x => x.UserName)
                .NotEmpty().WithMessage(_localizer["rule_usernameRequired"].Value)
                .MinimumLength(3).WithMessage(_localizer["rule_usernameMinLong"].Value)
                .MaximumLength(50).WithMessage(_localizer["rule_usernameMaxLong"].Value)
                .MustAsync(async (userName, cancellationToken) => await BeUniqueUserName(userName)).WithMessage(_localizer["rule_usernameTaken"].Value);

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage(_localizer["rule_passwordRequired"].Value)
                .Matches(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$")
                .WithMessage(_localizer["rule_passwordFormat"].Value);
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
