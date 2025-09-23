import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

export const signInWithGoogle = async () => {
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  const { data } = await GoogleSignin.signIn();
  if (!data?.idToken) throw new Error("No ID token found");

  const credential = auth.GoogleAuthProvider.credential(data.idToken);
  await auth().signInWithCredential(credential);
  return auth().currentUser;
};

export const onSignOut = async () => {
    try {
      await auth().signOut();
      await GoogleSignin.signOut();
      console.log("User signed out!");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };
