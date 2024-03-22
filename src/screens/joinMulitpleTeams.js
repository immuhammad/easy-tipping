//================================ React Native Imported Files ======================================//

import React, { useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  Text,
  Alert as AlertNative,
} from "react-native";
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
import { getTeamDetails, joinTeamRequest } from "../services/apis";
import { useSelector } from "react-redux";
import AppLoading from "../common/AppLoader";
import Alert from "../common/Alert";
import { IMAGES } from "../contants/images";
import Validations from "../utils/Validations";
import AppSecondaryModal from "../components/AppSecondaryModal";
import { COLORS } from "../contants/colors";
import AlertMessage from "../components/AlertMessage";
const JoinMultipleTeams = (props) => {
  const modalRef = useRef(null);
  const alertMessageRef = useRef(null);
  const { t } = useTranslation();
  const { token, user } = useSelector((state) => state.userReducer);

  const payeeDetailsRef = useRef(null);
  const [teamCode, setTeamCode] = useState("");
  const [teamDetails, setTeamDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const _getTeamDetails = async () => {
    if (teamCode === "" || !Validations.isValidAmmount(teamCode)) {
      Alert(t("Please Enter Valid Team Code"));
      return;
    }

    setLoading(true);
    getTeamDetails(teamCode)
      .then((res) => {
        setLoading(false);
        setTeamDetails(res?.data?.data?.team);
        modalRef.current.setModalVisibility(true);
      })
      .catch((error) => {
        setLoading(false);
        Alert(
          error?.response?.data?.data?.message
            ? error?.response?.data?.data?.message
            : "Something went wrong!"
        );
      });
  };

  const onReject = () => {
    modalRef.current.setModalVisibility(false);
  };

  const onAccept = () => {
    modalRef.current.setModalVisibility(false);
    const data = {
      teamCode: teamDetails?.teamCode,
      userId: user?.id,
    };

    setLoading(true);

    joinTeamRequest(token, data)
      .then((res) => {
        setAlertMessage(
          t(
            "Your request has been sent to the team admin. Please wait for your request to be approved."
          )
        );
        setTimeout(() => {
          alertMessageRef.current.setModalVisibility(true);
        }, 400);

        // AlertNative.alert(
        //   "Signup Successful",
        //   "Your request has been sent to the team admin. Please wait for your request to be approved.",
        //   [
        //     {
        //       text: "OK",
        //       onPress: () => {
        //         props.navigation.goBack();
        //       },
        //     },
        //   ],
        //   { cancelable: false }
        // );
        setLoading(false);
      })
      .catch((error) => {
        Alert(
          error?.response?.data?.data?.message
            ? error?.response?.data?.data?.message
            : "Something went wrong!"
        );
        setLoading(false);
      });
  };

  const onJoinRequestSent = () => {
    alertMessageRef.current.setModalVisibility(false);
    setTimeout(() => {
      props.navigation.goBack();
      props.navigation.goBack();
    }, 300);
  };

  return (
    <Screen>
      <View style={styles.container}>
        {AppLoading(loading)}
        <Header
          title={t("Team Code")}
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
              placeholder={t("Team Code")}
              label={t("Team Code")}
              value={teamCode}
              onChangeText={setTeamCode}
              maxLength={5}
              keyboardType={"number-pad"}
            />
          </View>
          <View style={styles.btnContainer}>
            <Button btnText={t("Confirm")} onPress={_getTeamDetails} />
          </View>
        </KeyboardAwareScrollView>
      </View>
      <AppSecondaryModal
        onAccept={onAccept}
        onReject={onReject}
        ref={modalRef}
        title={
          <Text>
            {t("Are you sure you want to join")}{" "}
            <Text style={{ color: COLORS.secondary }}>
              {teamDetails?.teamName}
            </Text>{" "}
            {t("team?")}
          </Text>
        }
        acceptTitle="Yes"
        rejectTitle="No"
      />
      <AlertMessage
        ref={alertMessageRef}
        title={alertMessage}
        acceptTitle={t("Ok")}
        onAccept={onJoinRequestSent}
      />
    </Screen>
  );
};
export default JoinMultipleTeams;
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
