package application

import "errors"

var (
	ErrFailedToStartApplication = errors.New("failed to run node")
	ErrFailedToStopApplication  = errors.New("failed to stop running node")
	ErrFailedToCreateLocalRepo  = errors.New("failed to create local repo")
	ErrFailedToWriteConfig      = errors.New("failed to write config")
	ErrSetDetails               = errors.New("failed to set details")
	ErrBadInput                 = errors.New("bad input")
	ErrApplicationIsNotRunning  = errors.New("application is not running")
)
