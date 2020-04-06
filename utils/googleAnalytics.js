import ReactGA from 'react-ga';

const TRACKING_ID = 'UA-129359323-3';

let _initialized = false;

function init() {
  ReactGA.initialize(TRACKING_ID);
  _initialized = true;
}

const pageView = () => {
  ReactGA.pageview(window.location.pathname + window.location.search);
};

const setUser = (userId) => {
  ReactGA.set({ userId });
};

function isInitialized() {
  return _initialized;
}

export default {
  init,
  pageView,
  setUser,
  isInitialized,
};
