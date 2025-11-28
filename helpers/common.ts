import { Dimensions } from 'react-native';

const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');

const hp = (percentage: number) => {
  return (percentage * deviceHeight) / 100; // Like vh in css
}

const wp = (percentage: number) => {
  return (percentage * deviceWidth) / 100; // Like vw in css
}

export { hp, wp, deviceHeight, deviceWidth };