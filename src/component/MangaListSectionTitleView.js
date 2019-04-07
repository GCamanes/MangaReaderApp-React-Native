import React from 'react';
import {
  View, Text, StyleSheet,
} from 'react-native';
import { deviceSize} from '../size';
import { colors } from '../colors';

const styles = StyleSheet.create({
  sectionTitleView: {
    height: deviceSize.deviceWidth * 0.15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary
  },
  sectionTitleText: {
    width: deviceSize.deviceWidth * 0.40,
    textAlign: 'center',
    fontSize: 21,
    fontWeight: 'bold',
    marginStart: 5,
    marginEnd: 5,
    color: colors.tertiary,
  },
  barView: {
    height: 2,
    width: deviceSize.deviceWidth * 0.15,
    borderRadius: 20,
    backgroundColor: colors.secondary
  }
});

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