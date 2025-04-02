import * as _ from 'lodash';
import {
  cronJobGVK,
  deploymentConfigGVK,
  deploymentGVK,
  METADATA_ANNOTATION_APP_VERSION,
  METADATA_ANNOTATION_QUARKUS_BUILD_TIMESTAMP,
} from './const';
import { CamelIntegrationKind } from './types';

export function camelIntegrationGVK(kind: string) {
  switch (kind) {
    case deploymentConfigGVK.kind:
      return deploymentConfigGVK;
    case cronJobGVK.kind:
      return cronJobGVK;
    default:
      return deploymentGVK;
  }
}

export function getIntegrationVersion(integration: CamelIntegrationKind): string | null {
  if (integration && integration.metadata) {
    return integration.metadata.annotations?.[METADATA_ANNOTATION_APP_VERSION];
  }
  return null;
}

export function getBuildTimestamp(integration: CamelIntegrationKind): string | null {
  if (integration && integration.metadata) {
    return integration.metadata.annotations?.[METADATA_ANNOTATION_QUARKUS_BUILD_TIMESTAMP];
  }
  return null;
}

export function getHealthEndpoints(framework: string): string[] {
  switch (framework) {
    case 'quarkus':
      return ['/observe/health/live', '/observe/health/ready', '/observe/health/started'];
    case 'Spring-Boot':
      return ['/observe/health/liveness', '/observe/health/readiness'];
    default:
      return [];
  }
}

// TODO use something else than Unknown
export function serviceMatchLabelValue(camelInt: CamelIntegrationKind): string {
  if (camelInt.kind == 'Deployment') {
    return camelInt.spec.selector.matchLabels['app.kubernetes.io/name'];
  } else if (camelInt.kind == 'DeploymentConfig') {
    return camelInt.spec.selector['app.kubernetes.io/name'];
  } else if (camelInt.kind == 'CronJob') {
    return camelInt.metadata.labels['app.kubernetes.io/name'];
  }
  return 'Unknown';
}

// Pods status utils

const isContainerFailedFilter = (containerStatus) => {
  return containerStatus.state.terminated && containerStatus.state.terminated.exitCode !== 0;
};

export const isContainerLoopingFilter = (containerStatus) => {
  return (
    containerStatus.state.waiting && containerStatus.state.waiting.reason === 'CrashLoopBackOff'
  );
};

const numContainersReadyFilter = (pod) => {
  const {
    status: { containerStatuses },
  } = pod;
  let numReady = 0;
  _.forEach(containerStatuses, (status) => {
    if (status.ready) {
      numReady++;
    }
  });
  return numReady;
};

const isReady = (pod) => {
  const {
    spec: { containers },
  } = pod;
  const numReady = numContainersReadyFilter(pod);
  const total = _.size(containers);

  return numReady === total;
};

const podWarnings = (pod) => {
  const {
    status: { phase, containerStatuses },
  } = pod;
  if (phase === 'Running' && containerStatuses) {
    return _.map(containerStatuses, (containerStatus) => {
      if (!containerStatus.state) {
        return null;
      }

      if (isContainerFailedFilter(containerStatus)) {
        if (_.has(pod, ['metadata', 'deletionTimestamp'])) {
          return 'Failed';
        }
        return 'Warning';
      }
      if (isContainerLoopingFilter(containerStatus)) {
        return 'CrashLoopBackOff';
      }
      return null;
    }).filter((x) => x);
  }
  return null;
};

export const getPodStatus = (pod) => {
  if (_.has(pod, ['metadata', 'deletionTimestamp'])) {
    return 'Terminating';
  }
  const warnings = podWarnings(pod);
  if (warnings !== null && warnings.length) {
    if (warnings.includes('CrashLoopBackOff')) {
      return 'CrashLoopBackOff';
    }
    if (warnings.includes('Failed')) {
      return 'Failed';
    }
    return 'Warning';
  }
  const phase = _.get(pod, ['status', 'phase'], 'Unknown');
  if (phase === 'Running' && !isReady(pod)) {
    return 'NotReady';
  }
  return phase;
};
