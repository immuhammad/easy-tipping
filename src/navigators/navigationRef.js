//================================ React Native Imported Files ======================================//

import { createNavigationContainerRef } from "@react-navigation/native";
import { CommonActions } from "@react-navigation/native";
import { SCREEN } from "../contants/screens";
export const navigationRef = createNavigationContainerRef();
export function logout(name, params) {
  console.log("i am called");

  if (navigationRef.isReady()) {
    navigationRef.current.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: SCREEN.welcome }],
      })
    );

    // navigationRef.navigate(name, params);
  }
}
