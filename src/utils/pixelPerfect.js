import { create, PREDEF_RES } from "react-native-pixel-perfect";
import { Dimensions } from "react-native";
const { height, width } = Dimensions.get("window");

const pixelPerfect = (size) => {
  const designResolution = {
    width: 428,
    height: 926,
  }; //this size is the size that your design is made for (screen size)
  const perfectSize = create(designResolution);
  return perfectSize(size);
};
export default pixelPerfect;
