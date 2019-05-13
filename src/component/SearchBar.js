import React from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity, Image } from 'react-native';
import { colors } from '../colors';
import { images } from '../images';
import { deviceSize} from '../size';

const styles = StyleSheet.create({
  searchBarView: {
    height: deviceSize.deviceWidth*0.15,
    backgroundColor: colors.secondary,
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
    backgroundColor: colors.primary,
    borderColor: colors.quaternary,
    borderWidth: 2,
  },
  searchTextInput: {
    height: deviceSize.deviceWidth * 0.12,
    width: deviceSize.deviceWidth * 0.80,
    paddingStart: 10,
    fontSize: 20,
    color: colors.tertiary,
  },
  image: {
    height: deviceSize.deviceWidth * 0.07,
    width: deviceSize.deviceWidth * 0.07,
  },
});

export class SearchBar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.searchBarView}>
        <View style={styles.searchBarSubView}>
          <Image style={styles.image} source={images.search}/>
          <TextInput
            style={styles.searchTextInput}
            onChangeText={(text) => this.props.onSearchChange(text)}
            value={this.props.value}
            placeholder={'search manga by name...'}
            selectionColor={colors.secondary}
            autoCapitalize = 'none'
          />
          <TouchableOpacity onPress={() => this.props.onCancelSearch()}>
            <Image style={styles.image} source={images.delete}/>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}