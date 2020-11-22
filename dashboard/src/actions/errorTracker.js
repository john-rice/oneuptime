import { postApi, getApi, deleteApi, putApi } from '../api';
import * as types from '../constants/errorTracker';
import errors from '../errors';

//Create new error tracker
//props -> {name: '', type, data -> { data.url}}
export function createErrorTracker(projectId, componentId, values) {
    return function(dispatch) {
        const promise = postApi(
            `error-tracker/${projectId}/${componentId}/create`,
            values
        );
        dispatch(createErrorTrackerRequest());

        promise.then(
            function(errorTracker) {
                dispatch(createErrorTrackerSuccess(errorTracker.data));
            },
            function(error) {
                if (error && error.response && error.response.data) {
                    error = error.response.data;
                }
                if (error && error.data) {
                    error = error.data;
                }
                if (error && error.message) {
                    error = error.message;
                } else {
                    error = 'Network Error';
                }
                dispatch(createErrorTrackerFailure(errors(error)));
            }
        );

        return promise;
    };
}

export function createErrorTrackerSuccess(newErrorTracker) {
    return {
        type: types.CREATE_ERROR_TRACKER_SUCCESS,
        payload: newErrorTracker,
    };
}

export function createErrorTrackerRequest() {
    return {
        type: types.CREATE_ERROR_TRACKER_REQUEST,
    };
}

export function createErrorTrackerFailure(error) {
    return {
        type: types.CREATE_ERROR_TRACKER_FAILURE,
        payload: error,
    };
}

export function resetCreateErrorTracker() {
    return {
        type: types.CREATE_ERROR_TRACKER_RESET,
    };
}

export function fetchErrorTrackers(projectId, componentId) {
    return function(dispatch) {
        const promise = getApi(`error-tracker/${projectId}/${componentId}`);
        dispatch(fetchErrorTrackersRequest());

        promise.then(
            function(errorTrackers) {
                dispatch(fetchErrorTrackersSuccess(errorTrackers.data));
            },
            function(error) {
                if (error && error.response && error.response.data)
                    error = error.response.data;
                if (error && error.data) {
                    error = error.data;
                }
                if (error && error.message) {
                    error = error.message;
                } else {
                    error = 'Network Error';
                }
                dispatch(fetchErrorTrackersFailure(errors(error)));
            }
        );

        return promise;
    };
}

export function fetchErrorTrackersSuccess(errorTrackers) {
    return {
        type: types.FETCH_ERROR_TRACKERS_SUCCESS,
        payload: errorTrackers,
    };
}

export function fetchErrorTrackersRequest() {
    return {
        type: types.FETCH_ERROR_TRACKERS_REQUEST,
    };
}

export function fetchErrorTrackersFailure(error) {
    return {
        type: types.FETCH_ERROR_TRACKERS_FAILURE,
        payload: error,
    };
}

export function resetFetchErrorTrackers() {
    return {
        type: types.FETCH_ERROR_TRACKERS_RESET,
    };
}

export function fetchErrorTrackerIssues(
    projectId,
    componentId,
    errorTrackerId,
    skip,
    limit,
    startDate,
    endDate,
    filters = null
) {
    return function(dispatch) {
        const promise = postApi(
            `error-tracker/${projectId}/${componentId}/${errorTrackerId}/issues`,
            { skip, limit, startDate, endDate, filters }
        );
        dispatch(fetchErrorTrackerIssuesRequest(errorTrackerId));

        promise.then(
            function(response) {
                dispatch(
                    fetchErrorTrackerIssuesSuccess({
                        errorTrackerId,
                        errorTrackerIssues:
                            response.data.data.errorTrackerIssues,
                        dateRange: response.data.data.dateRange,
                        skip,
                        limit,
                        count: response.data.data.count,
                    })
                );
            },
            function(error) {
                if (error && error.response && error.response.data)
                    error = error.response.data;
                if (error && error.data) {
                    error = error.data;
                }
                if (error && error.message) {
                    error = error.message;
                } else {
                    error = 'Network Error';
                }
                dispatch(fetchErrorTrackerIssuesFailure(errors(error)));
            }
        );

        return promise;
    };
}

