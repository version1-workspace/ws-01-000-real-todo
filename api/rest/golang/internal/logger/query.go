package logger

import "log"

type queryLogger struct {
	Verbose bool
}

func NewQueryLogger(verbose bool) *queryLogger {
	return &queryLogger{Verbose: verbose}
}

func (l *queryLogger) PrintWithColor(args ...any) {
	if !l.Verbose {
		return
	}

	_args := []any{Cyan}
	_args = append(_args, args...)
	_args = append(_args, Reset)
	log.Println(_args...)
}

var Reset = "\033[0m"
var Red = "\033[31m"
var Green = "\033[32m"
var Yellow = "\033[33m"
var Blue = "\033[34m"
var Magenta = "\033[35m"
var Cyan = "\033[36m"
var Gray = "\033[37m"
var White = "\033[97m"
