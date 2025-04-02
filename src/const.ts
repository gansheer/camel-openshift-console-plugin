export const FLAG_OPENSHIFT_CAMEL = 'OPENSHIFT_CAMEL';

export const METADATA_LABEL_SELECTOR_CAMEL_APP_KEY = 'camel/integration-runtime';
export const METADATA_LABEL_SELECTOR_CAMEL_APP_VALUE = 'camel';

export const METADATA_ANNOTATION_APP_VERSION = 'app.kubernetes.io/version';

export const METADATA_ANNOTATION_CAMEL_VERSION = 'camel/camel-core-version';

export const METADATA_ANNOTATION_CAMEL_QUARKUS_PLATFORM_VERSION = 'camel/quarkus-platform';
export const METADATA_ANNOTATION_CAMEL_CEQ_VERSION = 'camel/camel-quarkus';

export const METADATA_ANNOTATION_QUARKUS_BUILD_TIMESTAMP = 'app.quarkus.io/build-timestamp';

export const METADATA_ANNOTATION_CAMEL_SPRINGBOOT_VERSION = 'camel/spring-boot-version';
export const METADATA_ANNOTATION_CAMEL_CSB_VERSION = 'camel/camel-spring-boot-version';

export const deploymentGVK = {
  group: 'apps',
  version: 'v1',
  kind: 'Deployment',
};
export const deploymentConfigGVK = {
  group: 'apps.openshift.io',
  version: 'v1',
  kind: 'DeploymentConfig',
};
export const cronJobGVK = {
  group: 'batch',
  version: 'v1',
  kind: 'CronJob',
};
export const jobGVK = {
  group: 'batch',
  version: 'v1',
  kind: 'Job',
};

export const podGVK = {
  group: '',
  version: 'v1',
  kind: 'Pod',
};
export const serviceGVK = {
  group: '',
  version: 'v1',
  kind: 'Service',
};
export const routeGVK = {
  group: 'route.openshift.io',
  version: 'v1',
  kind: 'Route',
};

export const configMapGVK = {
  group: '',
  version: 'v1',
  kind: 'ConfigMap',
};
export const secretGVK = {
  group: '',
  version: 'v1',
  kind: 'Secret',
};
export const persistentVolumeClaimGVK = {
  group: '',
  version: 'v1',
  kind: 'PersistentVolumeClaim',
};

export const ALL_NAMESPACES_KEY = '#ALL_NS#';
