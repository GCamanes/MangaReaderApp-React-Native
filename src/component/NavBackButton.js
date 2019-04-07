import React, { Component } from 'react';
import {
  TouchableOpacity, Image, StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import { images } from '../images';

const styles = StyleSheet.create({
  image: {
    height: 40,
    width: 40,
    marginStart: 10
  },
});

export class NavBackButton extends Component {
  constructor(props) {
    super(props);
  }

  onButtonPress() {
    this.props.navigation.goBack();
  }

  render() {
    return (
      <TouchableOpacity onPress={() => this.onButtonPress()}>
        <Image style={styles.image} source={images.goBack}/>
      </TouchableOpacity>
    );
  }
}

NavBackButton.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};