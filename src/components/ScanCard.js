import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  Dimensions,
} from "react-native";
import ReusableModal from "./Reuseable";
import { SIZES } from "../contants/sizes";
import { COLORS } from "../contants/colors";
import { BlurView, VibrancyView } from "@react-native-community/blur";
import fonts from "../contants/fonts";
import pixelPerfect from "../utils/pixelPerfect";
import { useTranslation } from "react-i18next";
import { IMAGES } from "../contants/images";
import CardScanner from "rn-card-scanner";
const { height, width } = Dimensions.get("window");
const ScanCard = React.forwardRef((props, ref) => {
  const { t } = useTranslation();
  const cardScannerRef = useRef(null);
  const { onCloseClick, onScan } = props;

  return (
    <ReusableModal ref={ref}>
      <View style={[styles.modalContainer]}>
        <View style={styles.scanerContainer}>
          <CardScanner
            style={{ flex: 1 }}
            didCardScan={(response) => {
              onScan(response);
            }}
            ref={cardScannerRef}
          />
        </View>
        <TouchableOpacity
          style={styles.closeBtn}
          onPress={() => {
            onCloseClick();
          }}
        >
          <Image source={IMAGES.closeIcon} style={styles.closeIcon} />
        </TouchableOpacity>
      </View>
    </ReusableModal>
  );
});
export default ScanCard;
const styles = StyleSheet.create({
  blurView: {
    width: pixelPerfect(350),
    backgroundColor: "blue",
  },

  modalContainer: {
    width: "90%",
    alignSelf: "center",
    borderRadius: SIZES.radius * 2,
    borderWidth: 2,
    borderColor: COLORS.modalBorder,
    backgroundColor: `rgba(0,0,0,0.7)`,
    padding: 0,
    overflow: "hidden",
    // width: 300,
  },
  closeBtn: {
    position: "absolute",
    right: pixelPerfect(15),
    top: pixelPerfect(15),
  },
  closeIcon: {
    height: pixelPerfect(18),
    width: pixelPerfect(18),
    resizeMode: "contain",
    tintColor: COLORS.white,
  },
  scanerContainer: {
    height: height / 2,
    width: width - 40,
    alignSelf: "center",
    overflow: "hidden",
  },
});
