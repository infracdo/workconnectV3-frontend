import { reactive } from "vue";

// Set states for both error codes and message to null initially
const errorState = reactive({
  errorCode: null,
  errorMessage: null,
});

// Set error state from the passed argument
export const setErrorState = (code, message) => {
  errorState.errorCode = code;
  errorState.errorMessage = message;
};

// Retrieve current error state for fetching from different components
export const getErrorState = () => errorState;

export default {
  setErrorState,
  getErrorState
};
