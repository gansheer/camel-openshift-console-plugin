import * as React from 'react';
import { useTranslation } from 'react-i18next';
import CamelIntegrationDetails from '../camel-integration-details/CamelIntegrationDetails';
import { NavPage } from '@openshift-console/dynamic-plugin-sdk';
import CamelIntegrationResources from '../camel-integration-resources/CamelIntegrationResources';
import { CamelIntegrationKind } from '../../types';

export const useCamelIntegrationTabs = (camelIntegration: CamelIntegrationKind): NavPage[] => {
  const { t } = useTranslation('plugin__camel-openshift-console-plugin');

  return [
    {
      component: () => <CamelIntegrationDetails obj={camelIntegration} />,
      href: '',
      name: t('Details'),
    },
    {
      component: () => <CamelIntegrationResources obj={camelIntegration} />,
      href: 'resources',
      name: t('Resources'),
    },
  ];
};
