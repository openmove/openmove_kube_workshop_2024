import log_facility
import plugins
import src
from _confs import Options

def main():
    log = log_facility.init_logger()
    log.info('Logger instantiated')

    log.debug('Preparing to parse env options')
    confs = Options(log)

    log.debug('Preparing to instantiate plugins')
    plugins.instantiate_plugins(confs)

    log.debug('Preparing to start imaginer')
    src.start_imaginer(confs)

if __name__ == "__main__":
    main()
