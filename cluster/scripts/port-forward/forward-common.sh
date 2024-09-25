#!/usr/bin/env bash

function do_it () {
  local CURRENT_DIR
  CURRENT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

  export LOCK_FILE="${CURRENT_DIR}"/forward.lock
}
do_it
