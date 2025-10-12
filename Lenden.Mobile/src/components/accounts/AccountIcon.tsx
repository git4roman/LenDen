import React from "react";
import { Image } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { RootState } from "@/src/store";

const AccountIcon: React.FC<{ size: number; color: string }> = ({
  size,
  color,
}) => {
  const pictureUrl = useSelector((state: RootState) => state.user.pictureUrl);

  if (pictureUrl)
    return (
      <Image
        source={{ uri: pictureUrl }}
        style={{ width: size, height: size, borderRadius: size / 2 }}
      />
    );

  return <FontAwesome5 name="user-alt" size={size} color={color} />;
};

export default AccountIcon;
