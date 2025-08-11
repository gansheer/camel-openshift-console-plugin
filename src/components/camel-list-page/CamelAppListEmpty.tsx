import * as React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import '../../camel.css';
import { EmptyState, EmptyStateBody, Hint, HintBody, HintTitle, PageSection } from '@patternfly/react-core';
import CamelIcon from './CamelIcon';

const CamelAppListEmpty: React.FC = () => {
    const { t } = useTranslation('plugin__camel-openshift-console-plugin');


    return (

        <EmptyState titleText='No Camel Application found'
            icon={CamelIcon}
            headingLevel='h2'>
            <EmptyStateBody>
                <PageSection className='pf-v6-u-text-align-start'>
                    <Hint>
                        <HintTitle>{t('Create a new Camel Application')}</HintTitle>
                        <HintBody>
                            <Trans t={t}>
                                <p>
                                    Add some blabla.
                                </p>
                            </Trans>
                        </HintBody>
                    </Hint>

                </PageSection>
            </EmptyStateBody>
        </EmptyState>

    );
};


export default CamelAppListEmpty;