import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { primaryColor } from '../colors';
import { deviceSize} from '../size';

export class MangaListItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.mangaItemView}>
        <Text style={styles.mangaText}>{this.props.manga}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mangaItemView: {
    backgroundColor: primaryColor,
    justifyContent: 'center',
    height: deviceSize.deviceWidth*0.15,
    width: deviceSize.deviceWidth
  },
  mangaText: {
    fontSize: 20,
    marginStart: 15,
    color: 'black'
  }
});