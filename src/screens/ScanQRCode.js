//================================ React Native Imported Files ======================================//

import React, { useRef, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  PermissionsAndroid,
  Platform,
  Alert as AlertMessage,
  Linking,
} from "react-native";
import { useTranslation } from "react-i18next";
import { CameraScreen } from "react-native-camera-kit";
import RBSheet from "react-native-raw-bottom-sheet";

//================================ Local Imported Files ======================================//

import { SIZES } from "../contants/sizes";
import PayeeDetails from "../components/PayeeDetails";
import { SCREEN } from "../contants/screens";
import Button from "../components/Button";
import Screen from "../components/Screen";
import pixelPerfect from "../utils/pixelPerfect";
import Header from "../components/Header";
import { IMAGES } from "../contants/images";
import { useSelector } from "react-redux";
import { getPayDetails, createBankToken } from "../services/apis";
import AppLoading from "../common/AppLoader";
import Alert from "../common/Alert";

import { check, PERMISSIONS, RESULTS, request } from "react-native-permissions";

const ScanQRCode = (props) => {
  const { from } = props.route.params;
  const { t } = useTranslation();
  const { token, user } = useSelector((state) => state.userReducer);
  const payeeDetailsRef = useRef(null);
  const [payeeDetails, setPayeeDetails] = useState({});
  const [loading, setLoading] = useState(false);

  const handleScanCode = async (data) => {
    const parts = data.split("/"); //link from qr code
    const uniqueCode = parts[parts.length - 1]; //split unique code

    setLoading(true);

    await getPayDetails(token, uniqueCode)
      .then((res) => {
        setLoading(false);
        if (res?.data?.data?.payee?.id == user?.id) {
          Alert(t("You can't tip your self!"));
          return;
        }

        if (res?.data?.success === true) {
          setPayeeDetails(res?.data?.data);
          setTimeout(() => {
            payeeDetailsRef.current.open();
          }, 500);
        }
      })
      .catch((e) => {
        setLoading(false);
        console.log("error", e);
        Alert(e?.response?.data?.data?.message);
      });
  };

  const _handlePermissions = async () => {
    if (Platform.OS === "android") {
      if (!(await requestCameraPermission())) return;
      props.navigation.navigate(SCREEN.QR_Scanner, {
        setCode: handleScanCode,
      });
    } else {
      request(PERMISSIONS.IOS.CAMERA)
        .then((e) => {
          if (e == "granted") {
            props.navigation.navigate(SCREEN.QR_Scanner, {
              setCode: handleScanCode,
            });
          } else {
            AlertMessage.alert(
              t("Camera Access Blocked"),
              t(
                "To use this feature, please grant access to your camera in your device settings."
              ),
              [
                {
                  text: t("Cancel"),
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel",
                },
                { text: t("Ok"), onPress: () => Linking.openSettings() },
              ]
            );
          }
        })
        .catch((error) => {
          console.log("error on permission ", error);
        });
    }
  };

  async function requestCameraPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "Camera Permission",
          message: "Your app needs camera permission scan QR code.",
          buttonPositive: "OK",
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Camera permission granted.");
        return true;
        // You can access the camera here
      } else {
        console.log("Camera permission denied.");
        return false;
      }
    } catch (error) {
      console.log("Error while requesting camera permission:", error);
      return false;
    }
  }

  const getConnectId = async () => {
    console.log("payee details ", payeeDetails);
    setLoading(true);
    createBankToken(
      null,
      payeeDetails?.payee?.id ?? null,
      payeeDetails?.payee?.teamId ?? null
    )
      .then((res) => {
        setLoading(false);

        if (res?.data?.data?.user?.stripeConnectedAccountId) {
          props.navigation.navigate(SCREEN.calculateTipAmount, {
            payeeId: payeeDetails?.payee?.id,
            from: from,
            payeeDetails: payeeDetails?.payee,
            connectAccountId: res?.data?.data?.user?.stripeConnectedAccountId,
          });
        }
      })
      .catch((error) => {
        setLoading(false);
        console.log("connected Id error ", error);
      });
  };

  const onConfirm = () => {
    payeeDetailsRef.current.close();
    getConnectId();
  };

  return (
    <Screen>
      <View style={styles.container}>
        {AppLoading(loading)}
        <Header
          title={t("Scan QR Code")}
          isBackBtn={true}
          onPressBackIcon={() => props.navigation.goBack()}
        />
        <View style={styles.cameraContainer}>
          <Image
            source={IMAGES.scanImage}
            style={{ height: "100%", width: "100%" }}
          />
        </View>
        <View style={styles.btnContainer}>
          <Button onPress={() => _handlePermissions()} btnText={t("Scan")} />
        </View>
      </View>
      <RBSheet
        ref={payeeDetailsRef}
        height={300}
        openDuration={250}
        customStyles={{
          container: {
            justifyContent: "center",
            alignItems: "center",
          },
        }}
      >
        <PayeeDetails
          onConfirm={onConfirm}
          payeeDetails={payeeDetails?.payee}
          payName={payeeDetails?.payee?.username}
          payeeImage={payeeDetails?.payee?.profileImg}
          onCancel={() => {
            payeeDetailsRef.current.close();
          }}
        />
      </RBSheet>
    </Screen>
  );
};
export default ScanQRCode;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingHorizontal: pixelPerfect(29),
  },
  cameraContainer: {
    height: pixelPerfect(300),
    width: pixelPerfect(300),
    alignSelf: "center",
    marginTop: pixelPerfect(100),
    borderRadius: SIZES.radius,
    overflow: "hidden",
  },
  btnContainer: {
    marginTop: pixelPerfect(150),
  },
});
