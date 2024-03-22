//================================ React Native Imported Files ======================================//

import React, { useRef, useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Image,
  Text,
  Alert as AlertNative,
  FlatList,
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
import { getMyTeams } from "../services/apis";
import { useSelector } from "react-redux";
import AppLoading from "../common/AppLoader";
import Alert from "../common/Alert";

import AppSecondaryModal from "../components/AppSecondaryModal";
import { COLORS } from "../contants/colors";
import AlertMessage from "../components/AlertMessage";
import fonts from "../contants/fonts";
import EmptyList from "../components/emptylist";

const MyTeams = (props) => {
  const modalRef = useRef(null);
  const alertMessageRef = useRef(null);
  const { t } = useTranslation();
  const { token, user } = useSelector((state) => state.userReducer);

  const [loading, setLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState("");
  const [myteams, setMyTeams] = useState([]);

  const onReject = () => {
    modalRef.current.setModalVisibility(false);
  };

  const onAccept = () => {
    modalRef.current.setModalVisibility(false);
  };

  const onJoinRequestSent = () => {
    alertMessageRef.current.setModalVisibility(false);
    setTimeout(() => {
      props.navigation.goBack();
    }, 300);
  };
  useEffect(() => {
    _getMyTeams();
  }, []);

  const _getMyTeams = () => {
    getMyTeams(token, user?.id)
      .then((res) => {
        console.log("my team are ", res.data.data.filteredData);
        setMyTeams(res.data.data.filteredData);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.log("get my teams ", error);
      });
  };

  const renderTeamItem = ({ item, index }) => {
    return (
      <View style={styles.teamItemContainer}>
        <View style={styles.row}>
          <Text style={styles.label}>{t("Team Name")}:</Text>
          <Text style={styles.value}>{item?.teamName}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>{t("Team Code")}:</Text>
          <Text style={styles.value}>{item?.teamCode}</Text>
        </View>
        <View style={{ height: pixelPerfect(10) }} />
      </View>
    );
  };

  return (
    <Screen>
      <View style={styles.container}>
        {AppLoading(loading)}
        <Header
          title={t("My Teams")}
          isBackBtn={true}
          onPressBackIcon={() => props.navigation.goBack()}
        />
        <View style={styles.teamsContainer}>
          <FlatList
            data={myteams}
            renderItem={renderTeamItem}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => (
              <View style={{ marginTop: pixelPerfect(150) }}>
                {!loading && <EmptyList />}
              </View>
            )}
          />
        </View>

        <View style={styles.btnContainer}>
          <Button
            btnText={t("Join another team")}
            onPress={() => props.navigation.navigate(SCREEN.joinMultipleTeams)}
          />
        </View>
      </View>

      <AlertMessage
        ref={alertMessageRef}
        title={alertMessage}
        acceptTitle={t("Ok")}
        onAccept={onJoinRequestSent}
      />
    </Screen>
  );
};
export default MyTeams;
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
    marginTop: pixelPerfect(0),
  },
  teamsContainer: {
    flex: 0.95,
  },

  teamItemContainer: {
    width: "99%",
    alignSelf: "center",
    borderRadius: pixelPerfect(10),
    backgroundColor: COLORS.white,
    marginTop: 20,
    marginBottom: 5,
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,

    elevation: 8,
  },
  label: {
    fontSize: pixelPerfect(18),
    fontFamily: fonts.robotoBold,
    width: "40%",
  },
  value: {
    fontSize: pixelPerfect(18),
    fontFamily: fonts.robotoNormal,
    width: "60%",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: pixelPerfect(10),
    paddingHorizontal: pixelPerfect(10),
  },
});
