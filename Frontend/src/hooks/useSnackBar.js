import { App } from "antd";

export const useSnackBar = () => {
  const { notification } = App.useApp();
  const success = (message, description) => {
    notification.success({
      message,
      description,
      placement: "bottomRight",
    });
  };

  const error = (message, description) => {
    console.log(message,description)
    notification.error({
      message,
      description,
      placement: "bottomRight",
    });
  };

  const info = (message, description) => {
    notification.info({
      message,
      description,
      placement: "bottomRight",
    });
  };

  const warning = (message, description) => {
    notification.warning({
      message,
      description,
      placement: "bottomRight",
    });
  };

  return { success, error, info, warning };
};
