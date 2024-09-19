import log_facility
import _confs
import plugins

def main():
    log = log_facility.init_logger()
    log.info('Logger instantiated')

    log.debug('Preparing to parse env options')
    confs = _confs.Options(log)

    log.debug('Preparing to instantiate plugins')
    plugins.instantiate_plugins(confs)


if __name__ == "__main__":
    main()
