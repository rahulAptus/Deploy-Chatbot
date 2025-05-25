interface State {
  isBooking: boolean;
  waitingForTrigger: boolean;
  chatHistory: string[];
  currentStep: string;
  websocket: WebSocket | null;
  showResult: boolean;
  loading: boolean;
  showSources: boolean;
  result: any[];
  audioOpen: boolean;
  isRecording: boolean;
  transcription: string[];
  playingStates: Record<string, boolean>;
  selectedImage: string | null;
  isSidebarOpen: boolean;
}

export const initialState: State = {
  isBooking: false,
  waitingForTrigger: true,
  chatHistory: [],
  currentStep: "",
  websocket: null,
  showResult: true,
  loading: false,
  showSources: false,
  result: [],
  audioOpen: false,
  isRecording: false,
  transcription: [],
  playingStates: {},
  selectedImage: null,
  isSidebarOpen: false,
};

type ReducerAction =
  | { type: "TRIGGER_RECEIVED" }
  | { type: "SET_WEBSOCKET"; payload: WebSocket | null }
  | { type: "UPDATE_HISTORY"; payload: string }
  | { type: "SET_CURRENT_STEP"; payload: string }
  | { type: "RESET_BOOKING" }
  | { type: "SET_SHOW_RESULT"; payload: boolean }
  | { type: "TOGGLE_LOADING"; payload: boolean }
  | { type: "TOGGLE_SOURCES"; payload: boolean }
  | { type: "SET_RESULT"; payload: any }
  | { type: "TOGGLE_AUDIO_OPEN"; payload: boolean }
  | { type: "TOGGLE_RECORDING"; payload: boolean }
  | { type: "SET_TRANSCRIPTION"; payload: string }
  | { type: "SET_PLAYING_STATES"; payload: Record<string, boolean> }
  | { type: "SET_SELECTED_IMAGE"; payload: string | null }
  | { type: "TOGGLE_SIDEBAR_OPEN"; payload: boolean }
  | { type: "SEND_PROMPT"; payload: { showResult: boolean; loading: boolean } };

export const MainReducer = (state: State, action: ReducerAction): State => {
  switch (action.type) {
    case "TRIGGER_RECEIVED":
      return {
        ...state,
        waitingForTrigger: !state.waitingForTrigger,
        isBooking: true,
      };
    case "SET_WEBSOCKET":
      return { ...state, websocket: action.payload };
    case "SET_CURRENT_STEP":
      console.log("[LOG]: SET_CURRENT_STEP dispatched:", action.payload);
      return { ...state, currentStep: action.payload };
    case "RESET_BOOKING":
      return {
        ...state,
        isBooking: false,
        currentStep: "",
        websocket: null,
      };
    case "SET_SHOW_RESULT":
      return { ...state, showResult: action.payload };
    case "TOGGLE_LOADING":
      return { ...state, loading: action.payload };
    case "TOGGLE_SOURCES":
      return { ...state, showSources: action.payload };
    case "SET_RESULT":
      return { ...state, result: [...state.result, action.payload] };
    case "TOGGLE_AUDIO_OPEN":
      return { ...state, audioOpen: action.payload };
    case "TOGGLE_RECORDING":
      return { ...state, isRecording: action.payload };
    case "SET_PLAYING_STATES":
      return {
        ...state,
        playingStates: { ...state.playingStates, ...action.payload },
      };
    case "SET_SELECTED_IMAGE":
      return { ...state, selectedImage: action.payload };
    case "TOGGLE_SIDEBAR_OPEN":
      return { ...state, isSidebarOpen: action.payload };
    case "SEND_PROMPT":
      return {
        ...state,
        showResult: action.payload.showResult,
        loading: action.payload.loading,
      };
    default:
      return state;
  }
};
