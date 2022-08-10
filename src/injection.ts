import { Falcon } from './falcon';

const init = (falcon: Falcon) => {
  // eslint-disable-next-line
  // @ts-ignore
  window.falcon = falcon;
};

const eventListener = {
  addMessageListener: (fn: (e: any) => void) =>
    window.addEventListener('message', fn),
  removeMessageListener: (fn: (e: any) => void) =>
    window.removeEventListener('message', fn),
  postMessage: (message: any) => {
    // eslint-disable-next-line
    // @ts-ignore
    window.ReactNativeWebView.postMessage(JSON.stringify(message));
  },
};
const falcon = new Falcon(eventListener);
init(falcon);