export function fetchErrorTrackerIssuesSuccess(errorTrackersList) {
    return {
        type: types.FETCH_ISSUES_SUCCESS,
        payload: errorTrackersList,
    };
}

export function fetchErrorTrackerIssuesRequest(errorTrackerId) {
    return {
        type: types.FETCH_ISSUES_REQUEST,
        payload: errorTrackerId,
    };
}

export function fetchErrorTrackerIssuesFailure(error) {
    return {
        type: types.FETCH_ISSUES_FAILURE,
        payload: error,
    };
}

export function resetFetchErrorTrackerIssues() {
    return {
        type: types.FETCH_ISSUES_RESET,
    };
}

export function fetchErrorEvent(
    projectId,
    componentId,
    errorTrackerId,
    errorEventId
) {
    return function(dispatch) {
        const promise = postApi(
            `error-tracker/${projectId}/${componentId}/${errorTrackerId}/error-events/${errorEventId}`
        );
        dispatch(fetchErrorEventRequest(errorTrackerId, errorEventId));

        promise.then(
            function(response) {
                dispatch(
                    fetchErrorEventSuccess({
                        errorTrackerId,
                        errorEventId,
                        errorEvent: response.data.errorEvent,
                        previous: response.data.previous,
                        next: response.data.next,
                        totalEvents: response.data.totalEvents,
                    })
                );
            },
            function(error) {
                if (error && error.response && error.response.data)
                    error = error.response.data;
                if (error && error.data) {
                    error = error.data;
                }
                if (error && error.message) {
                    error = error.message;
                } else {
                    error = 'Network Error';
                }
                dispatch(fetchErrorEventFailure(errors(error)));
            }
        );

        return promise;
    };
}

export function fetchErrorEventSuccess(errorEvent) {
    return {
        type: types.FETCH_ERROR_EVENT_SUCCESS,
        payload: errorEvent,
    };
}

export function fetchErrorEventRequest(errorTrackerId, errorEventId) {
    return {
        type: types.FETCH_ERROR_EVENT_REQUEST,
        payload: { errorTrackerId, errorEventId },
    };
}

export function fetchErrorEventFailure(error) {
    return {
        type: types.FETCH_ERROR_EVENT_FAILURE,
        payload: error,
    };
}

export function resetFetchErrorEvent() {
    return {
        type: types.FETCH_ERROR_EVENT_RESET,
    };
}

export function setCurrentErrorEvent(errorEventId) {
    return {
        type: types.SET_CURRENT_ERROR_EVENT,
        payload: { errorEventId },
    };
}

//Delete an errorTrackeer
//props -> {name: '', type, data -> { data.url}}
export function deleteErrorTracker(projectId, componentId, errorTrackerId) {
    return function(dispatch) {
        const promise = deleteApi(
            `error-tracker/${projectId}/${componentId}/${errorTrackerId}`
        );
        dispatch(deleteErrorTrackerRequest(errorTrackerId));

        promise.then(
            function(errorTracker) {
                dispatch(deleteErrorTrackerSuccess(errorTracker.data._id));
            },
            function(error) {
                if (error && error.response && error.response.data)
                    error = error.response.data;
                if (error && error.data) {
                    error = error.data;
                }
                if (error && error.message) {
                    error = error.message;
                } else {
                    error = 'Network Error';
                }
                dispatch(
                    deleteErrorTrackerFailure({
                        error: errors(error),
                        errorTrackerId,
                    })
                );
            }
        );

        return promise;
    };
}

export function deleteErrorTrackerSuccess(removedErrorTrackerId) {
    return {
        type: types.DELETE_ERROR_TRACKER_SUCCESS,
        payload: removedErrorTrackerId,
    };
}

