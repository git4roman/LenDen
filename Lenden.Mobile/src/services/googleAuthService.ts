import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

let isConfigured = false;

const configureGoogleSignin = () => {
  if (!isConfigured) {
    GoogleSignin.configure({
      offlineAccess: true,
      webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
    });
    isConfigured = true;
  }
};

export const signInWithGoogle = async () => {
  configureGoogleSignin();
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

  const { data } = await GoogleSignin.signIn();
  if (!data?.idToken) throw new Error("No ID token found");

  const credential = auth.GoogleAuthProvider.credential(data.idToken);
  await auth().signInWithCredential(credential);

  return auth().currentUser;
};

export const signOutGoogle = async () => {
  configureGoogleSignin();
  await auth().signOut();
  await GoogleSignin.signOut();  
};
