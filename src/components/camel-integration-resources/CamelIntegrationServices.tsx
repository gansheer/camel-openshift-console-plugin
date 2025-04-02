import * as React from 'react';
import { Card, CardBody, CardTitle, Spinner } from '@patternfly/react-core';
import { CamelIntegrationKind } from '../../types';
import { ResourceLink, Selector } from '@openshift-console/dynamic-plugin-sdk';
import { serviceGVK } from '../../const';
import { useCamelIntegrationServices } from './useCamelIntegrationResources';
import { serviceMatchLabelValue } from '../../utils';
import { LongArrowAltRightIcon } from '@patternfly/react-icons';
import { useTranslation } from 'react-i18next';

type CamelIntegrationServicesProps = {
  obj: CamelIntegrationKind;
};

type Resources = {
  name: string;
  ports: [];
};

const CamelIntegrationServices: React.FC<CamelIntegrationServicesProps> = ({ obj: camelInt }) => {
  const { t } = useTranslation('plugin__camel-openshift-console-plugin');

  const services: Resources[] = [];

  const serviceSelector: Selector = {
    matchLabels: {
      'app.kubernetes.io/name': serviceMatchLabelValue(camelInt),
    },
  };

  const { camelIntegrationServices, loaded: loadedServices } = useCamelIntegrationServices(
    camelInt.metadata.namespace,
    serviceSelector,
  );
  if (loadedServices && camelIntegrationServices.length > 0) {
    camelIntegrationServices.forEach((service) => {
      services.push({
        name: service.metadata.name,
        ports: service.spec?.ports ?? [],
      });
    });
  }

  if (!loadedServices) {
    return (
      <Card>
        <CardTitle>Services</CardTitle>
        <CardBody>
          <Spinner />
        </CardBody>
      </Card>
    );
  }

  if (loadedServices && services.length == 0) {
    return <></>;
  }

  return (
    <Card>
      <CardTitle>Services</CardTitle>
      <CardBody>
        <ul className="list-group">
          {services.map((resource, i) => {
            return (
              <li key={i} className="list-group-item">
                <ResourceLink
                  groupVersionKind={serviceGVK}
                  name={resource.name}
                  namespace={camelInt.metadata.namespace}
                />
                <ul className="port-list">
                  {resource.ports.map(({ name, port, protocol, targetPort }) => (
                    <li key={name || `${protocol}/${port}`}>
                      <span className="text-muted">{t('Service port:')}</span>{' '}
                      {name || `${protocol}/${port}`}
                      &nbsp;
                      <LongArrowAltRightIcon />
                      &nbsp;
                      <span className="text-muted">{t('Pod port:')}</span> {targetPort}
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
      </CardBody>
    </Card>
  );
};

export default CamelIntegrationServices;
