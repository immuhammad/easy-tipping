import React from 'react';
import {Text, StyleSheet} from 'react-native';
import pixelPerfect from '../utils/pixelPerfect';
import fonts from '../contants/fonts';
import {COLORS} from '../contants/colors';
const H1 = ({text, customStyle, numberOfLines}) => {
  return (
    <Text style={[styles.h2, {...customStyle}]} numberOfLines={numberOfLines}>
      {text}
    </Text>
  );
};
export default H1;
const styles = StyleSheet.create({
  h2: {
    fontSize: pixelPerfect(20),
    fontFamily: fonts.robotosemiBold,
    color: COLORS.primary,
  },
});
