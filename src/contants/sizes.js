import {Dimensions} from 'react-native';
const {width, height} = Dimensions.get('window');
import pixelPerfect from '../utils/pixelPerfect';

export const SIZES = {
  height,
  width,
  base: pixelPerfect(8),
  text: pixelPerfect(14),
  radius: pixelPerfect(8),
  padding: pixelPerfect(20),

  // font sizes
  h1: pixelPerfect(44),
  h2: pixelPerfect(40),
  h3: pixelPerfect(30),
  h4: pixelPerfect(18),
  h5: pixelPerfect(16),
  p: pixelPerfect(12),
  icon: pixelPerfect(30),

  // button sizes
  buttonBorder: pixelPerfect(1),
  buttonRadius: pixelPerfect(8),
  socialSize: pixelPerfect(64),
  socialRadius: pixelPerfect(16),
  socialIconSize: pixelPerfect(26),

  // button shadow
  shadowOffsetWidth: pixelPerfect(0),
  shadowOffsetHeight: pixelPerfect(7),
  shadowOpacity: pixelPerfect(0.07),
  shadowRadius: pixelPerfect(4),
  elevation: pixelPerfect(2),

  // input sizes
  inputHeight: pixelPerfect(46),
  inputBorder: pixelPerfect(1),
  inputRadius: pixelPerfect(8),
  inputPadding: pixelPerfect(12),

  // card sizes
  cardRadius: pixelPerfect(16),
  cardPadding: pixelPerfect(10),

  // image sizes
  imageRadius: pixelPerfect(14),
  avatarSize: pixelPerfect(50),
  avatarRadius: pixelPerfect(50 / 2),

  // switch sizes
  switchWidth: pixelPerfect(50),
  switchHeight: pixelPerfect(24),
  switchThumb: pixelPerfect(20),

  // checkbox sizes
  checkboxWidth: pixelPerfect(18),
  checkboxHeight: pixelPerfect(18),
  checkboxRadius: pixelPerfect(5),
  checkboxIconWidth: pixelPerfect(10),
  checkboxIconHeight: pixelPerfect(8),

  // product link size
  linkSize: pixelPerfect(12),

  /** font size multiplier: for maxFontSizeMultiplier prop */
  multiplier: 2,
};
