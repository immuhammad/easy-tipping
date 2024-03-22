import React, { useEffect } from "react";

import { MenuProvider } from "react-native-popup-menu";
import RootStack from "./src/navigators/rootStack";
import "./src/i18n/index";
import { StripeProvider } from "@stripe/stripe-react-native";
import { Platform } from "react-native";
import Geolocation from "@react-native-community/geolocation";
import { LogBox } from "react-native";

// import crashlytics from "@react-native-firebase/crashlytics";
const App = () => {
  // useEffect(() => {
  //   crashlytics().setCrashlyticsCollectionEnabled(true);
  // }, []);
  useEffect(() => {
    LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
  }, []);

  useEffect(() => {
    if (Platform.OS == "ios") Geolocation.requestAuthorization();
    Geolocation.getCurrentPosition((info) => {});
  }, []);
  // pk_test_51N3G7KH3CgfJQbH9UvRGNfeXUCzOLRTIpfmUH20uAEejjEIQGSJuQNMADI25hqwGMBMoGuWhwDtRw0dpdB4nEjer00lFEVhvvI
  return (
    <StripeProvider
      publishableKey="pk_live_51N3G7KH3CgfJQbH9oOe2zba2yBt21edBEsNMaKSVtGZnv1IxzdiZ4Y8jtIpdA7ySgl4G7K9Dlufhn8awjkJAFfco00i7lpd1YF"
      merchantIdentifier="merchant.com.org.ObonApp.Fintech"
    >
      <MenuProvider>
        <RootStack />
      </MenuProvider>
    </StripeProvider>
  );
};
export default App;
