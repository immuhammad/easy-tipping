import React, { useState } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import Screen from "../components/Screen";
import { WebView } from "react-native-webview";
import Header from "../components/Header";
import { useTranslation } from "react-i18next";
import { dispatch } from "../redux/store";
import { CommonActions } from "@react-navigation/native";
import { SCREEN } from "../contants/screens";
import { COLORS } from "../contants/colors";
const WebViewScreen = (props) => {
  const { from, link, user, showHeader } = props.route.params;
  const [isLoading, setIsloading] = useState(true);
  const { t } = useTranslation();

  const _handleWebViewNavigation = (e) => {
    if (e?.url == "https://easytipping.com/myAccounts") {
      // if (from == "register") {
      props.navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: SCREEN.bottomTab }],
        })
      );
      // } else {
      //   props.navigation.goBack();
      // }
    }
  };
  return (
    <Screen>
      <View style={styles.container} renderToHardwareTextureAndroid={true}>
        {showHeader && (
          <Header
            title={t("")}
            isBackBtn={true}
            onPressBackIcon={() => props.navigation.goBack()}
          />
        )}
        {isLoading && (
          <View style={styles.activityContainer}>
            <ActivityIndicator size={"large"} color={COLORS.primary} />
          </View>
        )}
        <WebView
          source={{ uri: link }}
          style={{ opacity: 0.99, overflow: "hidden" }}
          onNavigationStateChange={(e) => _handleWebViewNavigation(e)}
          onLoadEnd={() => setIsloading(false)}
          onError={(e) => console.log("error on webView", e)}
        />
      </View>
    </Screen>
  );
};
export default WebViewScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  activityContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
