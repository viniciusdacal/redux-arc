import { toAsyncTypes } from './utils';

export default function toApiExternalType(actionType) {
  const asyncTypes = toAsyncTypes(actionType);
  return {
    REQUEST: asyncTypes[0],
    RESPONSE: asyncTypes[1],
  };
}
