import React, { useEffect } from "react";
import { View, Text, SafeAreaView, StyleSheet, Platform } from "react-native";
import { CameraScreen, Camera } from "react-native-camera-kit";
import Header from "../components/Header";

import { useTranslation } from "react-i18next";

import Alert from "../common/Alert";
import { SIZES } from "../contants/sizes";
import pixelPerfect from "../utils/pixelPerfect";

var timer = 0;
const Scanner = (props) => {
  const { t } = useTranslation();
  const handleScanCode = async (event) => {
    clearTimeout(timer);
    props.route.params.setCode(event?.nativeEvent?.codeStringValue);

    props.navigation.goBack();
  };
  useEffect(() => {
    if (Platform.OS == "ios") {
      // checkPermissionForIOS();
    }

    timer = setTimeout(() => {
      clearTimeout(timer);
      props.navigation.goBack();
    }, 15000);
    return () => clearTimeout(timer);
  }, []);

  const checkPermissionForIOS = async () => {
    const isCameraAuthorized =
      await CKCameraManager.checkDeviceCameraAuthorizationStatus();
  };

  return (
    <SafeAreaView style={styles.mainContiner}>
      <View style={{ paddingHorizontal: pixelPerfect(29) }}>
        <Header
          title={t("Scan")}
          isBackBtn={true}
          onPressBackIcon={() => props.navigation.goBack()}
        />
      </View>
      <CameraScreen
        onBottomButtonPressed={(event) => this.onBottomButtonPressed(event)}
        scanBarcode={true}
        onReadCode={(event) => handleScanCode(event)}
        hideControls={false}
        showCapturedImageCount={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContiner: {
    flex: 1,
  },
});

export default Scanner;
