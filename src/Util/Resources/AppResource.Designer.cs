﻿//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//     Runtime Version:4.0.30319.42000
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Util.Resources {
    using System;
    
    
    /// <summary>
    ///   A strongly-typed resource class, for looking up localized strings, etc.
    /// </summary>
    // This class was auto-generated by the StronglyTypedResourceBuilder
    // class via a tool like ResGen or Visual Studio.
    // To add or remove a member, edit your .ResX file then rerun ResGen
    // with the /str option, or rebuild your VS project.
    [global::System.CodeDom.Compiler.GeneratedCodeAttribute("System.Resources.Tools.StronglyTypedResourceBuilder", "17.0.0.0")]
    [global::System.Diagnostics.DebuggerNonUserCodeAttribute()]
    [global::System.Runtime.CompilerServices.CompilerGeneratedAttribute()]
    public class AppResource {
        
        private static global::System.Resources.ResourceManager resourceMan;
        
        private static global::System.Globalization.CultureInfo resourceCulture;
        
        [global::System.Diagnostics.CodeAnalysis.SuppressMessageAttribute("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode")]
        internal AppResource() {
        }
        
        /// <summary>
        ///   Returns the cached ResourceManager instance used by this class.
        /// </summary>
        [global::System.ComponentModel.EditorBrowsableAttribute(global::System.ComponentModel.EditorBrowsableState.Advanced)]
        public static global::System.Resources.ResourceManager ResourceManager {
            get {
                if (object.ReferenceEquals(resourceMan, null)) {
                    global::System.Resources.ResourceManager temp = new global::System.Resources.ResourceManager("Util.Resources.AppResource", typeof(AppResource).Assembly);
                    resourceMan = temp;
                }
                return resourceMan;
            }
        }
        
        /// <summary>
        ///   Overrides the current thread's CurrentUICulture property for all
        ///   resource lookups using this strongly typed resource class.
        /// </summary>
        [global::System.ComponentModel.EditorBrowsableAttribute(global::System.ComponentModel.EditorBrowsableState.Advanced)]
        public static global::System.Globalization.CultureInfo Culture {
            get {
                return resourceCulture;
            }
            set {
                resourceCulture = value;
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Code doesn&apos;t exists or expired.
        /// </summary>
        public static string err_codeDoesnottExistsOrExpired {
            get {
                return ResourceManager.GetString("err_codeDoesnottExistsOrExpired", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Error at.
        /// </summary>
        public static string err_errorAt {
            get {
                return ResourceManager.GetString("err_errorAt", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to User not found.
        /// </summary>
        public static string err_userNotFound {
            get {
                return ResourceManager.GetString("err_userNotFound", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Wrong user name or password..
        /// </summary>
        public static string err_wrongUserNameOrPassword {
            get {
                return ResourceManager.GetString("err_wrongUserNameOrPassword", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to AccountId doesn&apos;t belong to user..
        /// </summary>
        public static string rule_accountIdBelongsToUser {
            get {
                return ResourceManager.GetString("rule_accountIdBelongsToUser", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Budget can&apos;t be empty..
        /// </summary>
        public static string rule_budgetCannotBeNull {
            get {
                return ResourceManager.GetString("rule_budgetCannotBeNull", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Maximum length of the budget description is 200 characters..
        /// </summary>
        public static string rule_budgetDescMaxLong {
            get {
                return ResourceManager.GetString("rule_budgetDescMaxLong", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to BudgetId doesn&apos;t belong to user..
        /// </summary>
        public static string rule_budgetIdBelongsToUser {
            get {
                return ResourceManager.GetString("rule_budgetIdBelongsToUser", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Budget must have at least one active period..
        /// </summary>
        public static string rule_budgetMustHaveAtLeastOneActivePeriod {
            get {
                return ResourceManager.GetString("rule_budgetMustHaveAtLeastOneActivePeriod", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Budget must have at least one category..
        /// </summary>
        public static string rule_budgetMustHaveAtLeastOneCategory {
            get {
                return ResourceManager.GetString("rule_budgetMustHaveAtLeastOneCategory", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Maximum length of the budget name is 50 characters..
        /// </summary>
        public static string rule_budgetNameMaxLong {
            get {
                return ResourceManager.GetString("rule_budgetNameMaxLong", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Budget name cannot be empty..
        /// </summary>
        public static string rule_budgetNameRequired {
            get {
                return ResourceManager.GetString("rule_budgetNameRequired", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Bbudget&apos;s end date must be at least one day greater than the start date..
        /// </summary>
        public static string rule_budgetValidToDateMustBeGreaterThanValidFromDate {
            get {
                return ResourceManager.GetString("rule_budgetValidToDateMustBeGreaterThanValidFromDate", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Category ID must belong to the given user and be valid..
        /// </summary>
        public static string rule_categoryIdMustBeValidAndBelongToUser {
            get {
                return ResourceManager.GetString("rule_categoryIdMustBeValidAndBelongToUser", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to One or more categoryId doesn&apos;t belong to budget..
        /// </summary>
        public static string rule_categoryIdsBelongToBudget {
            get {
                return ResourceManager.GetString("rule_categoryIdsBelongToBudget", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Budget category value must be positive..
        /// </summary>
        public static string rule_categoryMaxValueMustBePositive {
            get {
                return ResourceManager.GetString("rule_categoryMaxValueMustBePositive", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Categories must belong to the current user..
        /// </summary>
        public static string rule_categoryMustBelongToUser {
            get {
                return ResourceManager.GetString("rule_categoryMustBelongToUser", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Sum of category values for the periods must be equal budget category value..
        /// </summary>
        public static string rule_categoryValuesMustMatch {
            get {
                return ResourceManager.GetString("rule_categoryValuesMustMatch", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Destination account is required..
        /// </summary>
        public static string rule_destinationAccountIdRequired {
            get {
                return ResourceManager.GetString("rule_destinationAccountIdRequired", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Email is requaired..
        /// </summary>
        public static string rule_emailIsRequired {
            get {
                return ResourceManager.GetString("rule_emailIsRequired", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Email cannot exceed 200 characters..
        /// </summary>
        public static string rule_emailMaxLong {
            get {
                return ResourceManager.GetString("rule_emailMaxLong", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Email must be at least 6 characters long..
        /// </summary>
        public static string rule_emailMinLong {
            get {
                return ResourceManager.GetString("rule_emailMinLong", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Email address is already taken..
        /// </summary>
        public static string rule_emailTaken {
            get {
                return ResourceManager.GetString("rule_emailTaken", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to First period must have a start date that matches the budget..
        /// </summary>
        public static string rule_firstPeriodMustMatchBudgetStart {
            get {
                return ResourceManager.GetString("rule_firstPeriodMustMatchBudgetStart", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Invalid email address format..
        /// </summary>
        public static string rule_invalid_EmailFormat {
            get {
                return ResourceManager.GetString("rule_invalid EmailFormat", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Last period must have an end date that matches the budget..
        /// </summary>
        public static string rule_lastPeriodMustMatchBudgetEnd {
            get {
                return ResourceManager.GetString("rule_lastPeriodMustMatchBudgetEnd", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Password must be at least 8 characters long, including at least one lowercase letter, one uppercase letter, one digit, and one special character..
        /// </summary>
        public static string rule_passwordFormat {
            get {
                return ResourceManager.GetString("rule_passwordFormat", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Password is required..
        /// </summary>
        public static string rule_passwordRequired {
            get {
                return ResourceManager.GetString("rule_passwordRequired", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Sum of the category values for periods must be equal to the value for the given budget category..
        /// </summary>
        public static string rule_periodCategoriesMustMatchBudgetCategories {
            get {
                return ResourceManager.GetString("rule_periodCategoriesMustMatchBudgetCategories", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Budget period must be at least one day long..
        /// </summary>
        public static string rule_periodMustBeAtLeastOneDay {
            get {
                return ResourceManager.GetString("rule_periodMustBeAtLeastOneDay", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Periods in the budget must be sequential..
        /// </summary>
        public static string rule_periodsMustBeSequential {
            get {
                return ResourceManager.GetString("rule_periodsMustBeSequential", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Source and destination account should be defferent..
        /// </summary>
        public static string rule_sourceAndDestinationDifferent {
            get {
                return ResourceManager.GetString("rule_sourceAndDestinationDifferent", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Split values should be positive..
        /// </summary>
        public static string rule_splitValuePositive {
            get {
                return ResourceManager.GetString("rule_splitValuePositive", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Transfer description cannot exceed 200 characters..
        /// </summary>
        public static string rule_transferDescMaxLong {
            get {
                return ResourceManager.GetString("rule_transferDescMaxLong", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Transfer name cannot exceed 50 characters..
        /// </summary>
        public static string rule_transferNameMaxLong {
            get {
                return ResourceManager.GetString("rule_transferNameMaxLong", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Transfer name is required..
        /// </summary>
        public static string rule_transferNameRequired {
            get {
                return ResourceManager.GetString("rule_transferNameRequired", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Sum of the split values must be equal transfer value..
        /// </summary>
        public static string rule_transferSumEqualsSplitSum {
            get {
                return ResourceManager.GetString("rule_transferSumEqualsSplitSum", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Transfer value not equals split value sum..
        /// </summary>
        public static string rule_transferValueEqualsSplitSum {
            get {
                return ResourceManager.GetString("rule_transferValueEqualsSplitSum", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Transfer value should be positive..
        /// </summary>
        public static string rule_transferValuePositive {
            get {
                return ResourceManager.GetString("rule_transferValuePositive", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to User does not have any avtive categories.
        /// </summary>
        public static string rule_userDoesNotHaveAnyAvtiveCategories {
            get {
                return ResourceManager.GetString("rule_userDoesNotHaveAnyAvtiveCategories", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Username cannot exceed 50 characters..
        /// </summary>
        public static string rule_usernameMaxLong {
            get {
                return ResourceManager.GetString("rule_usernameMaxLong", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Username must be at least 3 characters long..
        /// </summary>
        public static string rule_usernameMinLong {
            get {
                return ResourceManager.GetString("rule_usernameMinLong", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Username is required..
        /// </summary>
        public static string rule_usernameRequired {
            get {
                return ResourceManager.GetString("rule_usernameRequired", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Username is already taken..
        /// </summary>
        public static string rule_usernameTaken {
            get {
                return ResourceManager.GetString("rule_usernameTaken", resourceCulture);
            }
        }
    }
}
