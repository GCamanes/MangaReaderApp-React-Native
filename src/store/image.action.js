export const IMAGE_RATIO_LOADED = 'IMAGE_RATIO_LOADED';
export const LOAD_IMAGE_RATIO = 'LOAD_IMAGE_RATIO';

export function imageRatioLoaded(ratio) {
    return {
        type: IMAGE_RATIO_LOADED,
        ratio: ratio,
    };
}

function loadImageRatio(url) {
    return (dispatch) => {
        dispatch({
            type: LOAD_IMAGE_RATIO,
        });

        new Promise(function(resolve, reject) {
            Image.getSize(this.props.url, (width, height) => {
                resolve(height / width)
            }, (error) => {
                reject(1)
            })
        })
        .then((ratio) => {
            dispatch(imageRatioLoaded(ratio))
        });
    };
}