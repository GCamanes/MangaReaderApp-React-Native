import React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';

import { primaryColor, secondaryColor, tertiaryColor } from '../colors';

let deviceWidth = Dimensions.get('window').width;


export class ChapterListItem extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.chapterItemView}>
                <Text style={styles.chapterItemText}>{this.props.chapterNumber}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    chapterItemView: {
        backgroundColor: secondaryColor,
        alignItems: 'center',
        justifyContent: 'center',
        width: deviceWidth * 0.24,
        height: deviceWidth * 0.15,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: tertiaryColor,
        margin: 1
    },
    chapterItemText: {
        color: 'black',
        fontSize: 18,
    }
});