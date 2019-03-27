import React from 'react';
import { StyleSheet, Image, View, Dimensions } from 'react-native';

let deviceWidth = Dimensions.get('window').width

export class PageListItem extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            ratio: 1.45
        }
    }

    componentWillMount() {
        Image.getSize(this.props.url, (width, height) => {
            this.setState({
                ratio: height/width
            })
        });
    }

    render() {
        return (
            <View style={styles.pageItemView}>
                <Image
                    style={{
                        width: deviceWidth*0.95,
                        height: (deviceWidth*0.95)*this.state.ratio,
                        marginTop: 5,
                        marginBottom: 5
                    }}
                    source={{ uri: this.props.url }}
                    resizeMode="cover"
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    pageItemView: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});