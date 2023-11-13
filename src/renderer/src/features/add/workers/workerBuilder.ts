import uploadWorker from './uploadWorker';

export const workerBuilder = () => {
  const code = uploadWorker.toString();
  const blob = new Blob([`(${code})()`]);
  return new Worker(URL.createObjectURL(blob));
};
