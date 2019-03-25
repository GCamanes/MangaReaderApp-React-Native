export const UPDATE_CONNECTIVITY = 'UPDATE_CONNECTIVITY';

export function updateConnectivity(connectivity) {
    return {
        type: UPDATE_CONNECTIVITY,
        connectivity,
    };
}