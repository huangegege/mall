import { LOGGER_WINSTON_PROVIDER, LOGGER_LEVEL } from './logger.constants';
import { transports, createLogger } from 'winston';
import { format } from 'logform';

export const loggerProviders = [
  {
    provide: LOGGER_WINSTON_PROVIDER,
    useFactory: () => {
      const LOG_LEVEL = process.env.LOG_LEVEL;

      const logger = createLogger({
        level: LOG_LEVEL,
        format: format.combine(
          format.colorize(),
          format.timestamp(),
          format.printf((nfo) => {
            return `${nfo.timestamp} ${nfo.level}: ${nfo.message}`;
          })
        ),
        transports: [
          new transports.File({ filename: 'error.log', level: LOGGER_LEVEL.ERROR}),
          new transports.File({ filename: 'combined.log' })
        ]
      });

      if (process.env.NODE_ENV !== 'production') {
        logger.add(new transports.Console({
          format: format.simple()
        }));
      }

      return logger;
    }
  }
];
