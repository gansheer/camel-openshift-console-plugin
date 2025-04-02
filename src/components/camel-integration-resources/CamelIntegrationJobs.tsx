import * as React from "react";
import { CamelIntegrationKind } from "../../types";
import { useCamelIntegrationJobs } from "./useCamelIntegrationResources";
import { Card, CardBody, CardTitle, Spinner } from "@patternfly/react-core";
import { jobGVK } from "../../const";
import { K8sResourceKind, ResourceLink } from "@openshift-console/dynamic-plugin-sdk";
import Status from "@openshift-console/dynamic-plugin-sdk/lib/app/components/status/Status";

type CamelIntegrationJobsProps = {
  obj: CamelIntegrationKind;
};

type Resources = {
  name: string;
  status: string;
};

const CamelIntegrationJobs: React.FC<CamelIntegrationJobsProps> = ({ obj: camelInt }) => {

  const jobs: Resources[] = [];

  const { camelIntegrationJobs, loaded: loadedJobs } = useCamelIntegrationJobs(
    camelInt.metadata.namespace,
    camelInt.spec.selector,
  );
  if (loadedJobs && camelIntegrationJobs.length > 0) {
    camelIntegrationJobs.forEach((job) => {
      getJobsStatus(job);
      jobs.push({
        name: job.metadata.name,
        status: getJobsStatus(job),
      });
    });
  }
  if (!loadedJobs) {
    return (
      <Card>
        <CardTitle>Jobs</CardTitle>
        <CardBody>
          <Spinner />
        </CardBody>
      </Card>
    );
  }

  if (loadedJobs && jobs.length == 0) {
    return <></>;
  }

  return (
    <Card>
      <CardTitle>Jobs</CardTitle>
      <CardBody>
        <ul className="list-group">
          {jobs.map((resource, i) => {
            return (
              <li key={i} className="list-group-item container-fluid">
                <div className="job-overview__item">
                  <ResourceLink
                    groupVersionKind={jobGVK}
                    name={resource.name}
                    namespace={camelInt.metadata.namespace}
                  />
                  <Status title={resource.status || 'N/A'} status={resource.status} />
                </div>
              </li>
            );
          })}
        </ul>
      </CardBody>
    </Card>
  );
};


const getJobsStatus = (job: K8sResourceKind): string => {
  let finished = job.status?.conditions?.filter((condition) => condition.type == 'Complete' && condition.status == 'True').length == 1;
  let succeeded = job.status?.conditions?.filter((condition) => condition.type == 'SuccessCriteriaMet' && condition.status == 'True').length == 1;
  if (finished) {
    if (succeeded) {
      return 'Succeeded';
    } else {
      return 'Failed';
    }
  } else {
    return 'Running';
  }
}

export default CamelIntegrationJobs;