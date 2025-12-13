import { useRouter } from 'expo-router';
import { Image, Pressable, StatusBar, Text, View } from 'react-native';
import { styles } from '@/styles/welcome';
import Button from '@/components//ui/Button';
import { theme } from '@/constants/theme';
import { hp, wp } from '@/utils/common';
import React from 'react';

export default function Welcome(){
   const router = useRouter();
   
   return (
      <View style={styles.container}>
         <StatusBar barStyle="light-content" />
        <View style={styles.container}>
            <Image
               source={require('@/assets/images/welcome.png')}
               style={styles.welcomeImage}
               resizeMode='contain'
            />

           <View style={{gap: 16}}>
              <Text style={styles.title}>Awaza</Text>
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
               <Text style={styles.already}>Already have an account?</Text>
               <Pressable onPress={() => router.push('/(auth)/login')}>
                  <Text style={styles.loginLink}>Login</Text>
               </Pressable>
            </View>
         </View> 
      </View>
   )
}