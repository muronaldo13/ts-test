import { httpGet } from './mock-http-interface';

enum ResultName {
  FAILURE = 'FAILURE',
  ARNIE_QUOTE = 'Arnie Quote'
}

interface SuccessResult {
  [ResultName.FAILURE]: string;
  [ResultName.ARNIE_QUOTE]?: never;
}
interface FailureResult {
  [ResultName.FAILURE]?: never;
  [ResultName.ARNIE_QUOTE]: string;
}

type TResult = SuccessResult | FailureResult;

const convertStringToJSON = (content: string): Record<string, any> => JSON.parse(content);

const getUrlReturnResult = async (url: string): Promise<TResult> => {
  const res = await httpGet(url);

  const message: string = convertStringToJSON(res.body).message;

  if (res.status !== 200) {
    return {
      [ResultName.FAILURE]: message,
    }
  }
  return {
    [ResultName.ARNIE_QUOTE]: message
  }
}

export const getArnieQuotes = async (urls : string[]) : Promise<TResult[]> => {
  const urlPromises = urls.map(getUrlReturnResult);

  return Promise.all(urlPromises)
};
