import React, { Component } from 'react';
import {
  TouchableOpacity, Image, StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { filterChapterList } from '../store/manga.action';
import { filterListDownImg, filterListUpImg } from '../images';

const styles = StyleSheet.create({
  image: {
    height: 35,
    width: 35,
    marginEnd: 10
  },
});

export class FilterButton extends Component {
  constructor(props) {
    super(props);
  }

  onFilterPress() {
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