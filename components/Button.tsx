import { View, Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native'
import { theme } from '../constants/theme'
import { wp, hp } from '../helpers/common'

const Button = ({
  buttonStyle,
  textStyle,
  title = '',
  onPress = () => {},
  loading = false,
  hasShadow = false
}) => {

  if(loading) {
    return (
      <View style={[styles.button, buttonStyle, {backgroundColor: 'white'}]}>
        <ActivityIndicator size="small" color={theme.colors.primary} />
      </View>
    )
  }

  return (
    <Pressable onPress={onPress} style={[styles.button, buttonStyle, hasShadow && styles.shadowStyle]}>
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
     backgroundColor: theme.colors.primary,
     height: hp(6.6),
     justifyContent: 'center',
     alignItems: 'center',
     borderRadius: theme.radius.xl,
     borderCurve: 'continuous'
  },
  text: {
     fontSize: hp(2.5),
     color: '#ffffff',
     fontWeight: theme.fonts.bold
  },
  shadowStyle: {
    shadowColor: theme.colors.dark,
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  loading: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8
  }
})

export default Button