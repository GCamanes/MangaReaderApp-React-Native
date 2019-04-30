import React, { Component } from 'react';
import {
  TouchableOpacity, Image,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { filterChapterList } from '../store/manga.action';
import { images } from '../images';

export class FilterButton extends Component {
  constructor(props) {
    super(props);
  }

  onFilterPress() {
    this.props.filterChapterList(this.props.manga);
  }

  render() {
    return (
      <TouchableOpacity onPress={() => this.onFilterPress()}>
        <Image
          style={{
            height: 35,
            width: 35,
            marginEnd: 15
          }}
          source={(this.props.chaptersListFilter === 'down') ? images.filterListDown : images.filterListUp}
        />
      </TouchableOpacity>
    );
  }
}

FilterButton.propTypes = {
  chaptersListFilter: PropTypes.string.isRequired,
  filterChapterList: PropTypes.func.isRequired,
  manga: PropTypes.string.isRequired,
};
const mapStateToProps = state => ({
  chaptersListFilter: state.manga.chaptersListFilter,
});
const mapDispatchToProps = dispatch => ({
  filterChapterList: (manga) => dispatch(filterChapterList(manga)),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FilterButton);