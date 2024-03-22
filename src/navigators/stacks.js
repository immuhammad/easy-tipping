//================================ React Native Imported Files ======================================//

import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  Animated,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { CurvedBottomBar } from "react-native-curved-bottom-bar";

//================================ Local Imported Files ======================================//

import Home from "../screens/home";
import { IMAGES } from "../contants/images";
import pixelPerfect from "../utils/pixelPerfect";
import Profile from "../screens/profile";
import Chat from "../screens/chat";
import Notifications from "../screens/notifications";
import fonts from "../contants/fonts";
import { COLORS } from "../contants/colors";
import { SCREEN } from "../contants/screens";
import Modal from "react-native-modal";
import { useTranslation } from "react-i18next";
import { useSelector } from "../redux/store";
import Alert from "../common/Alert";
import AlertMessage from "../components/AlertMessage";
export const BottomTab = (props) => {
  const alertMessageRef = useRef(null);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const {
    user: { isAllowedToChat, userType, accountType },
    token,
    user,
  } = useSelector((state) => state.userReducer);
  const { t, i18n } = useTranslation();
  const _handleScanIconPress = (navigate) => {
    setTimeout(() => {
      setShowPaymentOptions(false);
      navigate(SCREEN.scanQRCode, { from: "user" });
    }, 400);
  };
  const _handleEnterCodeIcon = (navigate) => {
    setShowPaymentOptions(false);
    setTimeout(() => {
      navigate(SCREEN.enterUniqueCode, { from: "user" });
    }, 400);
  };

  const _renderIcon = (routeName, selectedTab) => {
    let icon = "";
    let active = false;

    switch (routeName) {
      case "Account":
      case "Account":
        icon =
          selectedTab == "Account" ? IMAGES.homeActive : IMAGES.homeInActive;
        active = selectedTab == "Account" ? true : false;
        break;
      case "Messages":
        icon =
          selectedTab == "Messages"
            ? IMAGES.messageActive
            : IMAGES.messageInActive;
        active = selectedTab == "Messages" ? true : false;
        break;
      case "Notifications":
        icon =
          selectedTab == "Notifications"
            ? IMAGES.notificationActive
            : IMAGES.notificationInActive;
        active = selectedTab == "Notifications" ? true : false;
        break;
      case "Profile":
        icon =
          selectedTab == "Profile"
            ? IMAGES.profileActive
            : IMAGES.profileInActive;
        active = selectedTab == "Profile" ? true : false;
        break;
    }

    return (
      <View style={styles.bottomTabIcon}>
        <Image source={icon} style={styles.iconStyle} />
        <Text
          style={[
            styles.tabLabel,
            { color: active ? COLORS.primary : COLORS.inActiveTabColor },
          ]}
        >
          {t(routeName)}
        </Text>
      </View>
    );
  };
  const renderTabBar = ({ routeName, selectedTab, navigate }) => {
    return (
      <TouchableOpacity
        onPress={() =>
          routeName == "Messages" && isAllowedToChat == false
            ? Alert(
                t(
                  "You are not allowed to chat. You have been disabled by an administrator. Please contact support."
                )
              )
            : navigate(routeName)
        }
        style={styles.tabBarItem}
      >
        {_renderIcon(routeName, selectedTab)}
      </TouchableOpacity>
    );
  };
  const PaymentOptions = ({ navigate }) => {
    return (
      <Modal
        isVisible={showPaymentOptions}
        onBackdropPress={() => setShowPaymentOptions(false)}
        onBackButtonPress={() => setShowPaymentOptions(false)}
        backdropOpacity={0.6}
      >
        <View style={styles.paymentOptionsContainer}>
          <TouchableOpacity
            onPress={() => _handleScanIconPress(navigate)}
            style={{
              alignItems: "center",
              justifyContent: "space-between",
              height: "100%",
            }}
          >
            <Text
              style={{
                color: COLORS.secondary,
                fontFamily: fonts.robotosemiBold,
                fontSize: pixelPerfect(18),
                width: pixelPerfect(90.12),
              }}
            >
              {t("Scan QR")}
            </Text>
            <Image
              source={IMAGES.scanQRIcon}
              style={{
                height: pixelPerfect(90.12),
                width: pixelPerfect(90.12),
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => _handleEnterCodeIcon(navigate)}
            style={{
              alignItems: "center",
              justifyContent: "space-between",

              height: "100%",
            }}
          >
            <Text
              style={{
                color: COLORS.secondary,
                fontFamily: fonts.robotosemiBold,
                fontSize: pixelPerfect(18),
                width: pixelPerfect(90.12),
              }}
            >
              {t("Enter Code")}
            </Text>
            <Image
              source={IMAGES.enterCodeIcon}
              style={{
                height: pixelPerfect(90.12),
                width: pixelPerfect(90.12),
              }}
            />
          </TouchableOpacity>
        </View>
      </Modal>
    );
  };

  return (
    <>
      <PaymentOptions navigate={props.navigation.navigate} />
      <CurvedBottomBar.Navigator
        type="UP"
        style={styles.bottomBar}
        shadowStyle={styles.shadow}
        height={pixelPerfect(102)}
        circleWidth={50}
        bgColor="white"
        initialRouteName="title1"
        borderTopLeftRight
        screenOptions={{
          headerShown: false,
          tabBarHideOnKeyboard: Platform.OS == "ios" ? false : true,
        }}
        renderCircle={({ selectedTab, navigate }) => (
          <Animated.View style={styles.btnCircleUp}>
            <TouchableOpacity
              style={styles.button}
              // onPress={() => navigate(SCREEN.scanQRCode)}
              onPress={() =>
                accountType == "teamMember"
                  ? alertMessageRef.current.setModalVisibility(true)
                  : setShowPaymentOptions(true)
              }
            >
              <Image
                source={IMAGES.qrIcon}
                style={{
                  height: pixelPerfect(85.12),
                  width: pixelPerfect(85.12),
                  // tintColor: COLORS.secondary,
                }}
              />
            </TouchableOpacity>
          </Animated.View>
        )}
        tabBar={renderTabBar}
      >
        <CurvedBottomBar.Screen
          name={"Account"}
          position="LEFT"
          component={Home}
          options={{ tabBarBadge: 3 }}
        />
        <CurvedBottomBar.Screen
          name="Messages"
          position="LEFT"
          component={Chat}
        />

        <CurvedBottomBar.Screen
          name="Notifications"
          component={Notifications}
          position="RIGHT"
        />
        <CurvedBottomBar.Screen
          name="Profile"
          position="RIGHT"
          component={Profile}
        />
      </CurvedBottomBar.Navigator>
      <AlertMessage
        ref={alertMessageRef}
        title={t("Please login into individual account to give tip")}
        acceptTitle={t("Ok")}
        onAccept={() => alertMessageRef.current.setModalVisibility(false)}
      />
    </>
  );
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  shadow: {
    shadowColor: "#DDDDDD",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 5,
  },
  button: {
    flex: 1,
    justifyContent: "center",
  },
  bottomBar: {
    // paddingHorizontal: pixelPerfect(10),
  },
  btnCircleUp: {
    width: pixelPerfect(60),
    height: pixelPerfect(60),
    borderRadius: pixelPerfect(30),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",

    bottom: 18,
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 1,
    // },
    // shadowOpacity: 0.2,
    // shadowRadius: 1.41,
    // elevation: 1,
  },
  iconStyle: {
    height: pixelPerfect(26.87),
    width: pixelPerfect(26.87),
  },
  bottomTabIcon: {
    alignItems: "center",
    justifyContent: "center",
  },
  tabLabel: {
    fontFamily: fonts.robotoNormal,
    fontSize: pixelPerfect(16),
    color: COLORS.inActiveTabColor,
  },

  paymentOptionsContainer: {
    width: pixelPerfect(180),
    // height: pixelPerfect(80),

    position: "absolute",
    bottom: pixelPerfect(80),
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
});
