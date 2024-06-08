const config = {
  API_BASE_URL:
    /*"https://localhost:7006",*/
    "http://localhost:2777",
    /*"https://budgetwalletapi.azurewebsites.net",*/
  API_ENDPOINTS: {
    ADMIN: "/api/administration",
    APPLICATION: "/api/application",
    HOME: "/api/home",
    ACTIVATE: "/api/identity/activate",
    LOGIN: "/api/identity/login",
    REGISTER: "/api/identity/register",
    GOOGLE_LOGIN: "/api/identity/googleLogin",
    FACEBOOK_LOGIN: "/api/identity/facebookLogin",
    SPLITS: "/api/transfer/splits",
    FILTER: "/api/application/transferfilter",
    BUDGET_PERIODS: "/api/budget/{budgetId}/budgetPeriods",
    BUDGETS: "/api/budget",
    BUDGET_CATEGORIES: "/api/category/budget/{budgetId}",
    BUDGET_ACCOUNTS: "/api/account/budgets/{budgetId}",
    TRANSFERS: "/api/transfer",
    ACCOUNTS: "/api/account",
    CATEGORIES: "/api/category",
  },
  GOOGLE_CLIENT_ID: "ADD_YOUR_GOOGLE_CLIENT_ID_HERE.apps.googleusercontent.com",
  FACEBOOK_CLIENT_ID: "ADD_YOUR_FACEBOOK_CLIENT_ID_HERE",
};

export default config;

  