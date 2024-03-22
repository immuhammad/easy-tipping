import React, { useState, useRef } from "react";
import { StyleSheet, View, Image, TouchableOpacity, Text } from "react-native";
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
import { updateUserName } from "../services/apis";
import { useSelector } from "react-redux";
import { dispatch } from "../redux/store";
import { saveUser } from "../redux/slices/userSlice";
import AppLoading from "../common/AppLoader";
import Alert from "../common/Alert";
var axios = require("axios");
import ENDPOINTS from "../contants/apis";
import Validations from "../utils/Validations";

const EditProfile = (props) => {
  const { t } = useTranslation();
  const pickImageRef = useRef(null);
  const { token, user } = useSelector((state) => state.userReducer);
  const [userName, setUserName] = useState(user?.username ?? "");
  const [pickModal, setPickModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(user?.profileImg ?? "");
  const [profileImg, setProfileImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleOpenCameraOption = () => {
    pickImageRef.current.setModalVisibility(true);
  };

  const _handlePicImage = (value) => {
    pickImageRef.current.setModalVisibility(false);
    setIsSubmitted(true);
    setSelectedImage(value.uri);
    setProfileImage(value);
  };

  const _updateUserName = async () => {
    setIsSubmitted(true);
    if (!Validations.isValidUserName(userName.trim())) return;
    try {
      setIsLoading(true);
      var formdata = new FormData();
      formdata.append("image", {
        uri: profileImg.uri,
        type: profileImg.type,
        name: profileImg.name,
      });
      if (profileImg != "") {
        doHttpPostNoAuthMultipart(formdata, ENDPOINTS.GET_URL)
          .then((res) => {
            if (res?.data?.status === "success") {
              updateName(res?.data?.imageUrl);
            }
            setIsSubmitted(false);
          })

          .catch((error) => {
            console.log("error on upload profile pic ", error);
            setIsLoading(false);
          });
      } else {
        updateName(selectedImage);
      }
    } catch (error) {
      console.log("error for uploading ins", error);
      setIsLoading(false);
      setIsSubmitted(false);
    }
  };

  const updateName = (img) => {
    const userData = {
      username: userName,
      profileImg: img,
    };

    setIsLoading(false);
    updateUserName(token, userData, user?.id)
      .then((res) => {
        setIsLoading(false);
        dispatch(saveUser(res?.data?.data?.data));
        props.navigation.goBack();
      })
      .catch((e) => {
        setIsLoading(false);
        Alert(e?.response?.data?.data?.message);
      });
  };

  return (
    <Screen>
      <View style={styles.container}>
        <Header
          title={t("Edit")}
          isBackBtn={true}
          onPressBackIcon={() => props.navigation.goBack()}
        />
        {AppLoading(isLoading)}
        <View style={styles.imageMainView}>
          <Image
            source={
              selectedImage != "" ? { uri: selectedImage } : user?.profileImg
            }
            style={styles.imageStyle}
          />
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleOpenCameraOption}
          >
            <Image source={IMAGES.pickImage} style={styles.absoluteImage} />
          </TouchableOpacity>
        </View>
        <KeyboardAwareScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          <Text
            style={{
              fontSize: pixelPerfect(16),
              color: COLORS.text,
              fontFamily: fonts.robotosemiBold,
              textAlign: "center",
              marginTop: 20,
            }}
          >
            {t(
              "This picture will be used publically under Easytipping platform transactions."
            )}
          </Text>
          <View style={styles.txtInputContainer}>
            <TextInput
              customInputContainer={styles.txtInput}
              placeholder={t("User Name")}
              value={userName}
              onChangeText={setUserName}
              label={t("Name")}
              errorMessage={
                !isSubmitted
                  ? ""
                  : Validations.isValidUserName(userName.trim())
                  ? ""
                  : t("Please Enter Valid User Name")
              }
            />
          </View>
          <View style={styles.btnContainer}>
            <Button
              customeTextStyle={{}}
              btnText={t("Save")}
              onPress={() => _updateUserName()}
            />
          </View>
        </KeyboardAwareScrollView>
      </View>
      <PickImage ref={pickImageRef} selectImage={_handlePicImage} />
    </Screen>
  );
};
export default EditProfile;
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
