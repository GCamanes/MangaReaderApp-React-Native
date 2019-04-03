import React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { primaryColor } from '../colors';

let deviceWidth = Dimensions.get('window').width

export class MangaListItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.MangaItemView}>
        <Text style={styles.mangaText}>{this.props.manga}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  MangaItemView: {
    backgroundColor: primaryColor,
    justifyContent: 'center',
    height: 50,
    width: deviceWidth
  },
  mangaText: {
    fontSize: 20,
    marginStart: 15,
    color: 'black'
  }
});