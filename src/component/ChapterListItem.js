import React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';

let deviceWidth = Dimensions.get('window').width

export class ChapterListItem extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.chapterItemView}>
                <Text>{this.props.chapterNumber}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    chapterItemView: {
        backgroundColor: 'gray',
        alignItems: 'center',
        justifyContent: 'center',
        width: deviceWidth * 0.24,
        height: deviceWidth * 0.15,
        margin: 1
    },
});