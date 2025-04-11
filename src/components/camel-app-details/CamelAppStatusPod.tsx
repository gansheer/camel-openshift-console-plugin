import * as React from 'react';
import { CamelAppStatusPod } from '../../types';
import { Card, CardBody, TextContent } from '@patternfly/react-core';
import { podGVK } from '../../const';
import { ResourceLink, ResourceStatus } from '@openshift-console/dynamic-plugin-sdk';
import { useTranslation } from 'react-i18next';
import Status from '@openshift-console/dynamic-plugin-sdk/lib/app/components/status/Status';

type CamelAppStatusPodProps = {
    obj: CamelAppStatusPod;
};


const CamelAppStatusPod: React.FC<CamelAppStatusPodProps> = ({ obj: camelPod }) => {
    const { t } = useTranslation('plugin__camel-openshift-console-plugin');

    return (
        <>
            <Card>
                <CardBody>
                    <TextContent>
                        <ResourceLink
                            displayName={camelPod.name}
                            groupVersionKind={podGVK}
                            name={camelPod.name} >
                            <ResourceStatus additionalClassNames="hidden-xs">
                                <Status status={camelPod.status} />
                            </ResourceStatus>
                        </ResourceLink>
                    </TextContent>
                    <TextContent>
                        <strong>{t('Internal IP')}: </strong>{camelPod.internalIp}
                    </TextContent>
                    <h4>{t('Runtime')}:</h4>

                    <TextContent>
                        <strong>{t('Camel Version')}: </strong>{camelPod.runtime.camelVersion}
                    </TextContent>
                    <TextContent>
                        <strong>{t('Runtime Provider')}: </strong>{camelPod.runtime.runtimeProvider}
                    </TextContent>
                    <TextContent>
                        <strong>{t('Runtime Version')}: </strong>{camelPod.runtime.runtimeVersion}
                    </TextContent>

                    <TextContent>
                        <strong>{t('Exchange')}: </strong>TODO
                    </TextContent>

                    <h4>{t('Endpoints')}:</h4>
                    <TextContent>
                        <strong>{t('Health')}: </strong>{camelPod.observe.healthEndpoint}:{camelPod.observe.healthPort}
                    </TextContent>
                    <TextContent>
                        <strong>{t('Metrics')}: </strong>{camelPod.observe.metricsEndpoint}:{camelPod.observe.metricsPort}
                    </TextContent>
                </CardBody>
            </Card>
        </>
    );
};

export default CamelAppStatusPod;