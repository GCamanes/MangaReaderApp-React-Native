import React from 'react';
import { StyleSheet, Image, View, Dimensions, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { loadImageRatio } from '../store/image.action';

let deviceWidth = Dimensions.get('window').width

export class PageView extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.props.loadImageRatio(this.props.url);
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
            <View style={styles.pageItemView}>
                <Image
                    style={{
                        width: deviceWidth * 0.95,
                        height: (deviceWidth * 0.95) * this.props.ratio,
                    }}
                    source={{ uri: this.props.url }}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    pageItemView: {
        flex: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

PageView.propTypes = {
    connectivity: PropTypes.string.isRequired,
    ratio: PropTypes.number.isRequired,
    ratioLoading: PropTypes.bool.isRequired,
    ratioLoading: PropTypes.bool.isRequired,
    loadImageRatio: PropTypes.func.isRequired,
};
const mapStateToProps = state => ({
    connectivity: state.connect.connectivity,
    ratio: state.image.ratio,
    ratioLoading: state.image.ratioLoading,
    ratioLoaded: state.image.ratioLoaded,
});
const mapDispatchToProps = dispatch => ({
    loadImageRatio: (url) => dispatch(loadImageRatio(url)),
});
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(PageView);