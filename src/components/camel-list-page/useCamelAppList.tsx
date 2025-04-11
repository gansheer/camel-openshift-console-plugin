import { useK8sWatchResources } from '@openshift-console/dynamic-plugin-sdk';
import { CamelAppKind } from '../../types';
import {
  camelAppGVK,
} from '../../const';

export const useCamelAppList = (
  namespace: string,
): { CamelApps: CamelAppKind[]; loaded: boolean; error: string } => {
  const resources = useK8sWatchResources<{
    camelApps: CamelAppKind[];
  }>({
    camelApps: {
      isList: true,
      groupVersionKind: camelAppGVK,
      namespaced: true,
      namespace: namespace,
    },
  });


  return { CamelApps: resources.camelApps.data, loaded: resources.camelApps.loaded, error: resources.camelApps.loadError };
};
