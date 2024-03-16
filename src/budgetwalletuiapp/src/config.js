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
    },
    GOOGLE_CLIENT_ID: 'ADD_HERE_YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com'
  };
  
  export default config;