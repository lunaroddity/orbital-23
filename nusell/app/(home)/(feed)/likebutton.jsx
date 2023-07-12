import React, { useState }  from "react";
import { Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function LikeButton() {
    const [liked, setLiked] = useState(false);

    return (
      <Pressable onPress={() => setLiked((isLiked) => !isLiked)}>
        <MaterialCommunityIcons
            name={liked ? "heart" : "heart-outline"}
            size={32}
            color={liked ? "red" : "black"}
        />
      </Pressable>
    );
  }