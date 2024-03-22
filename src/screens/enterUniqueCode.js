//================================ React Native Imported Files ======================================//

import React, { useRef, useState } from "react";
import { StyleSheet, View, Image } from "react-native";
import { useTranslation } from "react-i18next";
import RBSheet from "react-native-raw-bottom-sheet";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

//================================ Local Imported Files ======================================//

import Button from "../components/Button";
import { SIZES } from "../contants/sizes";
import PayeeDetails from "../components/PayeeDetails";
import TextInput from "../components/TextInput";
import Screen from "../components/Screen";
import pixelPerfect from "../utils/pixelPerfect";
import Header from "../components/Header";
import { SCREEN } from "../contants/screens";
import { getPayDetails, createBankToken } from "../services/apis";
import { useSelector } from "react-redux";
import AppLoading from "../common/AppLoader";
import Alert from "../common/Alert";
import { IMAGES } from "../contants/images";

const EnterUniqueCode = (props) => {
  const { from } = props.route.params;
  const { t } = useTranslation();
  const { token, user } = useSelector((state) => state.userReducer);
  const payeeDetailsRef = useRef(null);
  const [uniqueCode, setUniqueCode] = useState("");
  const [payeeDetails, setPayeeDetails] = useState("");
  const [loading, setLoading] = useState(false);

  const getPayeeDetails = async () => {
    if (uniqueCode === "") {
      Alert(t("Please enter unique code !"));
      return;
    }
    setLoading(true);
    await getPayDetails(token, uniqueCode)
      .then((res) => {
        setLoading(false);
        console.log("payee details ", res?.data?.data);
        if (res?.data?.data?.payee?.id == user?.id) {
          Alert(t("You can't tip your self!"));
          return;
        }
        if (res?.data?.success === true) {
          setPayeeDetails(res?.data?.data);
          payeeDetailsRef.current.open();
        }
      })
      .catch((e) => {
        setLoading(false);
        Alert(e.response.data.data.message);
      });
  };

  const onCancel = () => {
    payeeDetailsRef.current.close();
  };

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
          title={t("Enter Unique ID")}
          isBackBtn={true}
          onPressBackIcon={() => props.navigation.goBack()}
        />
        <KeyboardAwareScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          <Image source={IMAGES.logo} style={styles.logo} />
          <View style={styles.textInputContainer}>
            <TextInput
              placeholder={t("Enter Unique ID")}
              label={t("Unique ID")}
              value={uniqueCode}
              onChangeText={setUniqueCode}
              maxLength={8}
              keyboardType={"number-pad"}
            />
          </View>
          <View style={styles.btnContainer}>
            <Button btnText={t("Confirm")} onPress={getPayeeDetails} />
          </View>
        </KeyboardAwareScrollView>
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
          payName={payeeDetails?.payee?.username}
          payeeImage={payeeDetails?.payee?.profileImg}
          onCancel={onCancel}
          onConfirm={onConfirm}
          payeeDetails={payeeDetails?.payee}
        />
      </RBSheet>
    </Screen>
  );
};
export default EnterUniqueCode;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingHorizontal: pixelPerfect(29),
  },
  textInputContainer: {
    alignSelf: "center",
    marginTop: pixelPerfect(50),
    borderRadius: SIZES.radius,
    overflow: "hidden",
  },
  btnContainer: {
    marginTop: pixelPerfect(250),
  },
  logo: {
    height: pixelPerfect(255),
    width: pixelPerfect(270),
    resizeMode: "contain",
    alignSelf: "center",
    marginTop: pixelPerfect(50),
  },
});
