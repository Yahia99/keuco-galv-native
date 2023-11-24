import React from "react";
import { StyleSheet, Text, View } from "react-native";

function Counter({ scan }: { scan: number }) {
  return (
    <View style={styles.counter}>
      <Text style={{ fontSize: 75, color: "#FFF" }}>{scan}</Text>
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
  },
});

export default Counter;
