export default function actionCreatorFactory(config, type) {
  const normalizedConfig = config !== null && typeof config === 'object'
    ? config
    : {};

  const { payload: configPayload, meta: configMeta, error: configError } = config;

  function actionCreator(payload, meta, error) {
    const action = {
      type,
    };

    const finalMeta = {
      ...configMeta,
      ...meta,
    };

    if (Object.keys(finalMeta).length) {
      action.meta = finalMeta;
    }

    const finalPayload = payload !== undefined
      ? payload
      : configPayload;

    if (finalPayload !== undefined) {
      action.payload = finalPayload;
    }

    const finalError = error !== undefined
      ? error
      : configError;

    if (finalError !== undefined) {
      action.error = finalError;
    }

    return action;
  }

  Object.assign(actionCreator, normalizedConfig);

  return actionCreator;
}
