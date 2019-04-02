import React, { Component } from 'react';
import {
    TouchableOpacity, Image, StyleSheet, Alert
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {filterChapterList, loadChapters} from '../store/manga.action';

import { filterListDownImg, filterListUpImg } from '../images';
import {ChapterListScreen} from "../screen/ChapterListScreen";

const styles = StyleSheet.create({
    image: {
        height: 30,
        width: 30,
        marginEnd: 10
    },
});
export class FilterButton extends Component {
    constructor(props) {
        super(props);
    }

    onFilterPress() {
        console.log('filter press');
        this.props.filterChapterList();
    }

    render() {
        return (
            <TouchableOpacity onPress={() => this.onFilterPress()}>
                <Image
                    style={styles.image}
                    source={(this.props.chaptersListFilter === 'down') ? filterListDownImg : filterListUpImg}
                />
            </TouchableOpacity>
        );
    }
}

FilterButton.propTypes = {
    chaptersListFilter: PropTypes.string.isRequired,
    filterChapterList: PropTypes.func.isRequired
};
const mapStateToProps = state => ({
    chaptersListFilter: state.manga.chaptersListFilter,
});
const mapDispatchToProps = dispatch => ({
    filterChapterList: () => dispatch(filterChapterList()),
});
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(FilterButton);