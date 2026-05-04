import React from 'react';
import { Animated, Text } from 'react-native';

export default function Toast({ message, animatedValue }) {
  if (!message) return null;

  return (
    <Animated.View
      pointerEvents="none"
      className="absolute bottom-9 left-5 right-5 items-center justify-center rounded-lg bg-[#4169E1] px-3.5 py-2.5"
      style={{
        opacity: animatedValue,
        transform: [
          {
            translateY: animatedValue.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }),
          },
        ],
      }}
    >
      <Text className="text-center text-sm text-white">{message}</Text>
    </Animated.View>
  );
}
