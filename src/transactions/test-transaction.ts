

export async function promise_transaction() {
  const result = await Promise.all([
    new Promise((resolve) => setTimeout(() => resolve(1), 1000)),
    new Promise((resolve) => setTimeout(() => resolve(2), 2000))
  ]);
  console.log("promise_transaction_result:", result);
};