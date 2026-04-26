import toast from "react-hot-toast";

const baseOptions = {
  duration: 3000,
};

export const notify = {
  success: (msg: string) =>
    toast.success(msg, {
      ...baseOptions,
      style: {
        background: "#16a34a",
        color: "white",
      },
    }),

  error: (msg: string) =>
    toast.error(msg, {
      ...baseOptions,
      style: {
        background: "#dc2626",
        color: "white",
      },
    }),

  warning: (msg: string) =>
    toast(msg, {
      ...baseOptions,
      icon: "⚠️",
      style: {
        background: "#f59e0b",
        color: "black",
      },
    }),
};