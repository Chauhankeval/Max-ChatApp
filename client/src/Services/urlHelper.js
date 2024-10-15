export const HOST  = import.meta.env.VITE_SERVER_URL;

export const AUTH_ROUTES = "api/auth"

export const SIGNUP_URL = `${AUTH_ROUTES}/signup`

export const LOGIN_URL = `${AUTH_ROUTES}/login`

export const GET_USER_INFO = `${AUTH_ROUTES}/userdata`

export const UPDATE_PROFILE = `${AUTH_ROUTES}/update-profile`

export const SET_PROFILE_IMAGE = `${AUTH_ROUTES}/profile-img`

export const PROFILE_IMAGE_DELETE = `${AUTH_ROUTES}/delete-profile-img`


export const LOGOUT_URL = `${AUTH_ROUTES}/logout`



// ==============================================================================================================

export const CONTECT_ROUTE = "api/contects"


export const SEARCH_CONTECTS = `${CONTECT_ROUTE}/search-contects`

export const GET_CONTECT_FOR_DM = `${CONTECT_ROUTE}/get-contact-dm`

export const GET_ALL_CONTECT_FOR_DM = `${CONTECT_ROUTE}/get-all-contacts-for-dm`




// ============================================================================================================================
export const MESSAGES_ROUTE = "api/messages"


export const GET_MESSAGES = `${MESSAGES_ROUTE}/get-messages`

export const UPLOAD_FILE_IN_DM = `${MESSAGES_ROUTE}/upload-files`


// ===========================================================================================================================

export const CHANNEL_ROUTE = "api/channel"


export const CREATE_CHANNEL = `${CHANNEL_ROUTE}/create-channel`

export const GET_ALL_CHANNELS = `${CHANNEL_ROUTE}/get-all-channels`


export const GET_CHANNELS_MESSAGES = `${CHANNEL_ROUTE}/get-messages-channels/`


