import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const levelOrder: LogLevel[] = ['debug', 'info', 'warn', 'error'];

export class Logger {
  private readonly level: LogLevel;
  constructor({ level }) {
    this.level = level;
  }

  debug(...args: any[]) {
    if (!this.shouldOuptut('debug')) {
      return;
    }

    console.log('[DEBUG]', ...args);
  }

  info(...args: any[]) {
    if (!this.shouldOuptut('info')) {
      return;
    }

    console.log('[INFO]', ...args);
  }

  warn(...args: any[]) {
    if (!this.shouldOuptut('warn')) {
      return;
    }

    console.warn('[WARN]', ...args);
  }

  error(...args: any[]) {
    if (!this.shouldOuptut('error')) {
      return;
    }

    console.error('[ERROR]', ...args);
  }

  async time(
    cb: () => Promise<void>,
    {
      onStart,
      onEnd,
    }: { onStart?: () => void; onEnd?: (ms: number) => void } = {},
  ) {
    onStart?.();
    const before = new Date();
    await cb();
    const after = new Date();
    const ms =
      after.getSeconds() * 1000 +
      after.getMilliseconds() -
      (before.getSeconds() * 1000 + before.getMilliseconds());
    onEnd?.(ms);
  }

  private shouldOuptut(level: LogLevel) {
    const baseIndex = levelOrder.findIndex((l) => l === this.level);
    const targetIndex = levelOrder.findIndex((l) => l === level);

    return targetIndex >= baseIndex;
  }
}

@Injectable()
export class LoggerService {
  private readonly _logger: Logger;

  constructor(private configService: ConfigService) {
    const level = this.configService.get('LOG_LEVEL') || 'info';
    this._logger = new Logger({ level });
  }

  get logger() {
    return this._logger;
  }
}
