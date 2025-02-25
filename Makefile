# Licensed to the Apache Software Foundation (ASF) under one or more
# contributor license agreements.  See the NOTICE file distributed with
# this work for additional information regarding copyright ownership.
# The ASF licenses this file to You under the Apache License, Version 2.0
# (the "License"); you may not use this file except in compliance with
# the License.  You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

#
# Use bash explicitly in this Makefile to avoid unexpected platform
# incompatibilities among Linux distros.
#
SHELL := /bin/bash

VERSION := 0.0.1
PLUGIN := camel-openshift-console-plugin
PLUGIN_IMAGE := quay.io/camel-tooling/camel-openshift-console-plugin
#PLUGIN_DOCKERFILE := Dockerfile-plugin
#GATEWAY_IMAGE := quay.io/hawtio/online-console-plugin-gateway
#GATEWAY_DOCKERFILE := Dockerfile-gateway

# Replace SNAPSHOT with the current timestamp
DATETIMESTAMP=$(shell date -u '+%Y%m%d-%H%M%S')
VERSION := $(subst -SNAPSHOT,-$(DATETIMESTAMP),$(VERSION))

# DEPRECATED
IMAGE_NAME_PLUGIN=quay.io/camel-tooling/camel-openshift-console-plugin
IMAGE_NAME_SERVICE_PROXY=quay.io/camel-tooling/camel-openshift-console-service-proxy

#
# =======================
# Override-able Variables
# =======================
#

#
# the image name and version
#

CUSTOM_PLUGIN_IMAGE ?= $(PLUGIN_IMAGE)
CUSTOM_PLUGIN_VERSION ?= $(VERSION)



#
# =======================
# Environment Checks
# =======================
#


yarn:
ifeq (, $(shell command -v yarn 2> /dev/null))
	$(error "No yarn found in PATH. Please install and re-run")
endif

podman:
ifeq (, $(shell command -v podman 2> /dev/null))
	$(error "No podman found in PATH. Please install and re-run")
endif

oc:
ifeq (, $(shell command -v oc 2> /dev/null))
	$(error "No oc found in PATH. Please install and re-run")
endif

helm:
ifeq (, $(shell command -v helm 2> /dev/null))
	$(error "No helm found in PATH. Please install and re-run")
endif

.PHONY: yarn podman oc helm

#
# =========================
# Development and Building
# =========================
#


#---
#
#@ plugin-setup
#
#== Sets up yarn by installing all dependencies
#
#=== Calls yarn
#
#---
plugin-setup: yarn
	@echo "####### Setup $(PLUGIN) ..."
	cd plugin && yarn install

#---
#
#@ plugin-build
#
#== Performs a local build of the console plugin
#
#=== Calls plugin-setup
#
#---
plugin-build: plugin-setup
	@echo "####### Building $(PLUGIN) ..."
	cd plugin && yarn build


# Deprecated - to remove
service-proxy:
	cd service-proxy && mvn clean install

# Deprecated - to remove
service-proxy-image: service-proxy
	podman build -t $(IMAGE_NAME_SERVICE_PROXY):latest service-proxy -f service-proxy/src/main/docker/Dockerfile.jvm


#---
#
#@ plugin-image
#
#== Executes a local build of the production container images
#
#=== Calls podman
#
#---
plugin-image: podman
	podman build -t $(IMAGE_NAME_PLUGIN):latest plugin


# Deprecated to remove or refactor
images: plugin-image service-proxy-image

# Deprecated to remove or refactor
push-service-proxy: service-proxy-image
	podman push $(IMAGE_NAME_SERVICE_PROXY):latest

#---
#
#@ push-plugin
#
#== Pushes the locally build image to the registry
#
#=== Calls podman
#
#---
push-plugin: podman
	podman push $(IMAGE_NAME_PLUGIN):latest

# Deprecated to remove or refactor
push: push-plugin push-service-proxy


.PHONY: plugin-setup plugin-build plugin-image push-plugin

#
# ============================
# Installation and Deployment
# ============================
#



#---
#
#@ deploy-plugin
#
#== Install the plugin into an OCP cluster
#
#=== Calls oc
#=== Calls helm
#
#---
deploy-plugin: oc helm
	./bin/camel-install-openshift-console-plugin

# Deprecated to remove
deploy-proxy:
	cd service-proxy && \
	mvn clean install && \
	camel deploy openshift --image-build --namespace plugin-camel-openshift-console-plugin

# Deprecated to remove or refactor
deploy: deploy-plugin deploy-proxy

#---
#
#@ undeploy
#
#== Install the plugin into an OCP cluster
#
#=== Calls helm
#
#---
undeploy: helm
	helm uninstall camel-openshift-console-plugin --namespace=plugin-camel-openshift-console-plugin

all: plugin-image push-plugin deploy-plugin

help: ## Show this help screen.
	@awk 'BEGIN { printf "\nUsage: make \033[31m<PARAM1=val1 PARAM2=val2>\033[0m \033[36m<target>\033[0m\n"; printf "\nAvailable targets are:\n" } /^#@/ { printf "\033[36m%-15s\033[0m", $$2; subdesc=0; next } /^#===/ { printf "%-14s \033[32m%s\033[0m\n", " ", substr($$0, 5); subdesc=1; next } /^#==/ { printf "\033[0m%s\033[0m\n\n", substr($$0, 4); next } /^#\*\*/ { printf "%-14s \033[31m%s\033[0m\n", " ", substr($$0, 4); next } /^#\*/ && (subdesc == 1) { printf "\n"; next } /^#\-\-\-/ { printf "\n"; next }' $(MAKEFILE_LIST)
	

.DEFAULT_GOAL := help
default: help

.PHONY: deploy-plugin undeploy all help