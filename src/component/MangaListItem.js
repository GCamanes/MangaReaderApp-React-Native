import React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { primaryColor } from '../colors';

let deviceWidth = Dimensions.get('window').width;

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
    height: deviceWidth*0.15,
    width: deviceWidth
  },
  mangaText: {
    fontSize: 20,
    marginStart: 15,
    color: 'black'
  }
});