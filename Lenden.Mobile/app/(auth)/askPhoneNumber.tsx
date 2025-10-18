import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import CountryPicker, {
  CountryCode,
  Country,
} from "react-native-country-picker-modal";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { Colors } from "@/src/theme/colors";
import { axiosInstance } from "@/src/services";
import { router } from "expo-router";
import * as Crypto from "expo-crypto";

export default function AskPhoneNumber() {
  const [countryCode, setCountryCode] = useState<CountryCode>("NP");
  const [country, setCountry] = useState<Country | null>({
    callingCode: ["977"],
    cca2: "NP",
    currency: ["NPR"],
    flag: "data:image/png;base64,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",
    name: "Nepal",
    region: "Asia",
    subregion: "Southern Asia",
  });
  const [phoneNumber, setPhoneNumber] = useState("");
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const onSelect = (selectedCountry: Country) => {
    setCountryCode(selectedCountry.cca2 as CountryCode);
    setCountry(selectedCountry);
    console.log(selectedCountry);
  };

  const hashPhoneNumber = async (phone: string): Promise<string> => {
    // E.164 phone number expected
    const digest = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      phone
    );
    return digest;
  };

  const handleSubmit = async () => {
    if (!country) {
      Alert.alert("Error", "Please select your country first.");
      return;
    }

    const cleaned = phoneNumber.replace(/\D/g, ""); // remove non-digits
    const parsed = parsePhoneNumberFromString(
      cleaned,
      country.cca2 as CountryCode
    );

    if (!parsed || !parsed.isValid()) {
      Alert.alert("Invalid", "Please enter a valid phone number.");
      return;
    }

    const standardized = parsed.number; // E.164 format (+9779812345678)
    // Alert.alert("Verified", `Your standardized number:\n${standardized}`);

    const phoneHashed = await hashPhoneNumber(standardized);

    try {
      const response = await axiosInstance.post(
        "/UserApi/addPhoneNumber",
        null,
        {
          params: {
            phoneHashed,
          },
        }
      );
      if (response.status === 200) {
        Alert.alert("Success", "Phone number added successfully.");
        router.replace("/(tabs)/(groups)");
      } else {
        Alert.alert("Error", "Failed to add phone number. Please try again.");
      }
    } catch (error) {
      console.log("This is the Phone number error:", error);
      Alert.alert("Error", "An error occurred. Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <Text style={styles.title}>Verify Your Phone</Text>
        <Text style={styles.subtitle}>
          Enter your phone number with country code to proceed.
        </Text>

        <View style={styles.phoneContainer}>
          <CountryPicker
            countryCode={countryCode}
            withFlag
            withFilter
            withCallingCode
            withCallingCodeButton
            onSelect={onSelect}
            containerButtonStyle={styles.countryPicker}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone number"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
        </View>

        <TouchableOpacity
          style={[styles.submitButton, !phoneNumber && { opacity: 0.6 }]}
          onPress={handleSubmit}
          disabled={!phoneNumber}
        >
          <Text style={styles.submitButtonText}>Continue</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 20,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 30,
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  phoneContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.backgroundLight,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    width: "100%",
  },
  countryPicker: { paddingVertical: 14 },
  input: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 10,
    fontSize: 16,
    color: "#1F2937",
  },
  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    width: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  submitButtonText: {
    color: Colors.background,
    fontSize: 18,
    fontWeight: "600",
  },
});

// import { View, Text } from "react-native";
// import React from "react";

// export default function askPhoneNumber() {
//   return (
//     <View>
//       <Text>askPhoneNumber</Text>
//     </View>
//   );
// }
