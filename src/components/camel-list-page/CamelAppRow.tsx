import * as React from 'react';
import {
  getGroupVersionKindForResource,
  K8sResourceKind,
  ResourceLink,
  RowProps,
  TableData,
} from '@openshift-console/dynamic-plugin-sdk';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Status from '@openshift-console/dynamic-plugin-sdk/lib/app/components/status/Status';

const getKind = (obj) => obj.metadata.ownerReferences[0].kind;
const getNamespace = (obj) => obj.metadata?.namespace;

const getCamelVersion = (obj: K8sResourceKind): string =>
  obj.metadata.annotations?.['camel/camel-core-version'];

// Check for a modified mouse event. For example - Ctrl + Click
const isModifiedEvent = (event: React.MouseEvent<HTMLElement>) => {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
};

const CamelAppRow: React.FC<RowProps<K8sResourceKind>> = ({ obj: camelInt, activeColumnIDs }) => {
  const { t } = useTranslation('plugin__camel-openshift-console-plugin');
  const camelVersion = getCamelVersion(camelInt);

  // Dead code ?
  const handleClick = (e) => {
    // Don't set last namespace if its modified click (Ctrl+Click).
    if (isModifiedEvent(e)) {
      return;
    }
  };

  return (
    <>
      <TableData id="name" activeColumnIDs={activeColumnIDs}>
        <span className="co-resource-item co-resource-item--truncate">
          <span className="co-m-resource-icon co-m-resource-secret">C</span>
          <Link
            to={`/camel/app/ns/${camelInt.metadata.namespace}/name/${camelInt.metadata.name}`}
            className="co-resource-item__resource-name"
            title={camelInt.metadata.name}
            onClick={handleClick}
          >
            {camelInt.metadata.name}
          </Link>
        </span>
      </TableData>
      <TableData id="kind" activeColumnIDs={activeColumnIDs}>
        <span className="co-break-word co-line-clamp">
          <ResourceLink
            displayName={getKind(camelInt)}
            groupVersionKind={getGroupVersionKindForResource(camelInt.metadata.ownerReferences[0])}
            name={camelInt.metadata.ownerReferences[0].name}
            namespace={camelInt.metadata.namespace}
          />
        </span>
      </TableData>
      <TableData id="namespace" activeColumnIDs={activeColumnIDs}>
        <span className="co-break-word co-line-clamp">
          {getNamespace(camelInt) || <span className="text-muted">{t('No namespace')}</span>}
        </span>
      </TableData>
      <TableData id="status" activeColumnIDs={activeColumnIDs}>
        <Status
          status={camelInt.status.Phase}
        />
      </TableData>
      <TableData id="camel" activeColumnIDs={activeColumnIDs}>
        {camelVersion || <span className="text-muted">{t('No camel version')}</span>}
      </TableData>
    </>
  );
};

export default CamelAppRow;