export function deleteErrorTrackerRequest(errorTrackerId) {
    return {
        type: types.DELETE_ERROR_TRACKER_REQUEST,
        payload: errorTrackerId,
    };
}

export function deleteErrorTrackerFailure(error) {
    return {
        type: types.DELETE_ERROR_TRACKER_FAILURE,
        payload: error,
    };
}

export function editErrorTrackerSwitch(index) {
    return {
        type: types.EDIT_ERROR_TRACKER_SWITCH,
        payload: index,
    };
}
//Edit new errorTracker
export function editErrorTracker(
    projectId,
    componentId,
    errorTrackerId,
    values
) {
    return function(dispatch) {
        const promise = putApi(
            `error-tracker/${projectId}/${componentId}/${errorTrackerId}`,
            values
        );
        dispatch(editErrorTrackerRequest());

        promise.then(
            function(errorTracker) {
                dispatch(editErrorTrackerSuccess(errorTracker.data));
            },
            function(error) {
                if (error && error.response && error.response.data) {
                    error = error.response.data;
                }
                if (error && error.data) {
                    error = error.data;
                }
                if (error && error.message) {
                    error = error.message;
                } else {
                    error = 'Network Error';
                }
                dispatch(editErrorTrackerFailure(errors(error)));
            }
        );

        return promise;
    };
}

export function editErrorTrackerSuccess(newErrorTracker) {
    return {
        type: types.EDIT_ERROR_TRACKER_SUCCESS,
        payload: newErrorTracker,
    };
}

export function editErrorTrackerRequest() {
    return {
        type: types.EDIT_ERROR_TRACKER_REQUEST,
    };
}

export function editErrorTrackerFailure(error) {
    return {
        type: types.EDIT_ERROR_TRACKER_FAILURE,
        payload: error,
    };
}

export function resetErrorTrackerKey(projectId, componentId, errorTrackerId) {
    return function(dispatch) {
        const promise = postApi(
            `error-tracker/${projectId}/${componentId}/${errorTrackerId}/reset-key`
        );
        dispatch(resetErrorTrackerKeyRequest());

        promise.then(
            function(errorTracker) {
                dispatch(resetErrorTrackerKeySuccess(errorTracker.data));
            },
            function(error) {
                if (error && error.response && error.response.data)
                    error = error.response.data;
                if (error && error.data) {
                    error = error.data;
                }
                if (error && error.message) {
                    error = error.message;
                } else {
                    error = 'Network Error';
                }
                dispatch(resetErrorTrackerKeyFailure(errors(error)));
            }
        );

        return promise;
    };
}

export function resetErrorTrackerKeySuccess(errorTracker) {
    return {
        type: types.RESET_ERROR_TRACKER_KEY_SUCCESS,
        payload: errorTracker,
    };
}

export function resetErrorTrackerKeyRequest() {
    return {
        type: types.RESET_ERROR_TRACKER_KEY_REQUEST,
    };
}

export function resetErrorTrackerKeyFailure(error) {
    return {
        type: types.RESET_ERROR_TRACKER_KEY_FAILURE,
        payload: error,
    };
}

export function resetresetErrorTrackerKey() {
    return {
        type: types.RESET_ERROR_TRACKER_KEY_RESET,
    };
}

export function ignoreErrorEvent(
    projectId,
    componentId,
    errorTrackerId,
    issueId
) {
    return function(dispatch) {
        const promise = postApi(
            `error-tracker/${projectId}/${componentId}/${errorTrackerId}/issues/action`,
            { issueId, action: 'ignore' }
        );
        dispatch(ignoreErrorEventRequest());

        promise.then(
            function(response) {
                dispatch(
                    ignoreErrorEventSuccess({
                        errorTrackerId,
                        ignoredIssues: response.data.issues,
                    })
                );
            },
            function(error) {
                if (error && error.response && error.response.data)
                    error = error.response.data;
                if (error && error.data) {
                    error = error.data;
                }
                if (error && error.message) {
                    error = error.message;
                } else {
                    error = 'Network Error';
                }
                dispatch(ignoreErrorEventFailure(errors(error)));
            }
        );

        return promise;
    };
}

