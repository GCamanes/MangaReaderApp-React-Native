import React from 'react';
import {
  View, Text, StyleSheet,
} from 'react-native';
import { deviceSize} from '../size';
import { primaryColor, secondaryColor, tertiaryColor } from '../colors';

export class MangaListSectionTitleView extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.sectionTitleView}>
          <View style={styles.barView}/>
          <Text style={styles.sectionTitleText}>{this.props.title}</Text>
          <View style={styles.barView}/>
      </View>
    )
  }
};

const styles = StyleSheet.create({
  sectionTitleView: {
    height: deviceSize.deviceWidth * 0.15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: primaryColor
  },
  sectionTitleText: {
    width: deviceSize.deviceWidth * 0.40,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    marginStart: 5,
    marginEnd: 5,
    color: tertiaryColor,
  },
  barView: {
    height: 2,
    width: deviceSize.deviceWidth * 0.15,
    borderRadius: 20,
    backgroundColor: secondaryColor
  }
});