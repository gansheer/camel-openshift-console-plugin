import * as React from 'react';
import { Link } from 'react-router-dom-v5-compat';
import { Breadcrumb, BreadcrumbItem } from '@patternfly/react-core';
import { useTranslation } from 'react-i18next';
import { ALL_NAMESPACES_KEY } from '../../const';
import { ResourceStatus, useActiveNamespace } from '@openshift-console/dynamic-plugin-sdk';
import { CamelAppKind } from 'src/types';
import Status from '@openshift-console/dynamic-plugin-sdk/lib/app/components/status/Status';

type CamelAppTitleProps = {
  name: string;
  namespace: string;
  obj: CamelAppKind;
};

export const getUrlList = (namespace): string => {
  if (namespace === ALL_NAMESPACES_KEY) {
    return `/camel/all-namespaces`;
  } else {
    return `/camel/ns/` + namespace;
  }
};

const CamelAppTitle: React.FC<CamelAppTitleProps> = ({ name, obj }) => {
  const { t } = useTranslation('plugin__camel-openshift-console-plugin');

  const [activeNamespace] = useActiveNamespace();

  return (
    <>
      <div className="co-m-nav-title co-m-nav-title--detail">
        <div>
          <Breadcrumb className="pf-v6-c-breadcrumb co-breadcrumb">
            <BreadcrumbItem>
              <Link to={getUrlList(activeNamespace)}>{t('Camel')}</Link>
            </BreadcrumbItem>
            <BreadcrumbItem>{t('Camel Details')}</BreadcrumbItem>
          </Breadcrumb>
        </div>
        <span className="co-m-pane__heading">
          <h1 className="co-resource-item__resource-name">
            <span className="co-m-resource-icon co-m-resource-secret co-m-resource-icon--lg">
              {t('C')}
            </span>
            {name}
            <ResourceStatus>
              <Status status={obj?.status?.phase}/>
            </ResourceStatus>
          </h1>
        </span>
      </div>
    </>
  );
};

export default CamelAppTitle;
