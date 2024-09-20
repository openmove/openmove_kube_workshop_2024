#!/usr/bin/env bash

function do_it () {
  local CURRENT_DIR
  CURRENT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

  # shellcheck source=forward-common.sh
  source "${CURRENT_DIR}"/forward-common.sh
  KUBE_FORWARD="kubectl port-forward"

  if [ -e "${LOCK_FILE}" ]; then
    echo "Already forwarding"

    # shellcheck source=stop-forward.sh
    source "${CURRENT_DIR}/stop-forward.sh"
  fi

  local FORWARDS
  #mapfile -t FORWARDS < _cluster-management/scripts/port-forward/_forwards.conf
  while IFS= read -r line; do FORWARDS+=("$line"); done < "${CURRENT_DIR}/_forwards.conf"

  for A_FORWARD in "${FORWARDS[@]}"
  do
    local FORWARD_CONF
    local NETCAT_LOG_FILE

    IFS=" " read -r -a FORWARD_CONF <<< "${A_FORWARD}"

    ${KUBE_FORWARD} "${FORWARD_CONF[0]}" "${FORWARD_CONF[1]}" --address='0.0.0.0' --namespace "${FORWARD_CONF[2]}" > "${CURRENT_DIR}"/logs/"$(echo "${FORWARD_CONF[0]}" | sed -e 's/\//-/g')".log 2>&1 &
    echo $! >> "${LOCK_FILE}"

    NETCAT_LOG_FILE="${CURRENT_DIR}"/logs/socat-"$(echo "${FORWARD_CONF[0]}" | sed -e 's/\//-/g')".log

    rm -Rf "${NETCAT_LOG_FILE}"
    while true; do
      nc -vz 127.0.0.1 "${FORWARD_CONF[1]}" >> "${NETCAT_LOG_FILE}" 2>&1;
      sleep 1;
    done &
    echo $! >> "${LOCK_FILE}"

  done

  echo "Forwarding ready"
}
do_it
