import { useK8sWatchResource } from '@openshift-console/dynamic-plugin-sdk';
import { CamelAppKind } from '../../types';
import { camelAppGVK } from '../../const';

export const useCamelApp = (
  name: string,
  namespace: string,
): { CamelApp: CamelAppKind; isLoading: boolean; error: string } => {
  const [CamelAppDatas, loaded, loadError] = useK8sWatchResource<CamelAppKind>({
    name: name,
    namespace: namespace,
    groupVersionKind: camelAppGVK,
    isList: false,
  });

  return { CamelApp: CamelAppDatas, isLoading: !loaded, error: loadError };
};
