import ReactGA from 'react-ga';

const TRACKING_ID = 'UA-129359323-3';

const init = () => {
  ReactGA.initialize(TRACKING_ID);
};

const pageView = () => {
  ReactGA.pageview(window.location.pathname + window.location.search);
};

const setUser = (userId) => {
  ReactGA.set({ userId });
};

export default {
  init,
  pageView,
  setUser,
};