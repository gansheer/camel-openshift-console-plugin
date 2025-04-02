import { K8sResourceCommon, K8sResourceKind } from '@openshift-console/dynamic-plugin-sdk';

export type CamelIntegrationIdentity = {
  name: string;
  ns: string;
  kind: string;
};

// See how to enrich camelSpec
export type CamelIntegrationKind = K8sResourceKind & {
  spec?: {
    camelSpec: string;
  };
};

export type ConfigMapKind = {
  data?: { [key: string]: string };
  binaryData?: { [key: string]: string };
} & K8sResourceCommon;

export type SecretKind = {
  data?: { [key: string]: string };
  stringData?: { [key: string]: string };
  type?: string;
} & K8sResourceCommon;

export type PersistentVolumeClaimKind = K8sResourceCommon & {
  spec: {
    accessModes: string[];
    resources: {
      requests: {
        storage: string;
      };
    };
    storageClassName: string;
    volumeMode?: string;
    /* Parameters in a cloned PVC */
    dataSource?: {
      name: string;
      kind: string;
      apiGroup: string;
    };
    /**/
  };
  status?: {
    phase: string;
  };
};
