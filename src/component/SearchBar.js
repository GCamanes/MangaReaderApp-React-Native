import React from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity, Image } from 'react-native';
import { primaryColor, secondaryColor, tertiaryColor } from '../colors';
import { searchImg, deleteImg } from '../images';
import { deviceSize} from '../size';

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
            value={this.props.value}
            placeholder={'search manga by name...'}
            selectionColor={secondaryColor}
            autoCapitalize = 'none'
          />
          <TouchableOpacity onPress={() => this.props.onCancelSearch()}>
            <Image style={styles.image} source={deleteImg}/>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  searchBarView: {
    height: deviceSize.deviceWidth*0.15,
    backgroundColor: secondaryColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBarSubView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: deviceSize.deviceWidth * 0.97,
    height: deviceSize.deviceWidth*0.12,
    borderRadius: 10,
    backgroundColor: primaryColor,
    borderColor: tertiaryColor,
    borderWidth: 2,
  },
  searchTextInput: {
    height: deviceSize.deviceWidth * 0.12,
    width: deviceSize.deviceWidth * 0.80,
    paddingStart: 10,
    fontSize: 20,
    color: tertiaryColor,
  },
  image: {
    height: deviceSize.deviceWidth * 0.07,
    width: deviceSize.deviceWidth * 0.07,
  },
});