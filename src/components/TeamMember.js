//================================ React Native Imported Files ======================================//

import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ImageBackground,
  Image,
} from "react-native";

//================================ Local Imported Files ======================================//

import fonts from "../contants/fonts";
import { IMAGES } from "../contants/images";
import { COLORS } from "../contants/colors";
import pixelPerfect from "../utils/pixelPerfect";
import TransactionDetails from "./transactionDetails";
import Button from "../components/Button";
import { useTranslation } from "react-i18next";
import AppSecondaryModal from "../components/AppSecondaryModal";
import { useSelector } from "../redux/store";
const TeamMember = (props) => {
  const { item, onAccept, onReject, onRemove, onPressCard } = props;

  const {
    user: { accountType, isTeamOwner, userType, isTeamAdmin },
  } = useSelector((state) => state.userReducer);
  const modalRef = useRef(null);
  const removeUserRef = useRef(null);
  const { t } = useTranslation();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const _hanldeonReject = () => {
    modalRef.current.setModalVisibility(false);
  };
  const _handleOnAccept = () => {
    modalRef.current.setModalVisibility(false);
    props.makeAdmin(item);
  };
  return (
    <>
      {props.isRequest ? (
        <View
          style={[
            styles.mainContainerRequest,
            { backgroundColor: COLORS.white },
          ]}
        >
          <ImageBackground
            source={props?.image ? { uri: props.image } : IMAGES.placeholder}
            style={styles.imageStyle}
            imageStyle={styles.imageStyle}
            borderWidth={1}
            borderColor={COLORS.primary}
            onLoadEnd={() => setIsLoaded(true)}
            onError={() => setIsError(true)}
          >
            {isLoaded && !isError
              ? null
              : !isError && (
                  <ActivityIndicator size={"small"} color={COLORS.primary} />
                )}
          </ImageBackground>
          <View style={styles.centerStyleRequst}>
            <Text style={styles.textStyle}>
              {item?.firstName} {item?.lastName}
            </Text>
            <Text
              style={[styles.textStyle, { color: COLORS.placeholder }]}
              numberOfLines={1}
            >
              @{props.name}
            </Text>
          </View>
          <View style={styles.rightViewRequest}>
            <Button
              customeStyle={styles.smallBtnContainer}
              btnTextStyle={styles.smallBtnTxt}
              btnText={t("Accept")}
              onPress={() => onAccept(item)}
            />
            <Button
              customeStyle={styles.smallBtnReject}
              btnTextStyle={styles.smallBtnTxt}
              btnText={t("Reject")}
              onPress={() => onReject(item)}
            />
          </View>
        </View>
      ) : (
        <TouchableOpacity
          style={[
            styles.mainContainerRequest,
            { backgroundColor: COLORS.white },
          ]}
          activeOpacity={0.7}
          onPress={onPressCard}
        >
          <ImageBackground
            source={props?.image ? { uri: props.image } : IMAGES.placeholder}
            style={styles.imageStyle}
            imageStyle={styles.imageStyle}
            borderWidth={1}
            borderColor={COLORS.primary}
            onLoadEnd={() => setIsLoaded(true)}
            onError={() => setIsError(true)}
          >
            {isLoaded && !isError
              ? null
              : !isError && (
                  <ActivityIndicator size={"small"} color={COLORS.primary} />
                )}
          </ImageBackground>
          <View style={styles.centerStyleRequst}>
            <Text style={styles.textStyle} numberOfLines={1}>
              {props.name}
            </Text>
            {props?.rating && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: pixelPerfect(5),
                }}
              >
                <Image source={IMAGES.ratingStart} style={styles.ratingStyle} />
                <Text
                  style={[
                    styles.textStyle,
                    { fontFamily: fonts.robotosemiBold },
                  ]}
                >
                  {props?.rating}
                </Text>
              </View>
            )}
          </View>
          <View style={styles.rightViewRequest}>
            <Button
              customeStyle={styles.smallBtnRemove}
              btnTextStyle={styles.smallBtnTxt}
              btnText={t("Remove")}
              onPress={() => onRemove(item)}
            />
            {isTeamOwner && (
              <Button
                customeStyle={styles.smallBtnContainer}
                btnTextStyle={styles.smallBtnTxt}
                btnText={props?.isAdmin ? t("Admin") : t("Make Admin")}
                onPress={() =>
                  props?.isAdmin
                    ? console.log("already Admin")
                    : modalRef.current.setModalVisibility(true)
                }
              />
            )}
          </View>
        </TouchableOpacity>
      )}

      <AppSecondaryModal
        ref={modalRef}
        title={t("Are you sure you want to make admin?")}
        acceptTitle={t("Yes")}
        rejectTitle={t("No")}
        onAccept={_handleOnAccept}
        onReject={_hanldeonReject}
      />
    </>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    height: pixelPerfect(72),
    // width:pixelPerfect(330),
    width: "100%",
    marginBottom: pixelPerfect(12),
    borderRadius: pixelPerfect(10),
    borderWidth: 1,
    borderColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
  },
  mainContainerRequest: {
    // height: pixelPerfect(72),
    // width:pixelPerfect(330),
    width: "100%",
    marginBottom: pixelPerfect(12),
    borderRadius: pixelPerfect(10),
    borderWidth: 1,
    borderColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  imageStyle: {
    width: pixelPerfect(52),
    height: pixelPerfect(52),
    borderRadius: pixelPerfect(52),
    marginLeft: pixelPerfect(5),
    justifyContent: "center",
    alignItems: "center",
    resizeMode: "cover",
  },
  centerStyle: {
    height: pixelPerfect(72),
    width: pixelPerfect(210),
    justifyContent: "center",
    paddingHorizontal: pixelPerfect(12),
  },

  centerStyleRequst: {
    // height: pixelPerfect(72),
    width: "40%",
    justifyContent: "center",
    paddingHorizontal: pixelPerfect(12),
  },
  rightViewRequest: {
    height: pixelPerfect(72),
    width: "40%",
    paddingTop: pixelPerfect(3),
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  rightView: {
    height: pixelPerfect(72),
    // width: pixelPerfect(100),
    paddingTop: pixelPerfect(3),
    alignItems: "center",
    justifyContent: "center",

    flexDirection: "row",
  },
  ratingStyle: {
    height: pixelPerfect(12.5),
    width: pixelPerfect(12.5),
    tintColor: "#FFB33E",
  },
  textStyle: {
    fontSize: pixelPerfect(18),
    marginTop: pixelPerfect(1),
    fontFamily: fonts.robotosemiBold,
    color: COLORS.primary,
  },
  deleteIcon: {
    height: pixelPerfect(20),
    width: pixelPerfect(20),
    resizeMode: "contain",
    marginLeft: pixelPerfect(20),
  },
  smallBtnContainer: {
    height: pixelPerfect(25),
    width: pixelPerfect(130),
    // width: "80%",
    borderRadius: pixelPerfect(5),
  },
  smallBtnReject: {
    height: pixelPerfect(25),
    width: pixelPerfect(130),
    borderRadius: pixelPerfect(5),
    backgroundColor: COLORS.error,
  },
  smallBtnRemove: {
    height: pixelPerfect(25),
    width: pixelPerfect(130),
    borderRadius: pixelPerfect(5),
    backgroundColor: COLORS.secondary,
  },
  smallBtnTxt: {
    color: COLORS.white,
    fontSize: pixelPerfect(14),
    fontFamily: fonts.robotoNormal,
  },
});

export default TeamMember;
