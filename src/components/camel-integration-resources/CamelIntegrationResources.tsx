import * as React from 'react';
import { CamelIntegrationKind } from '../../types';
import CamelIntegrationPods from './CamelIntegrationPods';
import CamelIntegrationServices from './CamelIntegrationServices';
import CamelIntegrationRoutes from './CamelIntegrationRoutes';
import { Card, CardBody, CardTitle } from '@patternfly/react-core';
import CamelIntegrationJobs from './CamelIntegrationJobs';

type CamelIntegrationResourcesProps = {
  obj: CamelIntegrationKind;
};

// TODO : add volumes
const CamelIntegrationResources: React.FC<CamelIntegrationResourcesProps> = ({ obj: camelInt }) => {
  return (
    <Card>
      <CardTitle>Resources</CardTitle>
      <CardBody>
        <CamelIntegrationPods obj={camelInt} />
        <CamelIntegrationJobs obj={camelInt} />
        <CamelIntegrationServices obj={camelInt} />
        <CamelIntegrationRoutes obj={camelInt} />
      </CardBody>
    </Card>
  );
};

export default CamelIntegrationResources;
