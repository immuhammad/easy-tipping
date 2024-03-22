import React, { Component } from "react";
import { StyleSheet } from "react-native";
import Modal from "react-native-modal";
import * as Animatable from "react-native-animatable";
class ReusableModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: false,
    };
  }

  setModalVisibility = (isModalVisible) => {
    this.setState({ isModalVisible });
  };

  render() {
    const { children, ...rest } = this.props;
    const { isModalVisible } = this.state;
    return (
      <Modal
        hideModalContentWhileAnimating
        backdropOpacity={0.9}
        backdropColor={"rgba(0, 0, 0, 0.7)"}
        useNativeDriver
        isVisible={isModalVisible}
        style={styles.container}
        animationIn="slideInUp"
        animationInTiming={300}
        onBackButtonPress={this.setModalVisibility}
        onBackdropPress={() => this.setModalVisibility(false)}
        {...rest}
        animationOut="fadeOut"
        animationOutTiming={300}
        avoidKeyboard={true}
      >
        <Animatable.View
          animation="zoomIn"
          duration={1000}
          style={styles.innerModal}
        >
          {children}
        </Animatable.View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 0,
  },
  innerModal: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
});

export default ReusableModal;
