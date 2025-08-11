import { Alert, PageSection } from '@patternfly/react-core';
import * as React from 'react';
import { Trans, useTranslation } from 'react-i18next';

const CamelAppNotAvailable: React.FC = () => {
    const { t } = useTranslation('plugin__camel-openshift-console-plugin');

    return (
        <PageSection className='pf-v6-u-text-align-start'>
            <Alert title={t('Camel Dashboard Operator is missing')} variant="warning" isInline>
                <Trans t={t}>
                    <p>
                        The <a href="https://camel-tooling.github.io/camel-dashboard-operator/">Camel Dashboard Operator</a> is required because it is responsible for detecting the applications deployed on the cluster.
                    </p>
                    <p>
                        Please <a href="https://camel-tooling.github.io/camel-dashboard-operator/installation/">install</a> the operator.
                    </p>
                </Trans>
            </Alert>
        </PageSection>


    );
};


export default CamelAppNotAvailable;