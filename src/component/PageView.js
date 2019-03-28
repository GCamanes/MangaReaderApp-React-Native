import React from 'react';
import { StyleSheet, Image, View, Dimensions, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';

let deviceWidth = Dimensions.get('window').width

export class PageView extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (this.props.ratioLoading) {
            return (
                <View style={styles.pageItemView}>
                    <ActivityIndicator size="large" color="green" />
                </View>
            );
        }
        return (
            <ReactNativeZoomableView
                maxZoom={1.5}
                minZoom={1}
                zoomStep={0.5}
                initialZoom={1}
                bindToBorders={true}
                onZoomAfter={this.logOutZoomState}
                style={styles.pageItemView}
            >
                <Image
                    style={{
                        width: (deviceWidth * ((this.props.ratio > 1.5) ? ((this.props.ratio > 1.55) ? 0.85 : 0.9) : 0.95)),
                        height: (deviceWidth * ((this.props.ratio > 1.5) ? ((this.props.ratio > 1.55) ? 0.85 : 0.9) : 0.95)) * this.props.ratio,
                    }}
                    source={{ uri: this.props.url }}
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
    url: PropTypes.string.isRequired,
    ratio: PropTypes.number.isRequired,
    ratioLoading: PropTypes.bool.isRequired,
    ratioLoading: PropTypes.bool.isRequired,
};
const mapStateToProps = state => ({
    connectivity: state.connect.connectivity,
    url: state.image.url,
    ratio: state.image.ratio,
    ratioLoading: state.image.ratioLoading,
    ratioLoaded: state.image.ratioLoaded,
});
const mapDispatchToProps = dispatch => ({

});
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(PageView);