import Quotes from "@/components/Quotes";
import { StyleSheet, View } from "react-native";


export default function Index() {
  return (
    <View style={styles.container}>
      <Quotes/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
  }
});
