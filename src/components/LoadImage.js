import React, { useState } from "react";
import { ImageBackground, ActivityIndicator } from "react-native";
import propTypes from "prop-types";
import { IMAGES } from "../contants/images";
import pixelPerfect from "../utils/pixelPerfect";
import { COLORS } from "../contants/colors";
const ImageLoad = (props) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  return (
    <ImageBackground
      source={props?.image ? props.image : IMAGES.placeholder}
      style={[props.imageStyle, { ...props.customeStyle }]}
      imageStyle={[props.imageStyle, { ...props.customeStyle }]}
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
  );
};
export default ImageLoad;
ImageLoad.propTypes = {
  source: propTypes.string,
  style: propTypes.object,
  customeStyle: propTypes.object,
  imageStyle: propTypes.object,
};

ImageLoad.defaultProps = {
  source: IMAGES.placeholder,
  style: {
    width: pixelPerfect(52),
    height: pixelPerfect(52),
    borderRadius: pixelPerfect(52),
    marginLeft: pixelPerfect(5),
    justifyContent: "center",
    alignItems: "center",
    resizeMode: "cover",
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
  customeStyle: {},
};
