let savedResolved, savedReject;

const myPromise = new Promise((resolve, reject) => {
  savedResolved = resolve;
  savedReject = reject;
});

myPromise
  .then((value) => console.log("Promise Resolved:", value))
  .catch((err) => console.log("Promise Rejected:", err));

setTimeout(() => {
  savedResolved("Promise Resolved Done");
}, 3000);