import { View, Text, Image, StyleSheet, StatusBar } from 'react-native'
import { wp, hp } from '../helpers/common';

export default function Welcome(){
   return (
      <View style={styles.container}>
         <StatusBar style="light" />
        <View style={styles.container}>

        </View>
      </View>
   )
}

const styles =  StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#ffffff',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: wp(4)
   }
})