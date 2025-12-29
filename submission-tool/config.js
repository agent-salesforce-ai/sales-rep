// Submission Tool Configuration
const CONFIG = {
      // Zoho CRM API Configuration
      ZOHO_API_BASE: 'https://www.zohoapis.com/crm/v7',
      CLIENT_ID: '1000.204AI0F0FY37MEJ0SWMF2DW0DXY76E',

      // Backend API (you'll need to set up a proxy server)
      // This is needed because Zoho API requires server-side authentication
      API_BASE_URL: '/api', // Change this to your backend URL

      // File constraints
      MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB per file
      MAX_TOTAL_SIZE: 10 * 1024 * 1024, // 10MB total
      ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif', '.pdf', '.doc', '.docx'],

      // Lender criteria field mappings (deal fields -> lender requirement fields)
      CRITERIA_MAP: {
                'Time_in_Business_Years': { lenderField: 'Minimun_Time_in_business', comparison: '>=' },
                'Credit_Score': { lenderField: 'Minimun_Credit_score', comparison: '>=' },
                'NSF_Negative_Balance': { lenderField: 'Max_NSF_Negative_Balance', comparison: '<=' },
                'ADB_Avg_Daily_Balance': { lenderField: 'Min_ADB_Avg_Daily_Balance', comparison: '>=' },
                'Ownership': { lenderField: 'Min_Ownership', comparison: '>=' },
                'Deposits_Monthly': { lenderField: 'Min_Deposits_Monthly', comparison: '>=' },
                'Number_of_deposits_Monthly': { lenderField: 'Min_number_of_deposits_Monthly', comparison: '>=' }
      }
};

// Demo/Mock data for testing without backend
const DEMO_MODE = true; // Set to false when backend is ready

const MOCK_DEAL = {
      id: "3639860001235335337",
      Business_Legal_Name: "DEMO BUSINESS LLC",
      Account_Name: { label: "New Submission from Sutton- DEMO BUSINESS LLC" },
      Credit_Score: "650",
      Time_in_Business_Years: 5,
      NSF_Negative_Balance: 2,
      ADB_Avg_Daily_Balance: 15000,
      Ownership: 100,
      Deposits_Monthly: 25000,
      Number_of_deposits_Monthly: 20,
      Business_Address_State: "California",
      Industry: "Retail",
      attachments: [
        { id: "1", File_Name: "Bank-Statement-Nov-2025.pdf", Size: 524288 },
        { id: "2", File_Name: "Application-Form.pdf", Size: 184320 },
        { id: "3", File_Name: "ID-Verification.jpg", Size: 102400 }
            ]
};

const MOCK_LENDERS = [
  {
            id: "1", Vendor_Name: "Premier Funding",
            Minimun_Time_in_business: 3, Minimun_Credit_score: 550,
            Max_NSF_Negative_Balance: 5, Min_ADB_Avg_Daily_Balance: 10000,
            Min_Ownership: 51, Min_Deposits_Monthly: 15000, Min_number_of_deposits_Monthly: 10,
            Industry_Restrictions: [], State_Restrictions: [],
            email_selected: [{ email: "submissions@premierfunding.com", checked: true }]
  },
  {
            id: "2", Vendor_Name: "Capital Express",
            Minimun_Time_in_business: 6, Minimun_Credit_score: 600,
            Max_NSF_Negative_Balance: 3, Min_ADB_Avg_Daily_Balance: 20000,
            Min_Ownership: 75, Min_Deposits_Monthly: 30000, Min_number_of_deposits_Monthly: 15,
            Industry_Restrictions: ["Cannabis"], State_Restrictions: ["NY"],
            email_selected: [{ email: "deals@capitalexpress.com", checked: true }]
  },
  {
            id: "3", Vendor_Name: "Quick Fund Solutions",
            Minimun_Time_in_business: 12, Minimun_Credit_score: 500,
            Max_NSF_Negative_Balance: 8, Min_ADB_Avg_Daily_Balance: 5000,
            Min_Ownership: 51, Min_Deposits_Monthly: 10000, Min_number_of_deposits_Monthly: 8,
            Industry_Restrictions: [], State_Restrictions: [],
            email_selected: [{ email: "submit@quickfund.com", checked: true }]
  },
  {
            id: "4", Vendor_Name: "Business Growth Capital",
            Minimun_Time_in_business: 24, Minimun_Credit_score: 620,
            Max_NSF_Negative_Balance: 2, Min_ADB_Avg_Daily_Balance: 25000,
            Min_Ownership: 100, Min_Deposits_Monthly: 40000, Min_number_of_deposits_Monthly: 20,
            Industry_Restrictions: ["Gambling", "Adult"], State_Restrictions: [],
            email_selected: [{ email: "applications@bgcapital.com", checked: true }]
  },
  {
            id: "5", Vendor_Name: "Rapid Business Lending",
            Minimun_Time_in_business: 6, Minimun_Credit_score: 580,
            Max_NSF_Negative_Balance: 4, Min_ADB_Avg_Daily_Balance: 12000,
            Min_Ownership: 51, Min_Deposits_Monthly: 20000, Min_number_of_deposits_Monthly: 12,
            Industry_Restrictions: [], State_Restrictions: ["CA", "TX"],
            email_selected: [{ email: "funding@rapidbiz.com", checked: true }]
  }
  ];
