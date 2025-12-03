import { View, Text, Image, StyleSheet, StatusBar, Pressable } from 'react-native'
import { wp, hp } from '../helpers/common';
import { theme } from '../constants/theme';
import Button from '../components/Button';  
import { useRouter } from 'expo-router';

export default function Welcome(){
   const router = useRouter();
   
   return (
      <View style={styles.container}>
         <StatusBar style="dark" />
        <View style={styles.container}>
            <Image
               source={require('../assets/images/welcome.png')}
               style={styles.welcomeImage}
               resizeMode='contain'
            />

           <View style={{gap: 16}}>
              <Text style={styles.title}>Vibely</Text>
              <Text style={styles.punchline}>
                 Your ultimate social media app for sharing your favorite moments on Photos and connecting with friends globally!
              </Text>
            </View>
        </View>

         <View style={styles.footer}>
            <Button
               title='Getting Started'
               buttonStyle={{marginHorizontal: wp(3)}}
               onPress={() => router.push('/(auth)/signup')}
            />
            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 15, gap: 8}}>
               <Text style={{fontSize: hp(1.6), fontWeight: theme.fonts.semibold, color: theme.colors.text}}>Already have an account?</Text>
               <Pressable onPress={() => router.push('/(auth)/login')}>
                  <Text style={{fontSize: hp(1.6), fontWeight: theme.fonts.bold, color: theme.colors.primary}}>Login</Text>
               </Pressable>
            </View>
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
   },
   welcomeImage: {
      height: hp(30),
      width: wp(100),
      alignSelf: 'center',
   },
   title: {
      color: theme.colors.text,
      fontSize: hp(5),
      textAlign: 'center',
      paddingTop: 20,
      fontWeight: theme.fonts.extraBold,
   },
   punchline: {
      textAlign: 'center',
      paddingHorizontal: wp(10),
      fontSize: hp(1.7),
      color: theme.colors.text
   },
   footer: {
      height: hp(20),
      width: '100%',
   }
})