import {
  signOut,
  onAuthStateChanged,
  User,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithCredential,
} from "firebase/auth";
import { auth } from "@/config/firebase";
import { Platform } from "react-native";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";

WebBrowser.maybeCompleteAuthSession();

const WEB_CLIENT_ID =
  "1031883564878-cao4ot20p4i1b8d8olakq0g67icjp6sq.apps.googleusercontent.com";
const ANDROID_CLIENT_ID =
  "1031883564878-5estb0f5dc5vqi4trspr2hvs0dkf2d0l.apps.googleusercontent.com";
const IOS_CLIENT_ID = "com.jarnomommens.packopensim";

export async function signInWithGoogleWeb() {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    return { user: result.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
}

export function useGoogleAuth() {
  const redirectUri = AuthSession.makeRedirectUri({
    scheme: "packopensim",
    path: "redirect",
  });

  const [request, response, promptAsync] = Google.useAuthRequest({
    responseType: "id_token",
    androidClientId: ANDROID_CLIENT_ID,
    webClientId: WEB_CLIENT_ID,
    redirectUri,
    scopes: ["profile", "email"],
  });

  console.log("Google Auth redirect:", request?.redirectUri);

  return { request, response, promptAsync };
}

export async function signInWithGoogleNative(idToken: string) {
  try {
    const credential = GoogleAuthProvider.credential(idToken);
    const userCredential = await signInWithCredential(auth, credential);
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
}

export const isWeb = Platform.OS === "web";

export async function logOut() {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
}

export function subscribeToAuthChanges(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export function getCurrentUser() {
  return auth.currentUser;
}
