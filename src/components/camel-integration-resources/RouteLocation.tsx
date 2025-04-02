import * as React from 'react';
import * as _ from 'lodash';
import i18next from 'i18next';
import { K8sResourceCondition, K8sResourceKind } from '@openshift-console/dynamic-plugin-sdk';

export type RouteHostnameProps = {
  obj: K8sResourceKind;
};

export type RouteIngress = {
  conditions: K8sResourceCondition[];
  host?: string;
  routerCanonicalHostname?: string;
  routerName?: string;
  wildcardPolicy?: string;
};

const RouteLocation: React.FC<RouteHostnameProps> = ({ obj }) => {
  if (isWebRoute(obj)) {
    const link = getRouteWebURL(obj);
    return (
      <div className="co-external-link co-external-link--block">
        <a href={link} target="_blank" rel="noopener noreferrer">
          {link}
        </a>
      </div>
    );
  } else {
    const label = getRouteLabel(obj);
    return <>{label}</>;
  }
};

const getRouteHost = (route: K8sResourceKind, onlyAdmitted: boolean): string => {
  let oldestAdmittedIngress: RouteIngress;
  let oldestTransitionTime: string;
  _.each(route.status.ingress, (ingress) => {
    const admittedCondition = _.find(ingress.conditions, { type: 'Admitted', status: 'True' });
    if (
      admittedCondition &&
      (!oldestTransitionTime || oldestTransitionTime > admittedCondition.lastTransitionTime)
    ) {
      oldestAdmittedIngress = ingress;
      oldestTransitionTime = admittedCondition.lastTransitionTime;
    }
  });

  if (oldestAdmittedIngress) {
    return oldestAdmittedIngress.host;
  }

  return onlyAdmitted ? null : route.spec.host;
};

const isWebRoute = (route: K8sResourceKind): boolean => {
  return !!getRouteHost(route, true) && _.get(route, 'spec.wildcardPolicy') !== 'Subdomain';
};

const getRouteWebURL = (route: K8sResourceKind): string => {
  const scheme = _.get(route, 'spec.tls.termination') ? 'https' : 'http';
  let url = `${scheme}://${getRouteHost(route, false)}`;
  if (route.spec.path) {
    url += route.spec.path;
  }
  return url;
};

const getSubdomain = (route: K8sResourceKind): string => {
  const hostname = _.get(route, 'spec.host', '');
  return hostname.replace(/^[a-z0-9]([-a-z0-9]*[a-z0-9])\./, '');
};

const getRouteLabel = (route: K8sResourceKind): string => {
  let label = getRouteHost(route, false);
  if (!label) {
    return i18next.t('unknown host');
  }

  if (_.get(route, 'spec.wildcardPolicy') === 'Subdomain') {
    label = `*.${getSubdomain(route)}`;
  }

  if (route.spec.path) {
    label += route.spec.path;
  }
  return label;
};

export default RouteLocation;
