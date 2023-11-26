import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Counter({ anzScans }: { anzScans: number }) {
  return (
    <View style={styles.counter}>
      <Text style={{ fontSize: 75, color: "#FFF" }}>{anzScans}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  counter: {
    backgroundColor: "steelblue",
    padding: 10,
    borderRadius: 10,
    width: 200,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    elevation: 20,
  },
});
