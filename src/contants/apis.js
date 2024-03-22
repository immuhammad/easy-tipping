// const SERVERURL = "https://1707-223-29-224-184.ngrok-free.app";
// const SERVERURL = "http://192.168.0.165:5000"; // uzairs
// const SERVERURL = "https://7a91-182-185-225-43.ngrok-free.app";
const SERVERURL = "https://easytipping.com";
// const SERVERURL = "http://192.168.1.186:5000";
// const SERVERURL = "https://d833-182-180-164-20.ngrok-free.app"; //usama ka
let testMode = false;
const STRIPEKEY = testMode
  ? "pk_test_51N3G7KH3CgfJQbH9UvRGNfeXUCzOLRTIpfmUH20uAEejjEIQGSJuQNMADI25hqwGMBMoGuWhwDtRw0dpdB4nEjer00lFEVhvvI"
  : "pk_live_51N3G7KH3CgfJQbH9oOe2zba2yBt21edBEsNMaKSVtGZnv1IxzdiZ4Y8jtIpdA7ySgl4G7K9Dlufhn8awjkJAFfco00i7lpd1YF";
//auth
const LOGIN = "auth/login";
const FORGOT_PASSWORD = "auth/forgot-password";
const RESEND_OTP = "auth/resendOTP";
const REGISTER_PAYER = "auth/register";
const VERIFY_OTP = "auth/verifyOTP";
const GET_URL = "user/upload";
const GETTEAMDETAILS = "teams/"; //update with actual url
const REGISTERUSER = "auth/register";
const SENDOTP = "auth/get-otp";
const RESENDOTP = "auth/resendOTP";
const VERIFYFORGOTOTP = "auth/verify-password-otp";
const RESETFORGOTPASSWORD = "auth/reset-password";
const GOOGLESIGNIN = "auth/google-login";
const GETTRANSACTOINS = "transactions?payerId=";
const GETSINGLEUSERDETAILS = "user/";
const APPLYFILTERS = "transactions?";
const GETMESSAGEINBOX = "message/Inbox/";
const GETCHATWITHSINGLEUSER = "message/?senderId=";
const ADDFEEDBACK = "transactionfeedback/createtransactionfeedback";
const CREATESTRIPELLINK = "integration/getConnectStripeLink";
const GETSTRIPELINK = "payee/get-stripe";
const GETPAYEEDETAILS = "payee/payee-details/";
const SAVECARD = "user/addCard";
const GETPAYDETAIL = "payee/payee-details/";
const CREATE_TRANCATION = "transactions/createtransactions";
const CARD_LISTING = "user/card-list";
const FEEDBACK_API = "transactionfeedback/createtransactionfeedback";
const GETBALANCEDETAILS = "payee/getBalance";
const GETTEAMREQUESTS = "teams/requests?teamCode=";
const GETTEAMMEMBERS = "teams/";
const SENDINVITE = "teams/send-team-invite"; ///api does not exists
const CHAT_THREADS = "user/chat/thread?page=";
const GET_SIGNLE_THREAD_CHAT = "message/getChat/?";
const SEND_MESSGAE = "message/createMessage";
const TEAMMEMBERWITHCODE = "teams/get-team-members?page=1&teamCode=";
const CHANGESTATUSMEMBER = "teams/changestatus/";
const MAKE_TEAM_ADMIN = "teams/make-team-admin";
const UPDATE_USERNAME = "user/update/";
const MAKE_PAYMENT_GUEST = "guest/make-payment-as-guest";

const TEAM_MEMEBER_DETAIL = "teams/get-team-member-profile";
const NOTIFICATIONS = "notifications";
const INITAL_SOCIAL = "auth/initial-social-login";
const REGISTER_SOCIAL_USER = "auth/social-login";
const DELETE_ACCOUNT = "user/delete/";
const CONTACT_US = "user/contact-us";
const UPDATE_BUSINESS_DETAILS = "business/";
const CHANGE_CURRENCY = "user/update-default-currency";
const GET_MY_DETAILS = "user/get-my-details";
const CREATE_PAYMENT_INTENT = "payee/create-payment-intent";
const VERIFY_PAYMENT_INTENT = "payee/verify-payment-intent";
const GET_GEO_LOCATION_CURRENCY = "user/get-currency-symbol";
const BUY_SUBSCRIPTION = "integration/create-subscription";
const GET_PAYMENT_FOR_SUBSCRIPTION = "integration/get-subscription-amount";
const GET_PAYMENT_METHOD = "integration/createSubscriptionPaymentMethod";
const CANCEL_SUBSCRIPTION = "integration/cancel-subscription";
const CHANGE_TEAM_STATUS = "user/teamjoinApproval";
const JOIN_TEAM = "teams/joinTeamRequest";
const MY_TEAMS = "teams/getAlluserTeams/";
const REMOVECARD = "user/delete-card/";
const GETBANKTOKEN = "integration/getstripeConnectedId";
const GET_CURRENT_VERSION = "admin/version/getVersion";
const ENDPOINTS = {
  STRIPEKEY,
  SERVERURL,
  LOGIN,
  FORGOT_PASSWORD,
  RESEND_OTP,
  REGISTER_PAYER,
  VERIFY_OTP,
  GET_URL,
  GETTEAMDETAILS,
  REGISTERUSER,
  SENDOTP,
  RESENDOTP,
  VERIFYFORGOTOTP,
  RESETFORGOTPASSWORD,
  GOOGLESIGNIN,
  GETTRANSACTOINS,
  GETSINGLEUSERDETAILS,
  APPLYFILTERS,
  GETMESSAGEINBOX,
  GETCHATWITHSINGLEUSER,
  ADDFEEDBACK,
  CREATESTRIPELLINK,
  GETSTRIPELINK,
  GETPAYEEDETAILS,
  SAVECARD,
  GETPAYDETAIL,
  CREATE_TRANCATION,
  CARD_LISTING,
  FEEDBACK_API,
  GETBALANCEDETAILS,
  GETTEAMREQUESTS,
  GETTEAMMEMBERS,
  SENDINVITE,
  CHAT_THREADS,
  GET_SIGNLE_THREAD_CHAT,
  SEND_MESSGAE,
  TEAMMEMBERWITHCODE,
  CHANGESTATUSMEMBER,
  MAKE_TEAM_ADMIN,
  UPDATE_USERNAME,
  MAKE_PAYMENT_GUEST,
  TEAM_MEMEBER_DETAIL,
  NOTIFICATIONS,
  INITAL_SOCIAL,
  REGISTER_SOCIAL_USER,
  DELETE_ACCOUNT,
  CONTACT_US,
  UPDATE_BUSINESS_DETAILS,
  CHANGE_CURRENCY,
  GET_MY_DETAILS,
  CREATE_PAYMENT_INTENT,
  VERIFY_PAYMENT_INTENT,
  GET_GEO_LOCATION_CURRENCY,
  BUY_SUBSCRIPTION,
  GET_PAYMENT_FOR_SUBSCRIPTION,
  GET_PAYMENT_METHOD,
  CANCEL_SUBSCRIPTION,
  CHANGE_TEAM_STATUS,
  JOIN_TEAM,
  MY_TEAMS,
  REMOVECARD,
  GETBANKTOKEN,
  GET_CURRENT_VERSION,
};

export default ENDPOINTS;
