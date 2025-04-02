import * as React from 'react';
import { CamelIntegrationKind } from '../../types';
import { Card, CardBody, CardTitle, Spinner } from '@patternfly/react-core';
import { useCamelIntegrationRoutes } from './useCamelIntegrationResources';
import { K8sResourceKind, ResourceLink, Selector } from '@openshift-console/dynamic-plugin-sdk';
import { podGVK } from '../../const';
import { serviceMatchLabelValue } from '../../utils';
import RouteLocation from './RouteLocation';
import { useTranslation } from 'react-i18next';

type CamelIntegrationRoutesProps = {
  obj: CamelIntegrationKind;
};

type Resources = {
  name: string;
  route: K8sResourceKind;
};

const CamelIntegrationRoutes: React.FC<CamelIntegrationRoutesProps> = ({ obj: camelInt }) => {
  const { t } = useTranslation('plugin__camel-openshift-console-plugin');

  const routes: Resources[] = [];

  const serviceSelector: Selector = {
    matchLabels: {
      'app.kubernetes.io/name': serviceMatchLabelValue(camelInt),
    },
  };

  const { camelIntegrationRoutes, loaded: loadedRoutes } = useCamelIntegrationRoutes(
    camelInt.metadata.namespace,
    serviceSelector,
  );
  if (loadedRoutes && camelIntegrationRoutes.length > 0) {
    camelIntegrationRoutes.forEach((route) => {
      routes.push({
        name: route.metadata.name,
        route: route,
      });
    });
  }

  if (!loadedRoutes) {
    return (
      <Card>
        <CardTitle>Routes</CardTitle>
        <CardBody>
          <Spinner />
        </CardBody>
      </Card>
    );
  }

  if (loadedRoutes && routes.length == 0) {
    return <></>;
  }

  return (
    <Card>
      <CardTitle>Routes</CardTitle>
      <CardBody>
        <ul className="list-group">
          {routes.map((resource, i) => {
            return (
              <li key={i} className="list-group-item">
                <ResourceLink
                  groupVersionKind={podGVK}
                  name={resource.name}
                  namespace={camelInt.metadata.namespace}
                />
                <span className="text-muted">{t('Location:')}</span>
                <RouteLocation obj={resource.route} />
              </li>
            );
          })}
        </ul>
      </CardBody>
    </Card>
  );
};

export default CamelIntegrationRoutes;
