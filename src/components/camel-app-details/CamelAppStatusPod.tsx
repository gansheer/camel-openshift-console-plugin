import * as React from 'react';
import { CamelAppKind, CamelAppStatusPod } from '../../types';
import {
  Card,
  CardBody,
  TextList,
  TextListItem,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
} from '@patternfly/react-core';
import { podGVK } from '../../const';
import { ResourceLink, ResourceStatus } from '@openshift-console/dynamic-plugin-sdk';
import { useTranslation } from 'react-i18next';
import Status from '@openshift-console/dynamic-plugin-sdk/lib/app/components/status/Status';

type CamelAppStatusPodProps = {
  obj: CamelAppKind;
  pod: CamelAppStatusPod;
};

const CamelAppStatusPod: React.FC<CamelAppStatusPodProps> = ({ obj: camelInt, pod: camelPod }) => {
  const { t } = useTranslation('plugin__camel-openshift-console-plugin');

  return (
    <>
      <Card>
        <CardBody>
          <h4>
            <ResourceLink
              displayName={camelPod.name}
              groupVersionKind={podGVK}
              name={camelPod.name}
              namespace={camelInt.metadata.namespace}
            >
              <ResourceStatus additionalClassNames="hidden-xs">
                <Status status={camelPod.status} />
              </ResourceStatus>
            </ResourceLink>
          </h4>
          <DescriptionList
            columnModifier={{
              default: '1Col',
            }}
          >
            <DescriptionListGroup>
              <DescriptionListTerm>{t('Internal IP')}:</DescriptionListTerm>
              <DescriptionListDescription>{camelPod.internalIp}</DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
              <DescriptionListTerm>{t('Runtime')}:</DescriptionListTerm>
              <DescriptionListDescription>
                <TextList>
                  <TextListItem>
                    <strong>{t('Camel Version')}: </strong>
                    {camelPod.runtime.camelVersion}
                  </TextListItem>
                  <TextListItem>
                    <strong>{t('Runtime Provider')}: </strong>
                    {camelPod.runtime.runtimeProvider}
                  </TextListItem>
                  <TextListItem>
                    <strong>{t('Runtime Version')}: </strong>
                    {camelPod.runtime.runtimeVersion}
                  </TextListItem>
                </TextList>
              </DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
              <DescriptionListTerm>{t('Exchange')}:</DescriptionListTerm>
              <DescriptionListDescription>
                <TextList>
                  <TextListItem>
                    <strong>{t('succeed')}: </strong>{' '}
                    {camelPod.runtime.exchange.succeed ? camelPod.runtime.exchange.succeed : 0}
                  </TextListItem>
                  <TextListItem>
                    <strong>{t('pending')}: </strong>{' '}
                    {camelPod.runtime.exchange.pending ? camelPod.runtime.exchange.pending : 0}
                  </TextListItem>
                  <TextListItem>
                    <strong>{t('failed')}: </strong>{' '}
                    {camelPod.runtime.exchange.failed ? camelPod.runtime.exchange.failed : 0}
                  </TextListItem>
                  <TextListItem>
                    <strong>{t('total')}: </strong>{' '}
                    {camelPod.runtime.exchange.total ? camelPod.runtime.exchange.total : 0}
                  </TextListItem>
                </TextList>
              </DescriptionListDescription>
            </DescriptionListGroup>

            <DescriptionListGroup>
              <DescriptionListTerm>{t('Endpoints')}:</DescriptionListTerm>
              <DescriptionListDescription>
                <TextList>
                  <TextListItem>
                    <strong>{t('Health')}: </strong>
                    {camelPod.observe.healthEndpoint}:{camelPod.observe.healthPort}
                  </TextListItem>
                  <TextListItem>
                    <strong>{t('Metrics')}: </strong>
                    {camelPod.observe.metricsEndpoint}:{camelPod.observe.metricsPort}
                  </TextListItem>
                </TextList>
              </DescriptionListDescription>
            </DescriptionListGroup>
          </DescriptionList>
        </CardBody>
      </Card>
    </>
  );
};

export default CamelAppStatusPod;
