const config = {
    API_BASE_URL: 'https://localhost:7006', /*'https://budgetwalletapi.azurewebsites.net',*/
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
      BUDGETS: '/api/application/budget',
      BUDGET_CATEGORIES: '/api/application/budget/{budgetId}/categories',
      BUDGET_ACCOUNTS: '/api/application/budget/{budgetId}/accounts',
      TRANSFERS: '/api/application/transfers',
    },
    GOOGLE_CLIENT_ID: 'ADD_YOUR_GOOGLE_CLIENT_ID_HERE.apps.googleusercontent.com'
  };
  
  export default config;