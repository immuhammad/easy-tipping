import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../screens/login";
import Welcome from "../screens/welcome";
import RegisterOptions from "../screens/registerOptions";
import Register from "../screens/register";
import OTPVerification from "../screens/otpVerification";
import PaymentOptions from "../screens/paymentOptions";
import ScanQRCode from "../screens/ScanQRCode";
import EnterUniqueCode from "../screens/enterUniqueCode";
import CalculateTipAmmount from "../screens/calculateTipAmount";
import { SCREEN } from "../contants/screens";
import { BottomTab } from "./stacks";
import Home from "../screens/home";
import EditProfile from "../screens/editProfile";
import ContactUs from "../screens/contactUs";
import SavedCards from "../screens/savedCards";
import AddCard from "../screens/addCard";
import Notifications from "../screens/notifications";
import ChatScreen from "../screens/chatScreen";
import RegisterAsPayee from "../screens/registerAsPayee";
import TeamMembers from "../screens/teamMembers";
import TeamMemberProfile from "../screens/teamMemberProfile";
import RecieveTips from "../screens/recieveTips";
import Subscription from "../screens/subscription";
import SplashScreen from "../screens/splash";
import SearchHistory from "../screens/searchHistory";
import ForgotPassword from "../screens/forgotPasswordEmail";
import ResetPassword from "../screens/resetPassword";
import WebViewScreen from "../screens/webView";
import Scanner from "../screens/Scan";
import StipeTermsScreen from "../screens/StripeTerms";
import BusinessDetails from "../screens/businessDetails";
import JoinMultipleTeams from "../screens/joinMulitpleTeams";
import { navigationRef } from "../navigators/navigationRef";
import MyTeams from "../screens/myTeams";
const RootStack = () => {
  const {
    login,
    register,
    registerOptions,
    otpVerification,
    welcome,
    home,
    bottomTab,
    paymentOptions,
    scanQRCode,
    enterUniqueCode,
    calculateTipAmount,
    editProfile,
    contactUs,
    savedCards,
    addCard,
    notifications,
    chatScreen,
    registerAsPayee,
    teamMember,
    teamMemberProfile,
    recieveTips,
    subscription,
    splash,
    searchHistory,
    forgotPasswordEmail,
    resetPassword,
    webView,
    QR_Scanner,
    STRIPESCREEN,
    businessDetails,
    joinMultipleTeams,
    myTeams,
  } = SCREEN;

  const MainStack = createNativeStackNavigator();
  return (
    <NavigationContainer ref={navigationRef}>
      <MainStack.Navigator
        initialRouteName={splash}
        screenOptions={{ headerShown: false }}
      >
        <MainStack.Screen component={Welcome} name={welcome} />
        <MainStack.Screen component={Login} name={login} />
        <MainStack.Screen component={Register} name={register} />
        <MainStack.Screen component={RegisterOptions} name={registerOptions} />
        <MainStack.Screen component={OTPVerification} name={otpVerification} />
        <MainStack.Screen component={BottomTab} name={bottomTab} />
        <MainStack.Screen component={PaymentOptions} name={paymentOptions} />
        <MainStack.Screen component={ScanQRCode} name={scanQRCode} />
        <MainStack.Screen component={EnterUniqueCode} name={enterUniqueCode} />
        <MainStack.Screen
          component={CalculateTipAmmount}
          name={calculateTipAmount}
        />
        <MainStack.Screen component={EditProfile} name={editProfile} />
        <MainStack.Screen component={ContactUs} name={contactUs} />
        <MainStack.Screen component={SavedCards} name={savedCards} />
        <MainStack.Screen component={AddCard} name={addCard} />
        <MainStack.Screen component={Notifications} name={notifications} />
        <MainStack.Screen component={ChatScreen} name={chatScreen} />
        <MainStack.Screen component={RegisterAsPayee} name={registerAsPayee} />
        <MainStack.Screen component={TeamMembers} name={teamMember} />
        <MainStack.Screen
          component={TeamMemberProfile}
          name={teamMemberProfile}
        />
        <MainStack.Screen component={RecieveTips} name={recieveTips} />
        <MainStack.Screen component={Subscription} name={subscription} />
        <MainStack.Screen component={SplashScreen} name={splash} />
        <MainStack.Screen component={SearchHistory} name={searchHistory} />
        <MainStack.Screen component={Scanner} name={QR_Scanner} />
        <MainStack.Screen
          component={ForgotPassword}
          name={forgotPasswordEmail}
        />
        <MainStack.Screen component={ResetPassword} name={resetPassword} />
        <MainStack.Screen component={WebViewScreen} name={webView} />
        <MainStack.Screen component={StipeTermsScreen} name={STRIPESCREEN} />
        <MainStack.Screen component={BusinessDetails} name={businessDetails} />
        <MainStack.Screen
          component={JoinMultipleTeams}
          name={joinMultipleTeams}
        />
        <MainStack.Screen component={MyTeams} name={myTeams} />
      </MainStack.Navigator>
    </NavigationContainer>
  );
};
export default RootStack;
