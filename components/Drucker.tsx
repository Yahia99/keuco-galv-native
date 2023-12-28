import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Modal,
  ActivityIndicator,
  ToastAndroid,
  Alert,
  FlatList,
} from "react-native";
import axios from "axios";

// Type
type DruckerType = {
  isModalVisible: boolean;
  setIsModalVisible: (bool: boolean) => void;
  data: {
    name: string;
    display: string;
    path: string;
  }[];
  params: () => {
    rmNr?: string;
    teileNr?: string;
    menge?: string;
    tr?: string;
    anzScans?: string;
  };
};

export default function Drucker({
  isModalVisible,
  setIsModalVisible,
  data,
  params,
}: DruckerType) {
  // States
  const [isLoading, setIsLoading] = useState<{ index: number }>({ index: 0 });
  // Getting params from previous page
  const { rmNr, teileNr, menge, tr, anzScans } = params();
  const controller = new AbortController();
  // Sending POST request
  const sendPrintReq = async (druckerNum: number) => {
    try {
      await axios.post(
        "https://jsonplaceholder.typicode.com/users",
        {
          printer: data[druckerNum].name,
          summary: {
            conf: rmNr,
            part: teileNr,
            sum: menge,
            tr: tr,
            count: anzScans,
          },
        },
        {
          headers: {
            "content-type": "application/json",
          },
          signal: controller.signal,
        }
      );
      ToastAndroid.show("Abfrage erfolgreich geschickt", ToastAndroid.SHORT);
    } catch (err: any) {
      Alert.alert("Fehler!", err.message);
    } finally {
      setIsModalVisible(false);
      // Cleaner Function
      return () => {
        controller.abort();
      };
    }
  };

  return (
    <Modal animationType="slide" visible={isModalVisible} transparent={true}>
      <View style={styles.container}>
        <FlatList
          data={data}
          renderItem={({ item, index }) => (
            <Text
              style={[
                styles.button,
                ,
                { backgroundColor: isLoading.index ? "#7ba7cc" : "steelblue" },
              ]}
              selectable={false}
              onPress={() => {
                setIsLoading({ ...isLoading, index: index + 1 });
                sendPrintReq(index);
              }}
              disabled={isLoading[`index`] ? true : false}
              key={index}
            >
              {isLoading.index === index + 1 ? (
                <ActivityIndicator size={28} />
              ) : (
                `Drucker ${item.display}`
              )}
            </Text>
          )}
        />
        <Text
          style={[
            styles.button,
            ,
            { backgroundColor: isLoading.index ? "#7ba7cc" : "steelblue" },
          ]}
          selectable={false}
          onPress={() => {
            setIsModalVisible(false);
          }}
          disabled={isLoading.index ? true : false}
        >
          Abbrechen
        </Text>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "auto",
    maxHeight: 400,
    width: "100%",
    position: "absolute",
    bottom: 0,
    backgroundColor: "#f1f1f1",
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderTopRightRadius: 18,
    borderTopLeftRadius: 18,
  },
  button: {
    marginTop: 10,
    padding: 25,
    fontSize: 20,
    color: "#fff",
    backgroundColor: "steelblue",
    borderRadius: 10,
    textAlign: "center",
    shadowColor: "#000",
    elevation: 3,
  },
});
