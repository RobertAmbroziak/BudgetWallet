const config = {
  API_BASE_URL:
    "https://localhost:7006" /*"https://budgetwallet.azurewebsites.net","http://localhost:2777",*/,
  API_ENDPOINTS: {
    ADMIN: "/api/administration",
    APPLICATION: "/api/application",
    HOME: "/api/home",
    LOGIN: "/api/identity/login",
    REGISTER: "/api/identity/register",
    GOOGLE_LOGIN: "/api/identity/googleLogin",
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
};

export default config;
  