export function ignoreErrorEventReset() {
    return {
        type: types.IGNORE_ERROR_EVENT_RESET,
    };
}

export function ignoreErrorEventRequest() {
    return {
        type: types.IGNORE_ERROR_EVENT_REQUEST,
    };
}
export function ignoreErrorEventFailure(error) {
    return {
        type: types.IGNORE_ERROR_EVENT_FAILURE,
        payload: error,
    };
}
export function ignoreErrorEventSuccess(errorEvents) {
    return {
        type: types.IGNORE_ERROR_EVENT_SUCCESS,
        payload: errorEvents,
    };
}

export function unresolveErrorEvent(
    projectId,
    componentId,
    errorTrackerId,
    issueId
) {
    return function(dispatch) {
        const promise = postApi(
            `error-tracker/${projectId}/${componentId}/${errorTrackerId}/issues/action`,
            { issueId, action: 'unresolve' }
        );
        dispatch(unresolveErrorEventRequest());

        promise.then(
            function(response) {
                dispatch(
                    unresolveErrorEventSuccess({
                        errorTrackerId,
                        unresolvedIssues: response.data.issues,
                    })
                );
            },
            function(error) {
                if (error && error.response && error.response.data)
                    error = error.response.data;
                if (error && error.data) {
                    error = error.data;
                }
                if (error && error.message) {
                    error = error.message;
                } else {
                    error = 'Network Error';
                }
                dispatch(unresolveErrorEventFailure(errors(error)));
            }
        );

        return promise;
    };
}

export function unresolveErrorEventReset() {
    return {
        type: types.UNRESOLVE_ERROR_EVENT_RESET,
    };
}

export function unresolveErrorEventRequest() {
    return {
        type: types.UNRESOLVE_ERROR_EVENT_REQUEST,
    };
}
export function unresolveErrorEventFailure(error) {
    return {
        type: types.UNRESOLVE_ERROR_EVENT_FAILURE,
        payload: error,
    };
}
export function unresolveErrorEventSuccess(errorEvents) {
    return {
        type: types.UNRESOLVE_ERROR_EVENT_SUCCESS,
        payload: errorEvents,
    };
}

export function resolveErrorEvent(
    projectId,
    componentId,
    errorTrackerId,
    issueId
) {
    return function(dispatch) {
        const promise = postApi(
            `error-tracker/${projectId}/${componentId}/${errorTrackerId}/issues/action`,
            { issueId, action: 'resolve' }
        );
        dispatch(resolveErrorEventRequest());

        promise.then(
            function(response) {
                dispatch(
                    resolveErrorEventSuccess({
                        errorTrackerId,
                        resolvedIssues: response.data.issues,
                    })
                );
            },
            function(error) {
                if (error && error.response && error.response.data)
                    error = error.response.data;
                if (error && error.data) {
                    error = error.data;
                }
                if (error && error.message) {
                    error = error.message;
                } else {
                    error = 'Network Error';
                }
                dispatch(resolveErrorEventFailure(errors(error)));
            }
        );

        return promise;
    };
}

export function resolveErrorEventReset() {
    return {
        type: types.RESOLVE_ERROR_EVENT_RESET,
    };
}

export function resolveErrorEventRequest() {
    return {
        type: types.RESOLVE_ERROR_EVENT_REQUEST,
    };
}
export function resolveErrorEventFailure(error) {
    return {
        type: types.RESOLVE_ERROR_EVENT_FAILURE,
        payload: error,
    };
}
export function resolveErrorEventSuccess(errorEvents) {
    return {
        type: types.RESOLVE_ERROR_EVENT_SUCCESS,
        payload: errorEvents,
    };
}
