import logging
import colorlog

def init_logger():
  logger = logging.getLogger('Imaginer')
  logger.setLevel(logging.DEBUG)
  handler = logging.StreamHandler()

  # Create a formatter that includes colors
  formatter = colorlog.ColoredFormatter(
      "%(log_color)s%(asctime)s | %(name)s | %(levelname)s - %(message)s",
      datefmt=None,
      reset=True,
      log_colors={
          'DEBUG': 'blue',
          'INFO': 'green',
          'WARNING': 'yellow',
          'ERROR': 'red',
          'CRITICAL': 'bold_red',
      }
  )

  handler.setFormatter(formatter)
  logger.addHandler(handler)

  return logger
