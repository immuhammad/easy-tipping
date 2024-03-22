/**
 * @format
 */
import React, {useRef, useEffect} from "react";
import "react-native-gesture-handler";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import NotificationPopup from "react-native-push-notification-popup";
import store, { persistor } from "./src/redux/store";
import { AppRegistry } from "react-native";
import App from "./App";
import { name as appName } from "./app.json";
import { Text, TextInput } from "react-native";
import {IMAGES} from "./src/contants/images";
import messaging from "@react-native-firebase/messaging";
if (Text.defaultProps == null) {
  Text.defaultProps = {};
  Text.defaultProps.allowFontScaling = false;
}

if (TextInput.defaultProps == null) {
  TextInput.defaultProps = {};
  TextInput.defaultProps.allowFontScaling = false;
}


const ReduxWrapper = () => {

    let popup = useRef(null);

    useEffect(() => {
        addNotificationListener();
    }, []);

    const addNotificationListener = async () => {
        messageForeGround();
        messageBackGround();
        await messaging().requestPermission();

        messaging().onNotificationOpenedApp((remoteMessage) => {
            console.log(
                "onNotificationOpenedApp",
                remoteMessage.notification
            );
        });

        messaging()
            .getInitialNotification()
            .then((remoteMessage) => {
                console.log("getInitialNotification", remoteMessage);
            });

        // messaging().onTokenRefresh(async (token) => {
        //     let userToken = await getUserToken();
        //     if (token) {
        //         console.log(token, userToken);
        //     }
        // });
    };


    const messageForeGround = () => {
        return messaging().onMessage(async (remoteMessage) => {
            console.log("onMessageForGround ===>", remoteMessage);
            handleNotification(remoteMessage);
        });
    };

    const messageBackGround = () => {
        messaging().setBackgroundMessageHandler(async (remoteMessage) => {
            console.log("setBackgroundMessageHandler ===>", remoteMessage);
        });
    };

    const handleNotification = (remoteMessage) => {
        console.log('Enter',remoteMessage)
        popup.current.show({
            appIconSource: IMAGES.logo,
            appTitle: "Obon",
            title: remoteMessage.notification.title,
            body: remoteMessage.notification.body,
            slideOutTime: 4000,
        });
    };

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
          <NotificationPopup
              ref={popup}
              shouldChildHandleResponderStart={true}
              shouldChildHandleResponderMove={true}
          />
      </PersistGate>
    </Provider>
  );
};
AppRegistry.registerComponent(appName, () => ReduxWrapper);
