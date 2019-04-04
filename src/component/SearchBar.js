import React from 'react';
import { StyleSheet, TextInput, View, Dimensions, Image } from 'react-native';
import { primaryColor, secondaryColor, tertiaryColor } from '../colors';
import { searchImg, deleteImg } from '../images';

let deviceWidth = Dimensions.get('window').width;

export class SearchBar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.searchBarView}>
        <View style={styles.searchBarSubView}>
          <Image style={styles.image} source={searchImg}/>
          <TextInput
            style={styles.searchTextInput}
            onChangeText={(text) => this.props.onSearchChange(text)}
            value={this.props.search}
            placeholder={'search manga by name...'}
            selectionColor={secondaryColor}
            autoCapitalize = 'none'
          />
          <Image style={styles.image} source={deleteImg}/>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  searchBarView: {
    height: deviceWidth*0.15,
    backgroundColor: secondaryColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBarSubView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: deviceWidth * 0.98,
    height: deviceWidth*0.12,
    borderRadius: 10,
    backgroundColor: primaryColor,
    borderColor: tertiaryColor,
    borderWidth: 2,
  },
  searchTextInput: {
    height: deviceWidth * 0.12,
    width: deviceWidth * 0.80,

    paddingStart: 10,
    fontSize: 20,
    color: secondaryColor,
  },
  image: {
    height: deviceWidth * 0.06,
    width: deviceWidth * 0.06,
  },
});