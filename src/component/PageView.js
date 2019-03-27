import React from 'react';
import { StyleSheet, Image, View, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

let deviceWidth = Dimensions.get('window').width

export class PageView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            ratio: 1.45,
        }
    }

    componentDidMount() {
        console.log(this.state.ratio);
        Image.getSize(this.props.url, (width, height) => {
            this.setState({
                ratio: height / width
            })
        });
    }

    render() {
        return (
            <View style={styles.pageItemView}>
                <Image
                    style={{
                        width: deviceWidth * 0.95,
                        height: (deviceWidth * 0.95) * this.state.ratio,
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
    navigation: PropTypes.shape({
        navigate: PropTypes.func.isRequired,
    }).isRequired,

    connectivity: PropTypes.string.isRequired,
};
const mapStateToProps = state => ({
    connectivity: state.connect.connectivity,
    ratio: state.image.ratio,
    imageLoading: state.image.imageLoading,
    imageLoaded: state.image.imageLoaded,
});
const mapDispatchToProps = dispatch => ({

});
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(PageView);