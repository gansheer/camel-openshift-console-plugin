import * as React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ListPageBody,
  ListPageFilter,
  ListPageHeader,
  NamespaceBar,
  useActiveNamespace,
  useFlag,
  useListPageFilter,
  VirtualizedTable,
} from '@openshift-console/dynamic-plugin-sdk';
import '../../camel.css';
import CamelAppRow from './CamelAppRow';
import useCamelAppColumns from './useCamelAppColumns';
import { useCamelAppList } from './useCamelAppList';
import { ALL_NAMESPACES_KEY } from '../../const';
import { camelAppRowFilters } from './useCamelAppRowFilters';
import CamelAppNotAvailable from './CamelAppNotAvailable';
import CamelAppListEmpty from './CamelAppListEmpty';

// Note : using this as inspiration for the list: https://github.com/openshift-pipelines/console-plugin/blob/main/src/components/projects-list/ProjectsRow.tsx#L91

type CamelAppProps = {
  ns: string;
  showTitle?: boolean;
};

const CamelAppList: React.FC<CamelAppProps> = () => {
  const { t } = useTranslation('plugin__camel-openshift-console-plugin');

  const [activeNamespace, setActiveNamespace] = useActiveNamespace();

  const filterCamelAppsNamespace = (activeNamespace: string): string => {
    return activeNamespace === ALL_NAMESPACES_KEY ? '' : activeNamespace;
  };

  const columns = useCamelAppColumns(filterCamelAppsNamespace(activeNamespace));
  const { CamelApps, loaded, error } = useCamelAppList(filterCamelAppsNamespace(activeNamespace));

  const [staticData, filteredData, onFilterChange] = useListPageFilter(
    CamelApps,
    camelAppRowFilters(CamelApps),
  );

  const operatorInstalled = useFlag("CAMEL_APP_FLAG");

  // TODO add filters

  return !operatorInstalled ? (
    <>
      <NamespaceBar onNamespaceChange={setActiveNamespace} />
      <ListPageHeader title={t('Camel Applications')} />
      <CamelAppNotAvailable />
    </>) : (
    <>
      <NamespaceBar onNamespaceChange={setActiveNamespace} />

      <ListPageHeader title={t('Camel Applications')} />

      <ListPageBody>
        <ListPageFilter
          data={staticData}
          onFilterChange={onFilterChange}
          loaded={loaded}
          rowFilters={camelAppRowFilters(CamelApps)}
        />

        <VirtualizedTable
          EmptyMsg={() => (
            <CamelAppListEmpty />
          )}
          columns={columns}
          data={filteredData}
          loaded={loaded}
          loadError={error}
          Row={CamelAppRow}
          unfilteredData={staticData}
        />
      </ListPageBody>
    </>
  );
};

export default CamelAppList;
