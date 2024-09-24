#!/usr/bin/env bash

function darwin_initialize() {
  local CPU=${CPU:-4}
  local MEMORY=${MEMORY:-6}
  local DISK=${DISK:-60}
  local GREEN='\033[0;32m'
  local NC='\033[0m' # No Color
  echo "${GREEN}Initializing microk8s cluster with ${CPU} cores, ${MEMORY} Gb of memory and ${DISK} Gb of storage.${NC}"

  microk8s install --channel=1.26 --cpu=${CPU} --mem=${MEMORY} --disk=${DISK}
  microk8s status --wait-ready
  microk8s enable dns
  microk8s enable storage

  microk8s kubectl delete storageclasses.storage.k8s.io microk8s-hostpath
  microk8s kubectl apply -f ./storage-class.yaml

  echo "${GREEN}Microk8s started and ready!!${NC}"
  echo "If you want to setup a microk8s context refer to the guide in the doc. You will need the following info:"

  microk8s kubectl config view --raw
}


function do_it() {
  local FORCE_mk8s_INIT=${FORCE_mk8s_INIT}

  if command -v microk8s &> /dev/null; then
    if [[ ! -z ${FORCE_mk8s_INIT} ]]; then
      echo "Force installation enabled, proceeding with reinstallation"
      microk8s stop 2> /dev/null
      microk8s uninstall 2> /dev/null
      multipass delete --all 2> /dev/null
      multipass purge 2> /dev/null
    else
      echo "Microk8s already installed. Skipping."
      return;
    fi
  fi

  case "$(uname -s)" in
    Linux*)     {
                  echo "Current operating system: linux."
                  echo "Proceding with installation using snap."
                  snap install microk8s --classic
                  echo "Add current user to microk8s group"
                  sudo usermod -a -G microk8s $USER
                  darwin_initialize "$@"
                };;
    Darwin*)    {
                  echo "Current operating system: Darwin."
                  echo "Proceding with installation using brew. Please be sure homebrew is set up on this machine."

                  brew install ubuntu/microk8s/microk8s
                  darwin_initialize "$@"

                };;
    *)          {
                  echo "This script doesn't support your platform."
                };;
  esac
}

do_it "$@"
