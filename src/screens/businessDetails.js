import React, { useState, useRef } from "react";
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { doHttpPostNoAuthMultipart } from "../services/HttpUtils";
import { useTranslation } from "react-i18next";
import fonts from "../contants/fonts";
import { IMAGES } from "../contants/images";
import { COLORS } from "../contants/colors";
import Button from "../components/Button";
import Screen from "../components/Screen";
import Header from "../components/Header";
import TextInput from "../components/TextInput";
import pixelPerfect from "../utils/pixelPerfect";
import PickImage from "../components/pickImage";
import { updateBusinessDetails } from "../services/apis";
import { useSelector } from "react-redux";
import { dispatch } from "../redux/store";
import { saveUser } from "../redux/slices/userSlice";
import AppLoading from "../common/AppLoader";

import ENDPOINTS from "../contants/apis";
import Validations from "../utils/Validations";
import { launchImageLibrary } from "react-native-image-picker";

const BusinessDetails = (props) => {
  const { t } = useTranslation();
  const pickImageRef = useRef(null);
  const { token, user } = useSelector((state) => state.userReducer);

  const [businessName, setBusinessName] = useState(user?.businessName ?? "");
  const [profileImg, setProfileImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [businessLogo, setBusinessLogo] = useState(
    user?.businessLogoUrl ?? null
  );
  const [isSubmitted, setIsSubmitted] = useState(false);
  const imagePickerFromGallery = () => {
    let options = {
      mediaType: "photo",
      selectionLimit: 1,
    };
    launchImageLibrary(options, (res) => {
      if (res.didCancel) {
      } else if (res.errorMessage) {
      } else {
        const image = {
          uri: res?.assets[0]?.uri,
          type: res?.assets[0]?.type,
          name: res?.assets[0]?.fileName,
        };
        setBusinessLogo(image?.uri);
        setProfileImage(image);
      }
    });
  };

  const _updateBusinessDetails = async () => {
    setIsSubmitted(true);
    if (!Validations.isValidName(businessName)) return;
    setIsSubmitted(true);
    setIsLoading(true);
    var formdata = new FormData();
    formdata.append("image", {
      uri: profileImg.uri,
      type: profileImg.type,
      name: profileImg.name,
    });
    if (profileImg != "") {
      doHttpPostNoAuthMultipart(formdata, ENDPOINTS.GET_URL).then((res) => {
        if (res?.data?.status === "success") {
          updateDetails(res?.data?.imageUrl);
        }
      });
    } else {
      updateDetails(businessLogo);
    }
  };

  const updateDetails = (image) => {
    const data = { businessLogoUrl: image, businessName: businessName };
    updateBusinessDetails(token, data, user?.id)
      .then((res) => {
        setIsLoading(false);
        dispatch(
          saveUser({
            ...user,
            businessName: businessName,
            businessLogoUrl: image,
          })
        );
        props.navigation.goBack();
      })
      .catch((error) => {
        setIsLoading(false);
        Alert(
          error?.response?.data?.data?.message
            ? error?.response?.data?.data?.message
            : "Something went wrong!"
        );
      });
  };

  return (
    <Screen>
      <View style={styles.container}>
        <Header
          title={t("Business Details")}
          isBackBtn={true}
          onPressBackIcon={() => props.navigation.goBack()}
        />
        {AppLoading(isLoading)}
        <View style={styles.imageMainView}>
          <Image
            source={businessLogo != null ? { uri: businessLogo } : { uri: "" }}
            style={styles.imageStyle}
          />
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={imagePickerFromGallery}
          >
            <Image source={IMAGES.pickImage} style={styles.absoluteImage} />
          </TouchableOpacity>
        </View>
        <KeyboardAwareScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.txtInputContainer}>
            <TextInput
              customInputContainer={styles.txtInput}
              placeholder={t("Business Name")}
              value={businessName}
              onChangeText={setBusinessName}
              label={t("Business Name")}
              errorMessage={
                !isSubmitted
                  ? ""
                  : Validations.isValidName(businessName)
                  ? ""
                  : "Please Enter Valid Business Name"
              }
            />
          </View>
          <View style={styles.btnContainer}>
            <Button
              customeTextStyle={{}}
              btnText={t("Save")}
              onPress={_updateBusinessDetails}
            />
          </View>
        </KeyboardAwareScrollView>
      </View>
    </Screen>
  );
};
export default BusinessDetails;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingHorizontal: pixelPerfect(29),
  },
  txtInputContainer: {
    marginTop: pixelPerfect(30),
  },
  txtInput: {
    // marginTop: pixelPerfect(15),
  },
  forgotPasswordContainer: {
    marginTop: pixelPerfect(15),
    alignItems: "flex-end",
  },
  forgotPassTxt: {
    fontFamily: fonts.robotosemiBold,
    fontSize: pixelPerfect(12),
    color: COLORS.secondary,
  },
  btnContainer: {
    marginTop: pixelPerfect(151),
  },
  imageStyle: {
    height: pixelPerfect(139),
    width: pixelPerfect(139),
    borderRadius: pixelPerfect(139),
    borderWidth: 1,
    borderColor: COLORS.primary,
    alignSelf: "center",
  },
  signupTxt: {
    fontFamily: fonts.robotosemiBold,
    fontSize: pixelPerfect(12),
    color: COLORS.secondary,
    marginTop: pixelPerfect(15),
  },
  underLine: {
    textDecorationLine: "underline",
  },
  imageMainView: {
    height: pixelPerfect(139),
    width: pixelPerfect(139),
    marginTop: pixelPerfect(71),
    alignSelf: "center",
  },
  absoluteImage: {
    height: pixelPerfect(32),
    width: pixelPerfect(32),
    position: "absolute",
    bottom: 4,
    right: 4,
  },
});
