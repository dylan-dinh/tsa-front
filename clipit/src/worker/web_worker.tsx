/* eslint-disable no-restricted-globals */
const ctx: Worker = self as any;

ctx.addEventListener('message', (event) => {
  const { streamers } = event.data;
  
  setInterval(() => {
    streamers.forEach((streamer: any) => {
      if (Math.random() > 0.9) {
        ctx.postMessage({
          type: 'STREAMER_LIVE',
          streamer: streamer.name
        });
      }
    });
  }, 10000);
});

export default {} as typeof Worker & { new (): Worker };