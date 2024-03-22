import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { COLORS } from "../contants/colors";
import { SIZES } from "../contants/sizes";
import { IMAGES } from "../contants/images";
import fonts from "../contants/fonts";
import pixelPerfect from "../utils/pixelPerfect";
const Card = ({
  id,
  cardNumber,
  CardType,
  isDefault,
  cardName,
  onPress,
  onLongPress,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        styles.container,
        {
          borderWidth: 2,
          borderColor: isDefault ? COLORS.secondary : "transparent",
        },
      ]}
      onPress={() => onPress(id)}
      onLongPress={() => onLongPress(id)}
    >
      <Image style={styles.cardImage} source={IMAGES.masterCard} />
      <View style={styles.cardDetailsContainer}>
        <Text style={styles.cardName}>{cardName}</Text>
        <Text style={styles.cardNumber}>{cardNumber}</Text>
      </View>
      {isDefault && (
        <Image source={IMAGES.checkIcon} style={styles.checkIcon} />
      )}
    </TouchableOpacity>
  );
};
export default Card;
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius,
    alignItems: "center",
    marginBottom: pixelPerfect(15),
    shadowColor: COLORS.primary,
    padding: pixelPerfect(5),
    paddingHorizontal: pixelPerfect(10),
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,

    elevation: 8,
  },
  cardImage: {
    height: pixelPerfect(42),
    width: pixelPerfect(42),
    borderRadius: pixelPerfect(64),
    borderWidth: 1,
    borderColor: COLORS.primary,
    resizeMode: "contain",
  },
  cardDetailsContainer: {
    width: "75%",
    alignItems: "flex-start",
    marginLeft: pixelPerfect(10),
  },
  row: { flexDirection: "row" },
  cardName: {
    fontFamily: fonts.robotosemiBold,
    fontSize: pixelPerfect(15),
    color: COLORS.white,
    lineHeight: pixelPerfect(23),
  },
  cardNumber: {
    fontFamily: fonts.robotosemiBold,
    fontSize: pixelPerfect(15),
    color: COLORS.white,
    lineHeight: pixelPerfect(23),
  },
  checkIcon: {
    height: pixelPerfect(25),
    width: pixelPerfect(25),
    alignSelf: "center",
    tintColor: COLORS.white,
    resizeMode: "contain",
  },
});
