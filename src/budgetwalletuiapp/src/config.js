const config = {
    API_BASE_URL: 'http://localhost:2777',/*'https://localhost:7006','https://budgetwalletapi.azurewebsites.net',*/
    API_ENDPOINTS: {
      ADMIN: '/api/administration/adminPanel',
      USER: '/api/application/userPanel',
      HOME: '/api/home',
      LOGIN: '/api/identity/login',
      REGISTER: '/api/identity/register',
      GOOGLE_LOGIN: '/api/identity/googleLogin',
      SPLITS: '/api/application/splits',
      FILTER: '/api/application/filter',
      FILTER_BUDGET_PERIODS: '/api/application/filterBudgetPeriods',
      BUDGETS: '/api/application/budgets',
      BUDGET_CATEGORIES: '/api/application/budgets/{budgetId}/categories',
      BUDGET_ACCOUNTS: '/api/application/budgets/{budgetId}/accounts',
      TRANSFERS: '/api/application/transfers',
      ACCOUNTS: '/api/application/accounts',
      CATEGORIES: '/api/application/categories',
    },
    GOOGLE_CLIENT_ID: 'ADD_YOUR_GOOGLE_CLIENT_ID_HERE.apps.googleusercontent.com'
  };
  
  export default config;