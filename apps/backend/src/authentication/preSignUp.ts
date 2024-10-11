export const handler = async (event: {
  response: { autoConfirmUser: boolean };
}) => {
  event.response.autoConfirmUser = true;
  return event;
};
