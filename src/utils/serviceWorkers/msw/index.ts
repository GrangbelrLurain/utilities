import { handlers as userHandlers } from "./handlers/user";

const initMSW = async () => {
  if (process.env.NODE_ENV === "production") {
    return;
  }

  if (typeof window === "undefined") {
    return;
  } else {
    const { setupWorker } = await import("msw/browser");

    const handlers = [...userHandlers];

    return setupWorker(...handlers).start();
  }
};

export default initMSW;
