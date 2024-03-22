import React, { useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
  ScrollView,
  ImageBackground,
  Dimensions,
} from "react-native";
import { useTranslation } from "react-i18next";
import { SIZES } from "../contants/sizes";
import Button from "../components/Button";
import Screen from "../components/Screen";
import pixelPerfect from "../utils/pixelPerfect";
import Header from "../components/Header";
import { IMAGES } from "../contants/images";
import { COLORS } from "../contants/colors";
import fonts from "../contants/fonts";
import QRCode from "react-native-qrcode-svg";
import { useSelector } from "../redux/store";
import Clipboard from "@react-native-clipboard/clipboard";
import Alert from "../common/Alert";
import ViewShot from "react-native-view-shot";
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import Share from "react-native-share";
import RNFS from "react-native-fs";
import { check, PERMISSIONS, RESULTS, request } from "react-native-permissions";
import AlertMessage from "../components/AlertMessage";
const { height, width } = Dimensions.get("window");
const RecieveTips = (props) => {
  const [showCopyIcon, setShowCopyIcon] = useState(true);
  const { t } = useTranslation();
  const ref = useRef();
  const {
    user: { payeeCode },
    user,
  } = useSelector((state) => state.userReducer);

  const positions = [
    { top: height / 10, left: width / 8 },
    {
      bottom: 10,
      left: width / 8,
    },
    {
      bottom: height / 2,
      right: width / 8,
    },
    {
      top: 10,
      right: width / 8,
    },
    {
      bottom: height / 10,
      right: width / 8,
    },
  ];

  async function hasAndroidPermission() {
    if (Platform.Version >= 33) return true;
    // const permission =
    //   Platform.Version >= 33
    //     ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
    //     : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
    // let res = request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);
    // const hasPermission = await PermissionsAndroid.check(permission);
    // if (hasPermission) {
    //   return true;
    // } else {
    //   return false;
    // }

    // const status = await PermissionsAndroid.request(permission);
    // return status === "granted";

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: "Storage Permission Required",
          message: "Obon App needs access to your storage to download Photos",
        }
      );

      console.log("permission for write ", granted);
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // Once user grant the permission start downloading
        console.log("Storage Permission Granted.");
        return true;
      } else {
        alert("Storage Permission Not Granted");
      }
    } catch (err) {
      // To handle permission related exception
      console.warn(err);
    }
  }

  const _handleDownloadQRCode = async () => {
    try {
      if (Platform.OS === "android" && !(await hasAndroidPermission())) {
        return;
      }
      setShowCopyIcon(false);
      const uri = await ref.current.capture({});
      setShowCopyIcon(true);

      const customFileName = user?.businessName
        ? user?.businessName
        : user?.teamName
        ? user?.teamName
        : user?.username +
          Math.floor(Math.random() * 6000000) +
          "" +
          Math.floor(Math.random() * 6000000) +
          "QR.jpg";
      const newFilePath = `${RNFS.DocumentDirectoryPath}/${customFileName}`;
      await RNFS.moveFile(uri, newFilePath);
      console.log("Image saved with custom name:", newFilePath);
      await CameraRoll.save("file://" + newFilePath, { type: "photo" });

      // console.log("uri", uri);
      // await CameraRoll.save(uri, { type: "photo" });

      let shareImage = {
        // title: "QR Code", //string
        // message: "By scanning this QR Code you can send tips to me", //string
        url: "file://" + newFilePath,
      };
      Share.open(shareImage)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          AlertMessage("err ", err);
          err && console.log(err);
        });
    } catch (error) {
      console.log("ERROR _handleDownloadQRCode()", error);
    }
  };

  const _handleCopyText = async () => {
    const text = Clipboard.setString(
      user?.userTeam ? user?.userTeam?.payeeCode : payeeCode
    );
    Platform.OS == "ios" && Alert(t("Unique Code Copied"), "success");
  };

  return (
    <Screen>
      <View style={styles.container}>
        <Header
          title={t("QR Code")}
          isBackBtn={true}
          onPressBackIcon={() => props.navigation.goBack()}
        />
        <ScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          <ViewShot
            ref={ref}
            options={{ format: "jpg", quality: 0.9 }}
            style={{ paddingBottom: pixelPerfect(0), backgroundColor: "white" }}
          >
            <View style={{ height: pixelPerfect(20) }} />

            <Text style={styles.name}>
              {user?.businessName
                ? user?.businessName
                : user?.teamName
                ? user?.teamName
                : user?.username}
            </Text>
            <Image
              source={{
                uri: user?.businessLogoUrl
                  ? user?.businessLogoUrl
                  : user?.profileImg,
              }}
              style={styles.profilePic}
            />
            <Text style={styles.name}>{t("WANT TO GIVE A TIP")}?</Text>
            <Text style={[styles.accountType]}>
              {t("SCAN THE QR CODE WITH YOUR PHONE CAMERA")}
            </Text>

            <Text
              style={[
                styles.accountType,
                { fontSize: pixelPerfect(12), marginTop: pixelPerfect(20) },
              ]}
            >
              {t("Your tip goes directly to the recipient")}
            </Text>
            <View style={[styles.row, {}]}>
              <View style={{ marginRight: 10 }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Image
                    source={IMAGES.applePay}
                    style={[styles.icon, { marginRight: 0 }]}
                  />
                  <Text
                    style={{
                      fontFamily: fonts.robotosemiBold,
                      color: COLORS.black,
                    }}
                  >
                    Pay
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 10,
                  }}
                >
                  <Image source={IMAGES.googlePay} style={[styles.icon]} />
                  <Text
                    style={{
                      fontFamily: fonts.robotosemiBold,
                      color: COLORS.black,
                    }}
                  >
                    Pay
                  </Text>
                </View>
              </View>
              <View style={[styles.cameraContainer]}>
                <QRCode
                  size={pixelPerfect(180)}
                  value={
                    user?.userTeam
                      ? "https://easytipping.com/tip-receiver-details/" +
                        user?.userTeam?.payeeCode
                      : "https://easytipping.com/tip-receiver-details/" +
                        payeeCode
                  }
                  logo={IMAGES.qrLogo}
                  logoSize={30}
                  logoBorderRadius={10}
                  // logoBackgroundColor={"grey"}
                  logoBackgroundColor="transparent"
                />
              </View>
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  marginLeft: 10,
                }}
              >
                <Image
                  source={IMAGES.creditCardIcon}
                  style={[
                    styles.icon,
                    {
                      height: pixelPerfect(35),
                      width: pixelPerfect(45),
                      // marginHorizontal: 20,
                    },
                  ]}
                />
                <Text
                  style={{
                    fontFamily: fonts.robotosemiBold,
                    color: COLORS.black,
                  }}
                >
                  Credit Card
                </Text>
              </View>
            </View>
            {showCopyIcon && (
              <>
                <Text style={styles.orLabel}>{t("OR")}</Text>
                <Text style={styles.label}>{t("Enter Unique ID")}</Text>
                <Text
                  style={[styles.accountType, { fontSize: pixelPerfect(12) }]}
                >
                  (App download required)
                </Text>

                <View style={[styles.row, ,]}>
                  <Text style={styles.value}>
                    {user?.userTeam ? user?.userTeam?.payeeCode : payeeCode}
                  </Text>
                  {showCopyIcon && (
                    <TouchableOpacity onPress={_handleCopyText}>
                      <Image
                        source={IMAGES.copyIcon}
                        style={styles.copyIcon}
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
                  )}
                </View>
              </>
            )}

            <Image source={IMAGES.logo} style={styles.logo} />
            <Text style={styles.name}>{t("Easy Tipping App")}</Text>
            <View style={{ height: pixelPerfect(20) }} />

            <View
              style={[
                styles.row,
                {
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "space-evenly",
                },
              ]}
            >
              <View
                style={{
                  backgroundColor: COLORS.black,
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                  padding: 3,
                  borderRadius: 5,
                }}
              >
                <Image
                  source={IMAGES.appStore}
                  style={[
                    styles.icon,
                    {
                      tintColor: COLORS.white,
                      height: 30,
                      width: 20,
                      resizeMode: "contain",
                    },
                  ]}
                />
                <View>
                  <Text
                    style={{
                      color: COLORS.white,
                      fontFamily: fonts.robotosemiBold,
                      alignSelf: "center",
                      fontSize: pixelPerfect(10),
                    }}
                  >
                    Download from
                  </Text>
                  <Text
                    style={{
                      color: COLORS.white,
                      fontFamily: fonts.robotoBold,
                      alignSelf: "center",
                      fontSize: pixelPerfect(10),
                    }}
                  >
                    App Store
                  </Text>
                </View>
              </View>
              <View
                style={{
                  backgroundColor: COLORS.black,
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                  padding: 3,
                  borderRadius: 5,
                }}
              >
                <Image
                  source={IMAGES.playStore}
                  style={[
                    styles.icon,
                    { height: 30, width: 20, resizeMode: "contain" },
                  ]}
                />
                <View>
                  <Text
                    style={{
                      color: COLORS.white,
                      fontFamily: fonts.robotosemiBold,
                      alignSelf: "center",
                      fontSize: pixelPerfect(10),
                    }}
                  >
                    Download from
                  </Text>
                  <Text
                    style={{
                      color: COLORS.white,
                      fontFamily: fonts.robotoBold,
                      alignSelf: "center",
                      fontSize: pixelPerfect(10),
                    }}
                  >
                    Google Play
                  </Text>
                </View>
              </View>
            </View>
            <View style={{ height: pixelPerfect(20) }} />

            <Image
              source={IMAGES.noDataPlaceholder}
              style={{
                height: pixelPerfect(100),
                width: pixelPerfect(100),
                // height: height / 1.8,
                // width: width / 1.8,
                position: "absolute",
                top: height / 10,
                left: width / 8,
                zIndex: -10,
                resizeMode: "contain",
                opacity: 0.3,
                transform: [{ rotate: "30deg" }],
              }}
            />
            <Image
              source={IMAGES.noDataPlaceholder}
              style={{
                height: pixelPerfect(100),
                width: pixelPerfect(100),
                position: "absolute",
                bottom: 10,
                left: width / 8,
                zIndex: -10,
                resizeMode: "contain",
                opacity: 0.3,
                transform: [{ rotate: "30deg" }],
              }}
            />
            <Image
              source={IMAGES.noDataPlaceholder}
              style={{
                height: pixelPerfect(100),
                width: pixelPerfect(100),
                position: "absolute",
                bottom: height / 3,
                left: width / 8,
                zIndex: -10,
                resizeMode: "contain",
                opacity: 0.3,
                transform: [{ rotate: "30deg" }],
              }}
            />
            <Image
              source={IMAGES.noDataPlaceholder}
              style={{
                height: pixelPerfect(100),
                width: pixelPerfect(100),
                position: "absolute",
                bottom: height / 2,
                right: width / 8,
                zIndex: -10,
                resizeMode: "contain",
                opacity: 0.3,
                transform: [{ rotate: "30deg" }],
              }}
            />
            <Image
              source={IMAGES.noDataPlaceholder}
              style={{
                height: pixelPerfect(100),
                width: pixelPerfect(100),
                position: "absolute",
                top: 10,
                right: width / 8,
                zIndex: -10,
                resizeMode: "contain",
                opacity: 0.3,
                transform: [{ rotate: "30deg" }],
              }}
            />
            <Image
              source={IMAGES.noDataPlaceholder}
              style={{
                height: pixelPerfect(100),
                width: pixelPerfect(100),
                // height: height / 1.6,
                // width: width / 1.6,
                position: "absolute",
                bottom: height / 10,
                right: width / 8,
                zIndex: -10,
                resizeMode: "contain",
                opacity: 0.3,

                transform: [{ rotate: "30deg" }],
              }}
            />
          </ViewShot>
        </ScrollView>
        <View style={styles.btnContainer}>
          <Button
            btnText={t("Download QR Code")}
            onPress={_handleDownloadQRCode}
          />
        </View>
      </View>
    </Screen>
  );
};
export default RecieveTips;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    // paddingHorizontal: pixelPerfect(29),
  },
  cameraContainer: {
    // height: pixelPerfect(210),
    // width: pixelPerfect(300),
    alignSelf: "center",
    // marginTop: pixelPerfect(20),
    borderRadius: SIZES.radius,
    overflow: "hidden",
    // backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    borderWidth: 3,
    borderColor: COLORS.secondary,
  },
  btnContainer: {
    marginTop: pixelPerfect(20),
  },
  label: {
    color: COLORS.primary,
    fontFamily: fonts.robotosemiBold,
    fontSize: pixelPerfect(18),
    alignSelf: "center",
    marginTop: pixelPerfect(10),
  },
  value: {
    color: COLORS.primary,
    fontFamily: fonts.robotoNormal,
    fontSize: pixelPerfect(28),
    alignSelf: "center",
    // marginTop: pixelPerfect(15),
  },
  orLabel: {
    fontFamily: fonts.sourceSansBold,
    fontSize: pixelPerfect(22),
    marginTop: pixelPerfect(10),
    color: COLORS.secondary,
    alignSelf: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: pixelPerfect(15),
  },
  copyIcon: {
    height: pixelPerfect(30),
    width: pixelPerfect(30),
    // tintColor: COLORS.secondary,
    marginLeft: 15,
    ...Platform.select({
      android: {
        // backgroundColor: "red",
        height: pixelPerfect(25),
        width: pixelPerfect(25),
        // marginLeft: pixelPerfect(-4),
      },
    }),
  },
  logo: {
    height: pixelPerfect(135),
    width: pixelPerfect(140),
    alignSelf: "center",
    marginTop: pixelPerfect(20),
    resizeMode: "contain",
  },
  name: {
    fontFamily: fonts.robotosemiBold,
    fontSize: pixelPerfect(28),
    marginTop: pixelPerfect(20),
    color: COLORS.black,
    alignSelf: "center",
  },
  accountType: {
    fontFamily: fonts.sourceSansNormal,
    fontSize: pixelPerfect(16),
    marginTop: pixelPerfect(0),
    color: COLORS.black,
    alignSelf: "center",
  },
  profilePic: {
    height: pixelPerfect(140),
    width: pixelPerfect(140),
    // borderRadius: pixelPerfect(140),
    alignSelf: "center",
    marginTop: pixelPerfect(5),
    resizeMode: "cover",
  },
  icon: {
    height: pixelPerfect(30),
    width: pixelPerfect(40),
    alignSelf: "center",

    resizeMode: "contain",
  },
});
