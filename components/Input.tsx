// components/Input.tsx
import { TextInput, StyleSheet, View } from 'react-native';
import { theme } from '../constants/theme';
import { hp } from '../helpers/common';

const Input = (props) => {
  return (
    <View style={[styles.container, props.containerStyle]}>
      {props.icon && <View style={styles.iconContainer}>{props.icon}</View>}

      <TextInput
        style={styles.input}
        placeholderTextColor={theme.colors.textLight}
        ref={props.inputRef}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: hp(7.2),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.gray,
    borderRadius: theme.radius.xxl,
    borderCurve: 'continuous',
    paddingHorizontal: 18,
    backgroundColor: '#fff',
    gap: 12,
  },
  iconContainer: {
    opacity: 0.7,
  },
  input: {
    flex: 1,
    fontSize: hp(2),
    color: theme.colors.text,
  },
});

export default Input;