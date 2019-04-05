import React from 'react';
import {
  StyleSheet, Image, View, ActivityIndicator,
  Dimensions,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';

let deviceWidth = Dimensions.get('window').width;

export class PageView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pageViewHeight: props.pageViewHeight
    };
  }

  render() {
    if (this.props.imgRatioLoading) {
      return (
        <View style={styles.pageItemView}>
          <ActivityIndicator size="large" color="green"/>
        </View>
      );
    }
    if (this.props.imgError) {
      return (
        <View style={styles.pageItemView}>
          <Text>error when loading img from {this.props.imgUrl}</Text>
        </View>
      );
    }

    return (
      <ReactNativeZoomableView
        maxZoom={2.0}
        minZoom={1}
        zoomStep={0.5}
        initialZoom={1}
        bindToBorders={true}
        onZoomAfter={this.logOutZoomState}
        style={styles.pageItemView}
      >
        <Image
          style={{
            width: (this.props.imgRatioHW < 1) ?
              (deviceWidth * 0.95) :
              ((this.state.pageViewHeight * 0.95) * this.props.imgRatioWH),
            height: (this.props.imgRatioHW < 1) ?
              ((deviceWidth * 0.95) * this.props.imgRatioHW) :
              (this.state.pageViewHeight * 0.95),
          }}
          source={{ uri: this.props.imgUrl }}
        />
      </ReactNativeZoomableView>
    );
  }
}

const styles = StyleSheet.create({
  pageItemView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

PageView.propTypes = {
  connectivity: PropTypes.string.isRequired,
  imgUrl: PropTypes.string.isRequired,
  imgRatioHW: PropTypes.number.isRequired,
  imgRatioWH: PropTypes.number.isRequired,
  imgHeight: PropTypes.number.isRequired,
  imgWidth: PropTypes.number.isRequired,
  imgRatioLoading: PropTypes.bool.isRequired,
  imgError: PropTypes.string,
};
const mapStateToProps = state => ({
  connectivity: state.connect.connectivity,
  imgUrl: state.image.imgUrl,
  imgRatioHW: state.image.imgRatioHW,
  imgRatioWH: state.image.imgRatioWH,
  imgHeight: state.image.imgHeight,
  imgWidth: state.image.imgWidth,
  imgRatioLoading: state.image.imgRatioLoading,
  imgError: state.image.imgError,
});

export default connect(
  mapStateToProps,
  null,
)(PageView);