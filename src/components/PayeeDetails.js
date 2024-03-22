import React from "react";
import { View, StyleSheet, Dimensions, Text } from "react-native";
import pixelPerfect from "../utils/pixelPerfect";
import { SIZES } from "../contants/sizes";
import { COLORS } from "../contants/colors";
import ImageLoad from "./LoadImage";
import fonts from "../contants/fonts";

import Button from "../components/Button";
import { useTranslation } from "react-i18next";
import StarRating from "react-native-star-rating";
const PayeeDetails = ({
  isLoadind,
  payeeDetails,
  onConfirm,
  onCancel,
  payName,
  payeeImage,
}) => {
  const { t } = useTranslation();

  function roundToNearestHalf(value) {
    const decimalPart = value - Math.floor(value); // Get the decimal part
    if (decimalPart < 0.5) {
      return Math.floor(value); // Round down to the nearest 0.5
    } else {
      return Math.floor(value) + 0.5; // Round up to the nearest 0.5
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.userDetailsContainer}>
        <View style={styles.userContainer}>
          <View style={styles.row}>
            <ImageLoad image={{ uri: payeeImage }} />
            <View style={styles.payeeInfoContainer}>
              <Text style={styles.payeeName}>{payName}</Text>

              {payeeDetails?.accountType == "business" && (
                <View style={styles.businessDetailsContainer}>
                  {!payeeDetails?.businessLogoUrl && (
                    <ImageLoad
                      customeStyle={styles.companyLogo}
                      image={{
                        uri: "https://cdn.pixabay.com/photo/2014/02/27/16/10/flowers-276014_1280.jpg",
                      }}
                    />
                  )}
                  <Text style={styles.businessName} numberOfLines={1}>
                    {payeeDetails?.businessName}
                  </Text>
                </View>
              )}
            </View>
            <View style={[styles.row]}>
              <View>
                <StarRating
                  disabled={true}
                  maxStars={5}
                  rating={roundToNearestHalf(
                    payeeDetails?.rating ? payeeDetails?.rating : 0
                  )}
                  // rating={3.2}
                  starSize={pixelPerfect(15)}
                  emptyStarColor={COLORS.gray}
                  fullStarColor={"#FFB33E"}
                  // containerStyle={{ marginTop: pixelPerfect(10) }}
                />
              </View>
              <Text
                style={[
                  styles.ratingTextStyle,
                  { fontFamily: fonts.robotosemiBold },
                ]}
              >
                ({payeeDetails?.rating ? payeeDetails?.rating : 0})
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.btnContainer}>
        <Button
          btnText={t("Confirm")}
          customeStyle={styles.btn}
          onPress={onConfirm}
        />
        <Button
          btnText={t("Cancel")}
          customeStyle={styles.btn}
          onPress={onCancel}
        />
      </View>
    </View>
  );
};
export default PayeeDetails;
const styles = StyleSheet.create({
  container: {
    height: pixelPerfect(200),
    width: Dimensions.get("window").width,
  },
  userDetailsContainer: {
    borderRadius: SIZES.radius,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
    borderWidth: pixelPerfect(1),
    marginHorizontal: pixelPerfect(29),
    padding: pixelPerfect(10),
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,

    elevation: 8,
  },
  userContainer: {},
  row: { flexDirection: "row", alignItems: "center" },
  payeeName: {
    fontFamily: fonts.sourceSansSemiBold,
    fontSize: pixelPerfect(22),
    color: COLORS.primary,
  },
  payeeInfoContainer: {
    marginLeft: 15,

    width: "48%",
  },
  companyLogo: {
    height: pixelPerfect(30),
    width: pixelPerfect(30),
    resizeMode: "cover",
    marginRight: 5,
    marginLeft: 0,
    // marginTop: pixelPerfect(2),
  },
  ratingStyle: {
    height: pixelPerfect(18.5),
    width: pixelPerfect(18.5),
    tintColor: "#FFB33E",
  },
  ratingTextStyle: {
    fontSize: pixelPerfect(18),
    marginTop: pixelPerfect(1),
    fontFamily: fonts.robotosemiBold,
    color: COLORS.primary,
    tintColor: "#FFB33E",
  },
  btnContainer: {
    paddingHorizontal: pixelPerfect(29),
    paddingBottom: pixelPerfect(15),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  btn: {
    marginTop: pixelPerfect(45),
    width: pixelPerfect(120),
    height: pixelPerfect(40),
  },
  businessDetailsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: pixelPerfect(10),
    justifyContent: "flex-start",
  },
  businessName: {
    fontSize: pixelPerfect(18),
    color: COLORS.placeholder,
    fontFamily: fonts.robotosemiBold,
    // marginLeft: 10,
  },
});
