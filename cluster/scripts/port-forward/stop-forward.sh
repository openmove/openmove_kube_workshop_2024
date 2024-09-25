#!/usr/bin/env bash

function do_it () {
  local CURRENT_DIR
  CURRENT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

  # shellcheck source=forward-common.sh
  source "${CURRENT_DIR}"/forward-common.sh

  if [ -e "${LOCK_FILE}" ]; then
    while IFS="" read -r p || [ -n "$p" ]
    do
      kill -9 "${p}"
    done < "${LOCK_FILE}"

    rm -Rf "${LOCK_FILE}"
    rm -Rf "${CURRENT_DIR}"/logs/*
    return 0
  fi

  echo "No forwarding"
  return 1
}
do_it
