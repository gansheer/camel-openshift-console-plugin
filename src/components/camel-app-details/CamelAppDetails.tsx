import * as React from 'react';
import { CamelAppKind } from '../../types';
import { Card, CardBody, TextContent } from '@patternfly/react-core';
import { useTranslation } from 'react-i18next';
import { K8sGroupVersionKind, ResourceLink } from '@openshift-console/dynamic-plugin-sdk';
import { camelAppGVK } from '../../const';
import CamelAppStatusPod from './CamelAppStatusPod';

type CamelAppDetailsProps = {
  obj: CamelAppKind;
};

type CamelAppDetails = {
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

const CamelAppDetails: React.FC<CamelAppDetailsProps> = ({ obj: camelInt }) => {
  const { t } = useTranslation('plugin__camel-openshift-console-plugin');


  return (
    <div className="co-m-pane__body">
      <h2>{t('Camel App Details')}</h2>
      <Card>
        <CardBody>
          <ResourceLink
            displayName={camelInt.metadata.name}
            groupVersionKind={camelAppGVK}
            name={camelInt.metadata.name}
            namespace={camelInt.metadata.namespace}
          />
          <TextContent>
            <strong>{t('Image')}: </strong>
            {camelInt.status.image}
          </TextContent>

        </CardBody>

      </Card>

      <ul className="list-group">
      {camelInt.status.pods
            ? camelInt.status.pods.map((pod, i) => {
              return <li key={i} className="list-group-item"><CamelAppStatusPod obj={pod} /></li>;
            })
            : ''}
      </ul>
      
    </div>
  );
};

export default CamelAppDetails;
