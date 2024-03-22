import React from 'react';
import {StyleSheet, View} from 'react-native';
import {SIZES} from '../contants/sizes';

export default function Container({children, marginVertical}) {
  return (
    <View style={[styles.container, marginVertical && {marginVertical}]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: SIZES.padding,
  },
});
