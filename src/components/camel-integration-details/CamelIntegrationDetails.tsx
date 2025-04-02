import * as React from 'react';
import { CamelIntegrationKind } from '../../types';
import { Card, CardBody, CardTitle, TextContent } from '@patternfly/react-core';
import { useTranslation } from 'react-i18next';
import { K8sGroupVersionKind, ResourceLink } from '@openshift-console/dynamic-plugin-sdk';
import { camelIntegrationGVK, getBuildTimestamp, getHealthEndpoints } from '../../utils';

type CamelIntegrationDetailsProps = {
  obj: CamelIntegrationKind;
};

type CamelIntegrationDetails = {
  groupVersionKind: K8sGroupVersionKind;
  name: string;
  namespace: string;
  version: string;
  buildTimestamp: string;
  runtimeFramework: string;
  runtimeVersion: string;
  frameworkVersion: string;
  healthEndpoints: string[];
  metricsEndpoint: string;
};

const CamelIntegrationDetails: React.FC<CamelIntegrationDetailsProps> = ({ obj: camelInt }) => {
  const { t } = useTranslation('plugin__camel-openshift-console-plugin');

  // TODO : replace with real CR values
  const camelIntegrationDetails = {
    groupVersionKind: camelIntegrationGVK(camelInt.kind),
    name: camelInt.metadata.name,
    namespace: camelInt.metadata.namespace,
    version: '4.10.2',
    buildTimestamp: getBuildTimestamp(camelInt),
    runtimeFramework: 'quarkus',
    runtimeVersion: '3.20.0',
    healthEndpoints: getHealthEndpoints('quarkus'),
    metricsEndpoint: '/observe/metrics',
  };

  console.log(camelIntegrationDetails);

  return (
    <div className="co-m-pane__body">
      <h2>{t('Camel Integration Details')}</h2>
      <Card>
        <CardTitle>{t('Details')}</CardTitle>
        <CardBody>
          <ResourceLink
            groupVersionKind={camelIntegrationDetails.groupVersionKind}
            name={camelIntegrationDetails.name}
            namespace={camelIntegrationDetails.namespace}
            linkTo={true}
          />
          <TextContent>
            <strong>{t('Version')}: </strong>
            {camelIntegrationDetails.version || (
              <span className="text-muted">{t('No version')}</span>
            )}
          </TextContent>
          <TextContent>
            <strong>{t('Build Timestamp')}: </strong>
            {camelIntegrationDetails.buildTimestamp || (
              <span className="text-muted">{t('No build timestamp')}</span>
            )}
          </TextContent>
        </CardBody>
      </Card>
      <Card>
        <CardTitle>{t('Endpoints')}</CardTitle>
        <CardBody>
          <TextContent>
            <strong>{t('Health Endpoints')}: </strong>
            {camelIntegrationDetails.healthEndpoints
              ? camelIntegrationDetails.healthEndpoints.map((endpoint, i) => {
                  return <TextContent key={i}> {endpoint}</TextContent>;
                })
              : '-'}
          </TextContent>
          <TextContent>
            <strong>{t('Metrics Endpoint')}: </strong>
            {camelIntegrationDetails.metricsEndpoint ? (
              <TextContent> {camelIntegrationDetails.metricsEndpoint}</TextContent>
            ) : (
              '-'
            )}
          </TextContent>
        </CardBody>
      </Card>
      <Card>
        <CardTitle>{t('Frameworks')}</CardTitle>
        <CardBody>
          <TextContent>
            <strong>{t('Runtime')}: </strong> {camelIntegrationDetails.runtimeFramework}
          </TextContent>
          <TextContent>
            <strong>{t('Runtime version')}: </strong> {camelIntegrationDetails.runtimeVersion}
          </TextContent>
        </CardBody>
      </Card>
    </div>
  );
};

export default CamelIntegrationDetails;
