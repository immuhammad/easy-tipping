import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import ReusableModal from "./Reuseable";
import { SIZES } from "../contants/sizes";
import { COLORS } from "../contants/colors";
import { BlurView, VibrancyView } from "@react-native-community/blur";
import fonts from "../contants/fonts";
import pixelPerfect from "../utils/pixelPerfect";
import { useTranslation } from "react-i18next";

import { IMAGES } from "../contants/images";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import ImagePicker from "react-native-image-crop-picker";
import TextRecognition from "react-native-text-recognition";

const PickImage = React.forwardRef((props, ref) => {
  const { onCloseClick, selectImage } = props;
  const { t } = useTranslation();

  const [selected, setSelected] = useState(1);
  const _closeModal = () => {
    ref.current.setModalVisibility(false);
  };

  let options = {
    mediaType: "photo",
    selectionLimit: 1,
  };

  const ImagePickerFromGallery = () => {
    // launchImageLibrary(options, (res) => {
    //   if (res.didCancel) {
    //   } else if (res.errorMessage) {
    //   } else {
    //     console.log("image res", res);
    //     const image = {
    //       uri: res?.assets[0]?.uri,
    //       type: res?.assets[0]?.type,
    //       name: res?.assets[0]?.fileName,
    //     };
    //     props.selectImage(image);
    //   }
    // });

    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
      cropperCircleOverlay: true,
    })
      .then(async (image) => {
        const result = await TextRecognition.recognize(image?.path);

        const parts = image?.path.split("/");
        const image1 = {
          uri: image?.path,
          type: image?.mime,
          name: parts[parts.length - 1],
        };

        props.selectImage(image1);
      })
      .catch((error) => {
        console.log("error ", error);
      });
  };

  const ImagePickerFromCamera = () => {
    // launchCamera(options, (res) => {
    //   if (res.didCancel) {
    //   } else if (res.errorMessage) {
    //   } else {
    //     const image = {
    //       uri: res?.assets[0]?.uri,
    //       type: res?.assets[0]?.type,
    //       name: res?.assets[0]?.fileName,
    //     };
    //     props.selectImage(image);
    //   }
    // });

    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
      cropperCircleOverlay: true,
    }).then(async (image) => {
      const result = await TextRecognition.recognize(image?.path);

      const parts = image?.path.split("/");
      const image1 = {
        uri: image?.path,
        type: image?.mime,
        name: parts[parts.length - 1],
      };

      props.selectImage(image1);
    });
  };

  return (
    <ReusableModal ref={ref}>
      <View style={styles.modalContainer}>
        <View style={styles.container}>
          <View style={styles.row}>
            <View style={styles.option}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  ImagePickerFromGallery();
                }}
              >
                <Image source={IMAGES.galleryIcon} style={styles.cameraIcon} />
              </TouchableOpacity>
              <Text style={styles.label}>{t("Choose from gallery")}</Text>
            </View>
            <View>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  ImagePickerFromCamera();
                }}
              >
                <Image source={IMAGES.cameraIcon} style={styles.cameraIcon} />
              </TouchableOpacity>
              <Text style={styles.label}>{t("Take Photo")}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.closeBtn} onPress={_closeModal}>
            <Image source={IMAGES.closeIcon} style={styles.closeIcon} />
          </TouchableOpacity>
        </View>
      </View>
    </ReusableModal>
  );
});
export default PickImage;
const styles = StyleSheet.create({
  modalContainer: {
    width: "90%",
    alignSelf: "center",
    borderRadius: SIZES.radius * 2,
    borderWidth: 2,
    borderColor: COLORS.modalBorder,
    width: "90%",
    alignSelf: "center",
    borderRadius: SIZES.radius * 2,
    borderWidth: 2,
    borderColor: COLORS.modalBorder,
    backgroundColor: `rgba(0,0,0,0.7)`,
    padding: 0,
  },
  container: {
    padding: pixelPerfect(20),
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",

    width: "100%",
  },
  cameraIcon: {
    height: pixelPerfect(75),
    width: pixelPerfect(75),
  },
  label: {
    color: COLORS.white,
    fontFamily: fonts.robotoBold,
    fontSize: pixelPerfect(13),
    marginTop: pixelPerfect(10),
  },
  option: {
    alignItems: "center",
    justifyContent: "center",
  },
  closeBtn: {
    position: "absolute",
    right: pixelPerfect(15),
    top: pixelPerfect(15),
  },
  closeIcon: {
    height: pixelPerfect(20),
    width: pixelPerfect(20),
    resizeMode: "contain",
    tintColor: COLORS.white,
  },
});
