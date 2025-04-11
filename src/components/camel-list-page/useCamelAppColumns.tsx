import { K8sResourceKind, TableColumn } from '@openshift-console/dynamic-plugin-sdk';
import { sortable } from '@patternfly/react-table';
import { useTranslation } from 'react-i18next';
import { CamelAppStatusValue } from './CamelAppStatus';

export const sortResourceByStatus =
  (direction: string) => (a: K8sResourceKind, b: K8sResourceKind) => {
    const { first, second } =
      direction === 'asc' ? { first: a, second: b } : { first: b, second: a };

    const firstValue = CamelAppStatusValue(first);
    const secondValue = CamelAppStatusValue(second);

    return firstValue?.localeCompare(secondValue);
  };

const useCamelAppColumns = (namespace): TableColumn<K8sResourceKind>[] => {
  const { t } = useTranslation('plugin__camel-openshift-console-plugin');
  return [
    {
      title: t('Name'),
      id: 'name',
      sort: 'metadata.name',
      transforms: [sortable],
    },
    {
      title: t('Kind'),
      id: 'kind',
      sort: 'metadata.ownerReferences[0].kind',
      transforms: [sortable],
    },
    ...(!namespace
      ? [
          {
            title: t('Namespace'),
            id: 'namespace',
            sort: 'metadata.namespace',
            transforms: [sortable],
          },
        ]
      : []),
    {
      title: t('Status'),
      id: 'status',
      sort: 'satus.phase',
      transforms: [sortable],
    },
    {
      title: t('Camel'),
      id: 'camel',
      sort: "status.pods.runtime.vamelVersion",
      transforms: [sortable],
    },
  ];
};

export default useCamelAppColumns;
