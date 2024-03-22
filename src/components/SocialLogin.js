import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  Text,
  View,
} from "react-native";
import {
  LoginManager,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
} from "react-native-fbsdk-next";
import jwt_decode from "jwt-decode";
import messaging from "@react-native-firebase/messaging";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import {
  appleAuth,
  AppleRequestOperation,
  AppleAuthRequestOperation,
} from "@invertase/react-native-apple-authentication";
import * as Animatable from "react-native-animatable";
import pixelPerfect from "../utils/pixelPerfect";
import { IMAGES } from "../contants/images";
import { googleSign, initalSocialLogin } from "../services/apis";
import { SCREEN } from "../contants/screens";
import { useIsFocused } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { saveToken, saveUser } from "../redux/slices/userSlice";
import { CommonActions } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";
import fonts from "../contants/fonts";
import { COLORS } from "../contants/colors";
import {
  widthPercentageToDP as w,
  heightPercentageToDP as h,
} from "react-native-responsive-screen";
import Alert from "../common/Alert";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { RFValue } from "react-native-responsive-fontsize";
import { useTranslation } from "react-i18next";
import TextInput from "../components/TextInput";
import Validations from "../utils/Validations";
const SocialLogin = (props) => {
  let dispatch = useDispatch();
  const { t } = useTranslation();

  const isFocused = useIsFocused();
  const [fcmToken, setFcmToken] = useState("");
  const [socailType, setSocailType] = useState("");
  const [isOn, setIson] = useState(false);
  const [teamCode, setTeamCode] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (isFocused) {
      getToken();
    }
  }, [isFocused]);
  useEffect(() => {
    logout();
  }, []);

  const logout = async () => {
    // const appleAuthRequestResponse = await appleAuth.performRequest({
    //   requestedOperation: appleAuth.Operation.LOGOUT,
    // });

    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: AppleAuthRequestOperation.LOGOUT,
      });
      // Your code here
    } catch (error) {
      console.log("error for ", error);
      // Handle errors
    }
  };

  const getToken = async () => {
    const fcmToken = await messaging().getToken();
    setFcmToken(fcmToken);
  };

  useEffect(() => {
    GoogleSignin.configure({
      scopes: ["https://www.googleapis.com/auth/userinfo.profile"],
      webClientId:
        "132235317391-lmksbidoekhljh84u7k58amum93gemrr.apps.googleusercontent.com",
      iosClientId:
        "132235317391-dctr6b3ddbdokb8qk7osnlh040i295h2.apps.googleusercontent.com",
      offlineAccess: true,
    });
  }, []);

  const _handleGoogleSignin = async (data) => {
    const socail_login = {
      idToken: data?.idToken,
      userType: "payee",
      accountType: "individual",
    };

    googleSign(socail_login)
      .then((res) => {
        if (!!res?.data?.success) {
          props.navigation.navigate(SCREEN.registerOptions, {
            isSocailLogin: true,
            data: data,
          });
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const _handleGoogleLogin = async () => {
    setIsSubmitted(true);
    if (isOn && !Validations.isValidAmmount(teamCode)) {
      return;
    }

    await GoogleSignin.signOut();
    await GoogleSignin.hasPlayServices()
      .then((response) => {
        GoogleSignin.signIn()
          .then((data) => {
            let updatedData = {
              user: {
                email: data?.user?.email,
                FName: data?.user?.givenName,
                LName: data?.user?.familyName,
              },
            };
            // _handleGoogleSignin(data);
            _handleSignIn(updatedData);
            GoogleSignin.getTokens().then((res) => {});
          })
          .catch((error) => {
            console.log(error);

            Alert(JSON.stringify(error));
          });
      })
      .catch((error) => {
        console.log(error);
        // Alert(JSON.stringify(error));
      });
  };

  const _handleFaceBookLogin = async () => {
    try {
      LoginManager.logOut();
      await LoginManager.logInWithPermissions(["public_profile", "email"])
        .then((result) => {
          if (result.isCancelled) {
            // return Promise.reject(new Error('The user cancelled the request'));
          }

          return AccessToken.getCurrentAccessToken();
        })
        .then((data) => {
          if (data === null) {
          } else {
            const responseInfoCallback = (error, result) => {
              if (error) {
                console.log(error);
              } else {
                console.log(result);
                // faceBookloginApiHit(
                //   result.email,
                //   result.first_name,
                //   result.id,
                //   result.name,
                // );
              }
            };

            const infoRequest = new GraphRequest(
              "/me",
              {
                accessToken: data.accessToken,
                parameters: {
                  fields: {
                    string: "email,name,first_name,middle_name,last_name",
                  },
                },
              },
              responseInfoCallback
            );
            new GraphRequestManager().addRequest(infoRequest).start();
          }
        })
        .then((currentUser) => {})
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {}
  };

  const isAppleAuthSupported = () => {
    return Platform.OS === "ios" && parseFloat(Platform.Version) >= 13;
  };

  const onAppleButtonPress = async () => {
    setIsSubmitted(true);
    if (isOn && !Validations.isValidAmmount(teamCode)) {
      return;
    }
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      const {
        identityToken,
        fullName,
        nonce,
        realUserStatus,
        user: appleId,
      } = appleAuthRequestResponse;

      const credentialState = await appleAuth.getCredentialStateForUser(
        appleAuthRequestResponse.user
      );

      let tokenId = appleAuthRequestResponse.identityToken;

      if (credentialState === appleAuth.State.AUTHORIZED) {
        var decoded = jwt_decode(appleAuthRequestResponse.identityToken);

        if (decoded) {
          let { email } = decoded;
          //  _handleAppleSignIn(tokenId);
          let values = {
            user: {
              email: email,
              FName: fullName?.givenName,
              LName: fullName?.familyName,
            },
          };
          _handleSignIn(values);
        }
      }
    } catch (err) {
      console.log("err", err);
    }
  };

  const _handleSignIn = async (data) => {
    const socail_login = {
      email: data?.user?.email,
      teamCode: isOn ? teamCode : null,
    };
    initalSocialLogin(socail_login)
      .then((res) => {
        if (res?.data?.data?.isAlreadyRegistered === false) {
          props.navigation.navigate(SCREEN.registerOptions, {
            isSocailLogin: true,
            data: data,
            socailType: socailType,
          });
        } else {
          dispatch(saveToken(res?.data?.data?.accessToken));
          dispatch(saveUser(res?.data?.data?.user));
          props.navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: SCREEN.bottomTab }],
            })
          );
        }
      })
      .catch((error) => {
        // console.log(e?.response);
        Alert(
          error?.response?.data?.data?.message
            ? error?.response?.data?.data?.message
            : "Something went wrong!"
        );
      });
  };

  return (
    <Animatable.View animation={"zoomIn"} style={styles.container}>
      <View style={styles.loginAsTeamContainer}>
        <Text style={styles.loginAsTeamTxt}>
          {t("Login to a Team Account")}
        </Text>

        <TouchableOpacity onPress={() => setIson(!isOn)}>
          <Image
            style={styles.offImg}
            resizeMode={"contain"}
            source={isOn ? IMAGES.onswitch : IMAGES.offswitch}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.textInputContainer}>
        {isOn && (
          <TextInput
            customInputContainer={styles.txtInput}
            value={teamCode}
            onChangeText={setTeamCode}
            placeholder={t("Team Code")}
            keyboardType={"numeric"}
            errorMessage={
              !isSubmitted
                ? ""
                : Validations.isValidAmmount(teamCode)
                ? ""
                : t("Please Enter Valid Team Code")
            }
            isMandatory={true}
          />
        )}
      </View>
      {isAppleAuthSupported() && (
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => {
            setSocailType("apple"), onAppleButtonPress();
          }}
        >
          <LinearGradient
            colors={["#000000", "#000000", "#000000"]}
            // start={{ x: 0, y: 1 }}
            // end={{ x: 1, y: 0 }}

            locations={[0.23, 0.51, 0.74]}
            useAngle={true}
            angle={125.9}
            style={[styles.socialBtn]}
          >
            <Image source={IMAGES.appleIconWhite} style={styles.icon} />
            <Text style={styles.btnTextStyle}>Sign In With Apple</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}
      <TouchableOpacity
        activeOpacity={0.5}
        style={{ marginVertical: pixelPerfect(10) }}
        onPress={() => {
          _handleGoogleLogin(), setSocailType("google");
        }}
      >
        <LinearGradient
          colors={["#fff", "#fff", "#fff"]}
          // start={{ x: 0, y: 1 }}
          // end={{ x: 1, y: 0 }}

          locations={[0.23, 0.51, 0.74]}
          useAngle={true}
          angle={125.9}
          style={[
            styles.socialBtn,
            {
              borderColor: COLORS.primary,
              borderWidth: pixelPerfect(2),
              borderRadius: h(1),
            },
          ]}
        >
          <Image source={IMAGES.googleIcon} style={styles.icon} />
          <Text style={[styles.btnTextStyle, { color: COLORS.black }]}>
            Sign In With Google
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animatable.View>
  );
};
export default SocialLogin;
const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
    // flexDirection: "row",
    width: "100%",
  },
  btn: {
    marginHorizontal: 9.3,
  },
  icon: {
    height: pixelPerfect(33),
    width: pixelPerfect(33),
  },
  socialBtn: {
    width: "100%",
    height: pixelPerfect(60),
    borderRadius: h(1),
    justifyContent: "space-evenly",
    alignItems: "center",
    alignSelf: "center",
    flexDirection: "row",
  },
  btnTextStyle: {
    color: COLORS.white,
    fontSize: pixelPerfect(22),
    fontFamily: fonts.robotosemiBold,
    textAlign: "center",
  },
  loginAsTeamContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // marginTop: pixelPerfect(-30),
    // backgroundColor: "red",
  },
  offImg: {
    width: widthPercentageToDP(15),
    height: heightPercentageToDP(5),
  },
  loginAsTeamTxt: {
    color: COLORS.primary,
    fontSize: RFValue(18),
    fontFamily: fonts.robotosemiBold,
    width: "78%",

    textAlign: "left",
  },
  textInputContainer: {
    marginBottom: pixelPerfect(10),
  },
});
